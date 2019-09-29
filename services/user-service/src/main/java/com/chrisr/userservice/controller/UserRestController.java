package com.chrisr.userservice.controller;

import com.chrisr.userservice.repository.entity.User;
import com.chrisr.userservice.request.SignUpRequest;
import com.chrisr.userservice.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RequestMapping("/users")
public interface UserRestController {

    // not specifying path will allow both "" and "/" paths
    // i.e.) specifying "/" will only allow "/" path, and not ""
    @GetMapping
    ResponseEntity<List<User>> getUsers(@RequestParam(required = false) String username,
                                        @RequestParam(required = false, defaultValue = "false") String isAuth);

    @GetMapping(path = "/{id}")
    ResponseEntity<User> getUserById(@PathVariable(name = "id") long id);

    // CAVEAT
    // Below endpoint CANNOT be established even if the type is supposedly different.
    // It will compile fine and service will start.
    // However, when you make a request to either endpoint, you'll get following error:
    /*
        "Ambiguous handler methods mapped for '/api/v1/user-service/users/chrisr':
        {public abstract org.springframework.http.ResponseEntity com.chrisr.apigatewayzuul.controller.proxy.UserServiceProxy.findUserById(long),
        public abstract org.springframework.http.ResponseEntity com.chrisr.apigatewayzuul.controller.proxy.UserServiceProxy.findUserByUsername(java.lang.String)}",
     */
    /*
    @GetMapping(path = "/{username}")
    ResponseEntity<User> getUserByUsername(@PathVariable(name = "username") String username);
    */

    @PostMapping
    ResponseEntity<User> addUser(@RequestBody User user);

    @PatchMapping(path = "/{id}")
    ResponseEntity<ApiResponse> updateUserById(@PathVariable(name = "id") long id,
                                               @Valid @RequestBody User user);

    @DeleteMapping(path = "/{id}")
    ResponseEntity<ApiResponse> deleteUser(@PathVariable(name = "id") long id);

    @PostMapping("/register")
    ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest);
}
