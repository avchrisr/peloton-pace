package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.response.PelotonWorkoutDetailResponse;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import io.swagger.annotations.Api;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Api(value = "Peloton resource")
@RequestMapping("/peloton")
public interface PelotonRestController {

//    @ApiOperation(value = "Retrieves Peloton user workout history", notes = "requires Peloton account credential as the POST Body")
//    @PostMapping("/get-workout-history")
//    ResponseEntity<List<PelotonWorkoutHistoryItem>> retrieveWorkoutHistory(@Valid @RequestBody PelotonRetrieveWorkoutHistoryRequest pelotonRetrieveWorkoutHistoryRequest);

    @GetMapping("/get-workout-summary")
    @HystrixCommand(
            commandProperties = {
                    @HystrixProperty(name = "hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds", value = "60000")
            })
    ResponseEntity<String> getWorkoutSummary(@RequestParam String pelotonPaceUsername,
                                             @RequestParam(required = false, defaultValue = "10") String limit,
                                             @RequestParam(required = false, defaultValue = "0") String page);

    @GetMapping("/get-workout-detail/{workoutId}")
    @HystrixCommand(
            commandProperties = {
                    @HystrixProperty(name = "hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds", value = "60000")
            })
    ResponseEntity<PelotonWorkoutDetailResponse> getWorkoutDetail(
            @PathVariable(name = "workoutId") String workoutId,
            @RequestParam String pelotonPaceUsername);
}
