package com.chrisr.apigatewayzuul.controller;

import com.chrisr.apigatewayzuul.request.LoginRequest;
import com.chrisr.apigatewayzuul.request.SignUpRequest;
import com.chrisr.apigatewayzuul.response.ApiResponse;
import com.chrisr.apigatewayzuul.response.JwtAuthResponse;
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
