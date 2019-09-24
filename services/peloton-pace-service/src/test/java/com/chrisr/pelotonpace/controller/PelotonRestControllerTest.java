package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.controller.data.PelotonWorkoutHistoryItem;
import com.chrisr.pelotonpace.exception.BadRequestException;
import com.chrisr.pelotonpace.repository.entity.PelotonUserSession;
import com.chrisr.pelotonpace.request.PelotonRetrieveWorkoutHistoryRequest;
import com.chrisr.pelotonpace.service.PelotonService;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class PelotonRestControllerTest {

    @Mock
    PelotonService pelotonService;

    @Mock
    RestTemplate restTemplate;

    @InjectMocks
    PelotonRestControllerImpl pelotonRestController;


    // TODO: update tests
    @Ignore
    @Test(expected = BadRequestException.class)
    public void shouldFailWhenToUsernameIsMissing() {
        PelotonRetrieveWorkoutHistoryRequest request = new PelotonRetrieveWorkoutHistoryRequest();
//        ResponseEntity<List<PelotonWorkoutHistoryItem>> responseEntity = pelotonRestController.retrieveWorkoutHistory(request);
    }

    @Ignore
    @Test
    public void shouldSucceed() {

        PelotonUserSession pelotonUserSession = new PelotonUserSession();
        pelotonUserSession.setSessionId("session_id_123");
        pelotonUserSession.setUserId("user_id_123");
        pelotonUserSession.setUsername("ironman");

        when(pelotonService.getPelotonUserSessionByUsername(anyString())).thenReturn(pelotonUserSession);

        PelotonWorkoutHistoryItem pelotonWorkoutHistoryItem = new PelotonWorkoutHistoryItem();
        pelotonWorkoutHistoryItem.setWorkoutDate("2019-06-17");
        pelotonWorkoutHistoryItem.setInstructorName("Jess King");
        pelotonWorkoutHistoryItem.setFitnessType("Cycling");
        pelotonWorkoutHistoryItem.setClassDuration(20);
        pelotonWorkoutHistoryItem.setClassTitle("20 min EDM/Electronic Dance Ride");
        pelotonWorkoutHistoryItem.setCaloriesBurned(279);
        pelotonWorkoutHistoryItem.setAvgHeartRate(152);

        List<PelotonWorkoutHistoryItem> pelotonWorkoutHistoryItems = new ArrayList<>();
        pelotonWorkoutHistoryItems.add(pelotonWorkoutHistoryItem);


        String workoutData =
                "Workout Timestamp,Live/On-Demand,Instructor Name,Length (minutes),Fitness Discipline,Type,Title,Class Timestamp,Total Output,Avg. Watts,Avg. Resistance,Avg. Cadence (RPM),Avg. Speed (mph),Distance (mi),Calories Burned,Avg. Heartrate,Avg. Incline,Avg. Pace (min/mi)\n" +
                "2019-06-17 23:01 (PDT),On Demand,Jess King,20,Cycling,Theme,20 min EDM/Electronic Dance Ride,2019-04-15 13:19 (PDT),,,,,,,279,151.78,,\n";

        when(restTemplate.exchange(anyString(), any(), any(), any(Class.class))).thenReturn(ResponseEntity.ok().body(workoutData));

        PelotonRetrieveWorkoutHistoryRequest request = new PelotonRetrieveWorkoutHistoryRequest();
        request.setUsername_or_email("chrisr");

//        ResponseEntity<List<PelotonWorkoutHistoryItem>> responseEntity = pelotonRestController.retrieveWorkoutHistory(request);
//        List<PelotonWorkoutHistoryItem> response = responseEntity.getBody();

//        assertEquals(pelotonWorkoutHistoryItems.size(), response.size());
//        assertEquals(pelotonWorkoutHistoryItems.get(0).getWorkoutDate(), response.get(0).getWorkoutDate());
//        assertEquals(pelotonWorkoutHistoryItems.get(0).getInstructorName(), response.get(0).getInstructorName());
//        assertEquals(pelotonWorkoutHistoryItems.get(0).getFitnessType(), response.get(0).getFitnessType());
//        assertEquals(pelotonWorkoutHistoryItems.get(0).getClassDuration(), response.get(0).getClassDuration());
//        assertEquals(pelotonWorkoutHistoryItems.get(0).getClassTitle(), response.get(0).getClassTitle());
//        assertEquals(pelotonWorkoutHistoryItems.get(0).getCaloriesBurned(), response.get(0).getCaloriesBurned());
//        assertEquals(pelotonWorkoutHistoryItems.get(0).getAvgHeartRate(), response.get(0).getAvgHeartRate());
    }
}
