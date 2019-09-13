package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.request.LoginRequest;
import com.chrisr.pelotonpace.request.SignUpRequest;
import com.chrisr.pelotonpace.response.ApiResponse;
import com.chrisr.pelotonpace.response.JwtAuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@RequestMapping("/auth")
public interface AuthRestController {

    @PostMapping("/register")
    ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest);

    @PostMapping("/login")
    ResponseEntity<JwtAuthResponse> authenticateUserAndCreateJWT(@Valid @RequestBody LoginRequest loginRequest);
}
