package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.controller.data.PelotonWorkoutHistoryItem;
import com.chrisr.pelotonpace.request.PelotonRetrieveWorkoutHistoryRequest;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;
import java.util.List;

@Api(value = "Peloton resource")
@RequestMapping("/peloton")
public interface PelotonRestController {
    @ApiOperation(value = "Retrieves Peloton user workout history", notes = "requires Peloton account credential as the POST Body")
    @PostMapping("/retrieve-workout-history")
    ResponseEntity<List<PelotonWorkoutHistoryItem>> retrieveWorkoutHistory(@Valid @RequestBody PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest);
}
