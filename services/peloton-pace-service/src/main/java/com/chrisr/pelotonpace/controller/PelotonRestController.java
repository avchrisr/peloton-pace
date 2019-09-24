package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.controller.data.PelotonWorkoutHistoryItem;
import com.chrisr.pelotonpace.request.PelotonRetrieveWorkoutHistoryRequest;
import com.chrisr.pelotonpace.response.PelotonWorkoutDetailResponse;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Api(value = "Peloton resource")
@RequestMapping("/peloton")
public interface PelotonRestController {

//    @ApiOperation(value = "Retrieves Peloton user workout history", notes = "requires Peloton account credential as the POST Body")
//    @PostMapping("/get-workout-history")
//    ResponseEntity<List<PelotonWorkoutHistoryItem>> retrieveWorkoutHistory(@Valid @RequestBody PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest);

    @GetMapping("/get-workout-summary")
    ResponseEntity<String> getWorkoutSummary(@RequestParam(required = false, defaultValue = "10") String limit,
                                             @RequestParam(required = false, defaultValue = "0") String page);

    @GetMapping("/get-workout-detail/{workoutId}")
    ResponseEntity<PelotonWorkoutDetailResponse> getWorkoutDetail(@PathVariable(name = "workoutId") String workoutId);
}
