package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.controller.data.PelotonLoginRequest;
import com.chrisr.pelotonpace.controller.data.PelotonLoginResponse;
import com.chrisr.pelotonpace.controller.data.PelotonWorkoutDetail;
import com.chrisr.pelotonpace.controller.data.PelotonWorkoutHistoryItem;
import com.chrisr.pelotonpace.exception.AppException;
import com.chrisr.pelotonpace.exception.UserNotFoundException;
import com.chrisr.pelotonpace.repository.entity.PelotonUserSession;
import com.chrisr.pelotonpace.response.PelotonWorkoutDetailResponse;
import com.chrisr.pelotonpace.service.PelotonService;
import com.chrisr.pelotonpace.service.UserService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@RestController
public class PelotonRestControllerImpl implements PelotonRestController {

	private static final Logger logger = LoggerFactory.getLogger(PelotonRestControllerImpl.class);

	private static final String PELOTON_BASE_URL = "https://api.pelotoncycle.com";
	private static final String PELOTON_LOGIN_URL = PELOTON_BASE_URL + "/auth/login";
	private static final String PELOTON_WORKOUT_SUMMARY_URL = PELOTON_BASE_URL + "/api/user/:userId/workouts?joins=user,ride,ride.instructor&limit=:limit&page=:page&sort_by=-created";
	private static final String PELOTON_WORKOUT_DETAIL_URL = PELOTON_BASE_URL + "/api/workout/:workoutId";
	private static final String PELOTON_WORKOUT_METRICS_URL = PELOTON_BASE_URL + "/api/workout/:workoutId/performance_graph?every_n=5";
	private static final String PELOTON_RIDE_DETAIL_URL = PELOTON_BASE_URL + "/api/ride/:rideId/details";

	private static final ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

	private final PelotonService pelotonService;
	private final UserService userService;
	private final RestTemplate restTemplate;

    @Autowired
	PelotonRestControllerImpl(PelotonService pelotonService,
							  UserService userService,
							  RestTemplate restTemplate) {
        this.pelotonService = pelotonService;
        this.userService = userService;
        this.restTemplate = restTemplate;
    }

	@Override
	public ResponseEntity<String> getWorkoutSummary(String limit, String page) {

    	if (limit == null || limit.isBlank()) {
    		limit = "10";
		}
    	if (page == null || page.isBlank()) {
    		page = "0";
		}

		PelotonUserSession pelotonUserSession = getPelotonUserSession();

    	String url = PELOTON_WORKOUT_SUMMARY_URL
				.replace(":userId", pelotonUserSession.getUserId())
				.replace(":limit", limit)
				.replace(":page", page);

		String workoutSummaryData = sendRequestToPeloton(url, pelotonUserSession.getSessionId());
		return ResponseEntity.ok().body(workoutSummaryData);
	}

	@Override
	public ResponseEntity<PelotonWorkoutDetailResponse> getWorkoutDetail(String workoutId) {
		PelotonWorkoutDetail pelotonWorkoutDetail;

		PelotonUserSession pelotonUserSession = getPelotonUserSession();

    	String url = PELOTON_WORKOUT_DETAIL_URL.replace(":workoutId", workoutId);
		System.out.println("Workout Detail URL = " + url);

		String workoutDetail = sendRequestToPeloton(url, pelotonUserSession.getSessionId());

		url = PELOTON_WORKOUT_METRICS_URL.replace(":workoutId", workoutId);
		System.out.println("Workout Metrics URL = " + url);

		String workoutMetrics = sendRequestToPeloton(url, pelotonUserSession.getSessionId());

		try {
			pelotonWorkoutDetail = objectMapper.readValue(workoutDetail, PelotonWorkoutDetail.class);
		} catch (IOException e) {
			throw new AppException(e.getMessage(), e);
		}

		url = PELOTON_RIDE_DETAIL_URL.replace(":rideId", pelotonWorkoutDetail.getRide().getId());
		System.out.println("Ride Detail URL = " + url);

		String rideDetail = sendRequestToPeloton(url, pelotonUserSession.getSessionId());

		PelotonWorkoutDetailResponse pelotonWorkoutDetailResponse =
				new PelotonWorkoutDetailResponse(workoutDetail, workoutMetrics, rideDetail);

		return ResponseEntity.ok().body(pelotonWorkoutDetailResponse);


		// 1. query workout summary    ex) https://api.pelotoncycle.com/api/workout/d4b2edd19b1041ec81ad7cf297573ede
		//    - workout summary includes the ride id
		//    - may not need instructor info as it's included in ride detail
		//    - same for user, as the user info should already have been fetched

		// 2. workout metrics
		// https://api.onepeloton.com/api/workout/d4b2edd19b1041ec81ad7cf297573ede/performance_graph?every_n=1		<--  use ?every_n=5

		// 3. query ride detail			ex) https://api.onepeloton.com/api/ride/157bc6faa9ad4ea191e0c905ab9ce6fe/details	<-- includes playlists, etc

	}

//	@Override
//	public ResponseEntity<List<PelotonWorkoutHistoryItem>> retrieveWorkoutHistory(@Valid @RequestBody PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest) {
//    	if (pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email() == null ||
//			pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email().isBlank()) {
//    		throw new BadRequestException("Username is required");
//		}
//
//    	// WORKFLOW
//		// 1. look up peloton user session to get the existing user session id to reuse, if exists
//		// 2. if exists, use it to send a request to download workout history
//		//    if NOT exist, log into Peloton API and get a new peloton user session id
//		//      - store it in peloton_user_session table
//		//      - send a request to download workout history
//
//		PelotonUserSession pelotonUserSession = pelotonService.getPelotonUserSessionByUsername(pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email());
//    	if (pelotonUserSession == null) {
//			pelotonUserSession = logIntoPelotonAndSaveUserSession(pelotonRetrieveWorkoutHistoryRequest);
//		}
//
//    	try {
//			String workoutHistoryCsv = retrieveDataFromPeloton(pelotonUserSession);
//			return ResponseEntity.ok().body(buildWorkoutHistoryItems(workoutHistoryCsv));
//		} catch (HttpClientErrorException e) {
//			System.out.println("ERROR = " + e.getMessage());
//
//			if (e.getStatusCode().equals(HttpStatus.UNAUTHORIZED)) {
//				logger.error("SessionId may have expired. Trying logging in again to renew session...");
//
//				PelotonLoginResponse pelotonLoginResponse = logIntoPeloton(pelotonRetrieveWorkoutHistoryRequest);
//				pelotonUserSession.setSessionId(pelotonLoginResponse.getSessionId());
//
//				pelotonService.updatePelotonUserSessionById(pelotonUserSession);
//
//				String workoutHistoryCsv = retrieveDataFromPeloton(pelotonUserSession);
//				return ResponseEntity.ok().body(buildWorkoutHistoryItems(workoutHistoryCsv));
//
//			}
//			throw new AppException(e.getMessage(), e);
//		}
//	}

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

	private String sendRequestToPeloton(String url, String pelotonSessionId) {

    	// most recent 10 (workout summary)
		// https://api.pelotoncycle.com/api/user/a5a7e230614842e98b6205b80fb79fa6/workouts?joins=user,ride,ride.instructor&limit=10&page=0&sort_by=-created

		// workout
		// https://api.pelotoncycle.com/api/workout/d4b2edd19b1041ec81ad7cf297573ede		<--  use this
		// https://api.pelotoncycle.com/api/workout/d4b2edd19b1041ec81ad7cf297573ede?joins=user,ride,ride.instructor

		// workout metrics
		// https://api.onepeloton.com/api/workout/d4b2edd19b1041ec81ad7cf297573ede/performance_graph?every_n=1		<--  use ?every_n=5

    	// ride detail
		// https://api.onepeloton.com/api/ride/157bc6faa9ad4ea191e0c905ab9ce6fe/details

		// --------------------------------------------------------------------------------

		// ref) https://github.com/jrit/peloton-to-tcx/blob/master/lib/peloton-api.js



		// GET workout history in csv (text)
//		String urlString = "https://api.onepeloton.com/api/user/" + pelotonUserSession.getUserId() + "/workout_history_csv?timezone=America/Los_Angeles";

		HttpHeaders httpHeaders = new HttpHeaders();
		String cookieValue = "peloton_session_id=" + pelotonSessionId;
		httpHeaders.set("Cookie", cookieValue);

		HttpEntity entity = new HttpEntity(httpHeaders);


		// TODO: if unauthorized error, try logging in and getting a new sessionId

//		PelotonUserSession pelotonUserSession = pelotonService.getPelotonUserSessionByUsername(pelotonRetrieveWorkoutHistoryRequest.getUsername_or_email());
//    	if (pelotonUserSession == null) {
//			pelotonUserSession = logIntoPelotonAndSaveUserSession(pelotonRetrieveWorkoutHistoryRequest);
//		}

		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

		int statusCode = response.getStatusCodeValue();
		String responseString = response.getBody();

		System.out.println("Peloton Fetched Data = " + responseString);

		return responseString;
	}

	private PelotonUserSession logIntoPelotonAndSaveUserSession(String pelotonPaceUsername) {
    	// look up user profile and get Peloton username / password
		com.chrisr.pelotonpace.repository.entity.User user = userService.getUserByUsername(pelotonPaceUsername);

		// ensure that Peloton credential exists
		if (user.getPelotonUsername() == null || user.getPelotonUsername().isBlank() ||
			user.getPelotonPassword() == null || user.getPelotonPassword().isBlank()) {
			throw new AppException("Peloton credential not found. Please update user profile with Peloton credential.");
		}

		// log in and get a new peloton user session
		PelotonLoginRequest pelotonLoginRequest = new PelotonLoginRequest(user.getPelotonUsername(), user.getPelotonPassword());
		PelotonLoginResponse pelotonLoginResponse = logIntoPeloton(pelotonLoginRequest);

		// store it in peloton_user_session table
		PelotonUserSession pelotonUserSession = new PelotonUserSession();
		pelotonUserSession.setSessionId(pelotonLoginResponse.getSessionId());
		pelotonUserSession.setUserId(pelotonLoginResponse.getUserId());
		pelotonUserSession.setUsername(pelotonLoginRequest.getUsername_or_email());

		User userPrincipal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		pelotonUserSession.setPelotonPaceUsername(userPrincipal.getUsername());

		pelotonService.addPelotonUserSession(pelotonUserSession);
		return pelotonUserSession;
	}

	private PelotonLoginResponse logIntoPeloton(PelotonLoginRequest pelotonLoginRequest) {

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//		httpHeaders.setAccept(MediaType.APPLICATION_JSON);

		HttpEntity<PelotonLoginRequest> request = new HttpEntity<>(pelotonLoginRequest, httpHeaders);

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

	private PelotonUserSession getPelotonUserSession() {
		User userPrincipal = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String pelotonPaceUsername = userPrincipal.getUsername();
		PelotonUserSession pelotonUserSession = pelotonService.getPelotonUserSessionByUsername(pelotonPaceUsername);
		if (pelotonUserSession == null) {
			pelotonUserSession = logIntoPelotonAndSaveUserSession(pelotonPaceUsername);
		}
		return pelotonUserSession;
	}
}
