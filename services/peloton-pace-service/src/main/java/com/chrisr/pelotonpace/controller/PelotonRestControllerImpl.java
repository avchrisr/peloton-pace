package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.controller.data.PelotonLoginResponse;
import com.chrisr.pelotonpace.controller.data.PelotonWorkoutHistoryItem;
import com.chrisr.pelotonpace.exception.AppException;
import com.chrisr.pelotonpace.exception.BadRequestException;
import com.chrisr.pelotonpace.exception.UserNotFoundException;
import com.chrisr.pelotonpace.repository.entity.PelotonUserSession;
import com.chrisr.pelotonpace.request.PelotonRetrieveWorkoutHistoryRequest;
import com.chrisr.pelotonpace.service.PelotonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@RestController
public class PelotonRestControllerImpl implements PelotonRestController {

	private static final Logger logger = LoggerFactory.getLogger(PelotonRestControllerImpl.class);

	private static final String PELOTON_LOGIN_URL = "https://api.pelotoncycle.com/auth/login";

	private final PelotonService pelotonService;
	private final RestTemplate restTemplate;

    @Autowired
	PelotonRestControllerImpl(PelotonService pelotonService,
							  RestTemplate restTemplate) {
        this.pelotonService = pelotonService;
        this.restTemplate = restTemplate;
    }

	@Override
	public ResponseEntity<List<PelotonWorkoutHistoryItem>> retrieveWorkoutHistory(@Valid @RequestBody PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest) {
    	if (pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email() == null ||
			pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email().isBlank()) {
    		throw new BadRequestException("Username is required");
		}

    	// WORKFLOW
		// 1. look up peloton user session to get the existing user session id to reuse, if exists
		// 2. if exists, use it to send a request to download workout history
		//    if NOT exist, log into Peloton API and get a new peloton user session id
		//      - store it in peloton_user_session table
		//      - send a request to download workout history

		PelotonUserSession pelotonUserSession = pelotonService.getPelotonUserSessionByUsername(pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email());
    	if (pelotonUserSession == null) {
			pelotonUserSession = logIntoPelotonAndSaveUserSession(pelotonRetrieveWorkoutHistoryRequest);
		}

    	try {
			String workoutHistoryCsv = downloadWorkoutHistoryFromPeloton(pelotonUserSession);
			return ResponseEntity.ok().body(buildWorkoutHistoryItems(workoutHistoryCsv));
		} catch (HttpClientErrorException e) {
			System.out.println("ERROR = " + e.getMessage());

			if (e.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
				logger.error("SessionId may have expired. Trying logging in again to renew session...");

				PelotonLoginResponse pelotonLoginResponse = logIntoPeloton(pelotonRetrieveWorkoutHistoryRequest);
				pelotonUserSession.setSessionId(pelotonLoginResponse.getSessionId());

				pelotonService.updatePelotonUserSessionById(pelotonUserSession);

				String workoutHistoryCsv = downloadWorkoutHistoryFromPeloton(pelotonUserSession);
				return ResponseEntity.ok().body(buildWorkoutHistoryItems(workoutHistoryCsv));

			}
			throw new AppException(e.getMessage(), e);
		}
	}

	private List<PelotonWorkoutHistoryItem> buildWorkoutHistoryItems(String workoutHistoryCsv) {
		List<PelotonWorkoutHistoryItem> pelotonWorkoutHistoryItems = new ArrayList<>();

		int lineCount = 0;
		Scanner scanner = new Scanner(workoutHistoryCsv);
		while (scanner.hasNextLine()) {
			lineCount += 1;
			String line = scanner.nextLine();
			System.out.println("scanner.nextLine() = " + line);

			if (lineCount > 1) {
				String[] workoutHistoryItemSplit = line.split(",");

				if ("Cycling".equalsIgnoreCase(workoutHistoryItemSplit[4])) {
					PelotonWorkoutHistoryItem pelotonWorkoutHistoryItem = new PelotonWorkoutHistoryItem();
					pelotonWorkoutHistoryItem.setWorkoutDate(workoutHistoryItemSplit[0].substring(0, 10));
					pelotonWorkoutHistoryItem.setInstructorName(workoutHistoryItemSplit[2]);
					pelotonWorkoutHistoryItem.setClassDuration(Integer.parseInt(workoutHistoryItemSplit[3]));
					pelotonWorkoutHistoryItem.setFitnessType(workoutHistoryItemSplit[4]);
					pelotonWorkoutHistoryItem.setClassTitle(workoutHistoryItemSplit[6]);
					pelotonWorkoutHistoryItem.setCaloriesBurned(Integer.parseInt(workoutHistoryItemSplit[14]));
					if (workoutHistoryItemSplit.length > 15 && !workoutHistoryItemSplit[15].isBlank()) {
						pelotonWorkoutHistoryItem.setAvgHeartRate(Math.round(Float.parseFloat(workoutHistoryItemSplit[15])));
					}

					pelotonWorkoutHistoryItems.add(pelotonWorkoutHistoryItem);
				}
			}
		}
		scanner.close();

		return pelotonWorkoutHistoryItems;
	}

	private String downloadWorkoutHistoryFromPeloton(PelotonUserSession pelotonUserSession) {

		// ref) https://github.com/jrit/peloton-to-tcx/blob/master/lib/peloton-api.js

		// user workout history (json response)
		// https://api.pelotoncycle.com/api/user/a5a7e230614842e98b6205b80fb79fa6/workouts?joins=peloton.ride&limit=20&page=0&sort_by=-created

		// specific workout (json response)
		// https://api.pelotoncycle.com/api/workout/637c041ede334f9098b09931592f72a2?joins=peloton,peloton.ride,peloton.ride.instructor,user


		// GET workout history in csv (text)
		String urlString = "https://api.onepeloton.com/api/user/" + pelotonUserSession.getUserId() + "/workout_history_csv?timezone=America/Los_Angeles";

		HttpHeaders httpHeaders = new HttpHeaders();
		String cookieValue = "peloton_session_id=" + pelotonUserSession.getSessionId();
		httpHeaders.set("Cookie", cookieValue);

		HttpEntity entity = new HttpEntity(httpHeaders);

		ResponseEntity<String> response = restTemplate.exchange(urlString, HttpMethod.GET, entity, String.class);

		int statusCode = response.getStatusCodeValue();
		String responseString = response.getBody();

		System.out.println("download history response = " + responseString);

		return responseString;


		/*

Workout Timestamp,Live/On-Demand,Instructor Name,Length (minutes),Fitness Discipline,Type,Title,Class Timestamp,Total Output,Avg. Watts,Avg. Resistance,Avg. Cadence (RPM),Avg. Speed (mph),Distance (mi),Calories Burned,Avg. Heartrate,Avg. Incline,Avg. Pace (min/mi)
2019-06-15 11:15 (PDT),On Demand,Emma Lovewell,20,Cycling,Beginner,20 min Beginner Ride,2019-05-21 12:07 (PDT),,,,,,,110,,,
2019-06-16 20:42 (PDT),On Demand,Robin Arzon,20,Cycling,Beginner,20 min Beginner Ride,2019-04-16 11:27 (PDT),,,,,,,122,,,
2019-06-17 22:27 (PDT),On Demand,Emma Lovewell,20,Cycling,Beginner,20 min Beginner Ride,2019-01-06 15:00 (PDT),,,,,,,195,117.17,,
2019-06-17 23:01 (PDT),On Demand,Jess King,20,Cycling,Theme,20 min EDM/Electronic Dance Ride,2019-04-15 13:19 (PDT),,,,,,,279,151.78,,
2019-06-18 18:01 (PDT),On Demand,Hannah Marie Corbin,5,Stretching,Pre & Post-Ride Stretch,5 min Pre-Ride Warm Up,2019-06-03 11:34 (PDT),,,,,,,14,,,
2019-06-18 18:07 (PDT),On Demand,Jess King,5,Stretching,Pre & Post-Ride Stretch,5 min Pre-Ride Warm Up,2019-05-31 11:39 (PDT),,,,,,,14,,,
2019-06-18 18:13 (PDT),On Demand,Robin Arzon,5,Stretching,Pre & Post-Ride Stretch,5 min Post-Ride Stretch,2019-06-18 12:47 (PDT),,,,,,,14,,,
2019-06-18 18:38 (PDT),On Demand,Cody Rigsby,20,Cycling,Theme,20 min Beginner Ride,2018-08-24 12:11 (PDT),,,,,,,234,137.98,,
2019-06-18 19:05 (PDT),On Demand,Matt Wilpers,20,Cycling,Theme,20 min EDM/Electronic Dance Ride,2019-05-10 07:51 (PDT),,,,,,,272,150.21,,
2019-06-19 18:49 (PDT),On Demand,Jennifer Jacobs,5,Stretching,Pre & Post-Ride Stretch,5 min Pre-Ride Warm Up,2019-05-23 12:10 (PDT),,,,,,,14,,,
2019-06-19 19:12 (PDT),On Demand,Hannah Marie Corbin,30,Cycling,Theme,30 min Pick-Me-Up Ride,2018-04-13 08:19 (PDT),,,,,,,400,148.43,,
2019-06-20 21:54 (PDT),On Demand,Leanne Hainsby,5,Stretching,Pre & Post-Ride Stretch,5 min Post-Ride Stretch,2019-06-17 08:11 (PDT),,,,,,,28,,,
2019-06-21 18:34 (PDT),On Demand,Aditi Shah,5,Meditation,Emotions,5 min Beginner Peace Meditation,2019-06-14 14:00 (PDT),,,,,,,,,,
2019-06-22 10:12 (PDT),On Demand,Olivia Amato,30,Cycling,Theme,30 min EDM/Electronic Dance Ride,2019-06-08 12:21 (PDT),,,,,,,359,134.10,,
2019-06-23 16:35 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Groove Ride,2019-06-05 10:20 (PDT),,,,,,,448,158.58,,
2019-06-24 18:22 (PDT),On Demand,Rebecca Kennedy,5,Stretching,Pre & Post-Run Stretch,5 min Active Recovery: Hips,2019-06-24 06:32 (PDT),,,,,,,14,,,
2019-06-25 18:38 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min EDM/Electronic Dance Ride,2019-05-21 10:18 (PDT),,,,,,,455,160.07,,
2019-06-26 18:54 (PDT),On Demand,Cody Rigsby,5,Strength,Core,5 min Core Strength,2019-06-17 06:00 (PDT),,,,,,,28,,,
2019-06-27 18:47 (PDT),On Demand,Jess King,30,Cycling,Theme,30 min EDM/Electronic Dance Ride,2019-04-30 09:18 (PDT),,,,,,,445,157.97,,
2019-06-28 18:58 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Groove Ride,2019-05-05 07:44 (PDT),,,,,,,423,153.29,,
2019-06-29 18:48 (PDT),On Demand,Kristin McGee,5,Meditation,Guided Visualization,5 min Empathy Meditation,2019-06-27 08:00 (PDT),,,,,,,,,,
2019-06-30 11:17 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Groove Ride,2019-04-23 10:18 (PDT),,,,,,,413,151.01,,
2019-07-01 09:39 (PDT),On Demand,Robin Arzon,30,Cycling,Intervals,30 min HIIT Ride,2019-05-10 10:17 (PDT),,,,,,,432,155.08,,
2019-07-01 20:02 (PDT),On Demand,Ben Alldis,30,Cycling,Theme,30 min House Ride,2019-06-13 18:54 (PDT),,,,,,,424,153.52,,
2019-07-02 19:11 (PDT),On Demand,Anna Greenberg,5,Meditation,Emotions,5 min Beginner Kindness Meditation,2019-07-02 07:27 (PDT),,,,,,,,,,
2019-07-03 20:59 (PDT),On Demand,Aditi Shah,5,Meditation,Meditation Basics,5 min Basics: Emotional Balance,2019-06-27 13:41 (PDT),,,,,,,,,,
2019-07-04 11:38 (PDT),On Demand,Jess King,30,Cycling,Theme,30 min EDM/Electronic Dance Ride,2019-05-05 10:44 (PDT),,,,,,,410,150.41,,
2019-07-05 12:14 (PDT),On Demand,Leanne Hainsby,30,Cycling,Intervals,30 min HIIT Ride,2019-07-04 10:20 (PDT),,,,,,,418,152.11,,
2019-07-06 11:47 (PDT),On Demand,Olivia Amato,30,Cycling,Intervals,30 min HIIT Ride,2019-05-07 13:16 (PDT),,,,,,,422,152.97,,
2019-07-07 15:54 (PDT),On Demand,Emma Lovewell,5,Strength,Core,5 min Core Strength,2019-05-28 06:00 (PDT),,,,,,,28,,,
2019-07-08 20:43 (PDT),On Demand,Anna Greenberg,5,Meditation,Meditation Anywhere,5 min Office Meditation,2019-06-25 07:21 (PDT),,,,,,,,,,
2019-07-09 18:48 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Groove Ride,2019-07-02 10:18 (PDT),,,,,,,395,147.09,,
2019-07-10 20:50 (PDT),On Demand,Anna Greenberg,5,Meditation,Meditation Basics,5 min Basics: Mantra,2019-07-10 12:51 (PDT),,,,,,,,,,
2019-07-11 22:19 (PDT),On Demand,Aditi Shah,5,Meditation,Meditation Anywhere,5 min Meditate While You Wait,2019-07-11 08:00 (PDT),,,,,,,,,,
2019-07-12 01:17 (PDT),On Demand,Kristin McGee,5,Meditation,Meditation Basics,5 min Meditation Basics: Sleep ,2019-07-01 13:04 (PDT),,,,,,,,,,
2019-07-12 19:05 (PDT),On Demand,Jess King,30,Cycling,Theme,30 min EDM/Electronic Dance Ride,2019-07-02 09:19 (PDT),,,,,,,439,156.09,,
2019-07-13 16:00 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Groove Ride,2019-06-25 10:20 (PDT),,,,,,,394,146.54,,
2019-07-14 12:44 (PDT),On Demand,Anna Greenberg,5,Meditation,Meditation Basics,5 min Basics: Body Scan,2019-07-11 08:00 (PDT),,,,,,,,,,
2019-07-15 20:58 (PDT),On Demand,Kristin McGee,5,Meditation,Emotions,5 min Meditation for Healing,2019-07-14 09:41 (PDT),,,,,,,,,,
2019-07-17 18:38 (PDT),On Demand,Jess King,30,Cycling,Theme,30 min Electronic Dance/EDM Ride,2019-03-03 12:19 (PDT),,,,,,,415,151.01,,
2019-07-19 19:04 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Groove Ride,2019-04-09 10:19 (PDT),,,,,,,422,152.72,,
2019-07-23 18:49 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Groove Ride,2019-07-23 10:19 (PDT),,,,,,,408,149.80,,
2019-07-24 18:41 (PDT),On Demand,Jess King,20,Cycling,Theme,20 min Trap Music Ride,2019-07-22 13:51 (PDT),,,,,,,269,148.70,,
2019-07-27 11:21 (PDT),On Demand,Hannah Marie Corbin,30,Cycling,Intervals,30 min HIIT Ride,2018-02-10 10:49 (PDT),,,,,,,407,149.36,,
2019-07-31 18:47 (PDT),On Demand,Leanne Hainsby,30,Cycling,Intervals,30 min HIIT Ride,2019-07-29 06:21 (PDT),,,,,,,435,155.67,,
2019-08-01 11:11 (PDT),On Demand,Leanne Hainsby,30,Cycling,Intervals,30 min HIIT Ride,2019-07-23 21:50 (PDT),,,,,,,416,151.43,,
2019-08-07 18:45 (PDT),On Demand,Leanne Hainsby,30,Cycling,Intervals,30 min HIIT Ride,2019-07-18 18:18 (PDT),,,,,,,410,150.06,,
2019-08-11 09:46 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min Electronic Dance/EDM Ride,2019-04-15 07:19 (PDT),,,,,,,348,137.17,,
2019-08-15 17:52 (PDT),On Demand,Jess King,30,Cycling,Theme,30 min EDM/Electronic Dance Ride,2019-08-12 13:19 (PDT),,,,,,,420,152.05,,
2019-08-18 11:04 (PDT),On Demand,Leanne Hainsby,30,Cycling,Intervals,30 min HIIT Ride,2019-08-10 04:50 (PDT),,,,,,,421,152.28,,
2019-08-22 18:44 (PDT),On Demand,Leanne Hainsby,30,Cycling,Intervals,30 min HIIT Ride,2019-08-20 21:50 (PDT),,,,,,,439,156.17,,
2019-08-28 18:45 (PDT),On Demand,Emma Lovewell,30,Cycling,Theme,30 min EDM/Electronic Dance Ride,2019-08-28 10:20 (PDT),,,,,,,410,150.26,,
2019-09-02 09:40 (PDT),On Demand,Leanne Hainsby,20,Cycling,Intervals,20 min HIIT Ride,2019-08-29 22:50 (PDT),,,,,,,257,144.83,,
2019-09-09 18:36 (PDT),On Demand,Olivia Amato,30,Cycling,Intervals,30 min HIIT Ride,2019-09-09 08:19 (PDT),,,,,,,373,142.22,,

		 */
	}

	private PelotonUserSession logIntoPelotonAndSaveUserSession(PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest) {
		// log in and get a new peloton user session
		PelotonLoginResponse pelotonLoginResponse = logIntoPeloton(pelotonRetrieveWorkoutHistoryRequest);

		// store it in peloton_user_session table
		PelotonUserSession pelotonUserSession = new PelotonUserSession();
		pelotonUserSession.setSessionId(pelotonLoginResponse.getSessionId());
		pelotonUserSession.setUserId(pelotonLoginResponse.getUserId());
		pelotonUserSession.setUsername(pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email());
		pelotonService.addPelotonUserSession(pelotonUserSession);

		return pelotonUserSession;
	}

	private PelotonLoginResponse logIntoPeloton(PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest) {

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//		httpHeaders.setAccept(MediaType.APPLICATION_JSON);

		HttpEntity<PelotonRetrieveWorkoutHistoryRequest> request = new HttpEntity<>(pelotonRetrieveWorkoutHistoryRequest, httpHeaders);

		try {
			PelotonLoginResponse pelotonLoginResponse = restTemplate.postForObject(PELOTON_LOGIN_URL, request, PelotonLoginResponse.class);
			return pelotonLoginResponse;
		} catch (HttpClientErrorException e) {
			if (e.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
				throw new UserNotFoundException("Unable to log into Peloton. Please ensure that username/password are correct.");
			}
			throw new AppException(e.getMessage(), e);
		}
	}
}
