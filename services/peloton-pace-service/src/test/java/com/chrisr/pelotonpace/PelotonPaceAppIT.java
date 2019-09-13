package com.chrisr.pelotonpace;

import com.chrisr.pelotonpace.repository.entity.User;
import com.chrisr.pelotonpace.request.PelotonRetrieveWorkoutHistoryRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import static org.junit.Assert.assertEquals;

@Ignore
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class PelotonPaceAppIT {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private TestRestTemplate testRestTemplate;

    @LocalServerPort
    int randomPort;


    // TODO: add @Before hook to sign up for an account and login and get JWT token



    @Test
    public void testPelotonRetrieveWorkoutHistory() throws URISyntaxException, IOException {

        final String uriString = "http://localhost:" + randomPort + "/api/v1/peloton/retrieve-workout-history";
        URI uri = new URI(uriString);

        // -----  POST  -----
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest = new PelotonRetrieveWorkoutHistoryRequest();
        pelotonRetrieveWorkoutHistoryRequest.setUsername_or_email("chrisr");
        pelotonRetrieveWorkoutHistoryRequest.setPassword("1111111");

        HttpEntity<PelotonRetrieveWorkoutHistoryRequest> request = new HttpEntity<>(pelotonRetrieveWorkoutHistoryRequest, httpHeaders);

        ResponseEntity<String> response = testRestTemplate.postForEntity(uri, request, String.class);

        // -----  GET  -----
//        ResponseEntity<String> response = testRestTemplate.getForEntity("/api/peloton/retrieve-workout-history", String.class);

        int statusCode = response.getStatusCodeValue();
        System.out.println(statusCode);

        String responseString = response.getBody();
        User[] users = objectMapper.readValue(responseString, User[].class);    // de-serialize array
        for (User user : users) {
            System.out.println(user.getUsername());
        }

        assertEquals(HttpStatus.OK, response.getStatusCode());

//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
//        assertEquals(405, response.getStatusCode().value());                  // 405 - METHOD_NOT_ALLOWED

//        assertTrue(response.getBody().contains("Missing request header"));
    }
}
