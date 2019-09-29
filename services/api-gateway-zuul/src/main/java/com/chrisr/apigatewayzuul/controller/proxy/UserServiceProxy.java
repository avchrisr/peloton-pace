package com.chrisr.apigatewayzuul.controller.proxy;

import com.chrisr.apigatewayzuul.entity.User;
import com.chrisr.apigatewayzuul.request.SignUpRequest;
import com.chrisr.apigatewayzuul.response.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

// @FeignClient(name = "xxx") is used to fetch the URL from Service Registry (e.g. Eureka).
// It should be the registered application name in Service Registry
// CAVEAT: needs @EnableFeignClients in the Application starter, which will allow this FeignClient interface to be @Autowired
@FeignClient(name = "UserService")
@RequestMapping("/user-service/users")       // *** CAVEAT: still need to specify the context path ("/user-service"), as Service Registry does not seem to be aware of context path
public interface UserServiceProxy {

    @GetMapping
    ResponseEntity<List<User>> findUsers(@RequestParam(required = false) String username,
                                         @RequestParam(required = false, defaultValue = "false") String isAuth);

    @GetMapping("/{id}")
    ResponseEntity<User> findUserById(@PathVariable(name = "id") long id);

    @PostMapping("/register")
    ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest);
}
