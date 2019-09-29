package com.chrisr.apigatewayzuul.controller;

import com.chrisr.apigatewayzuul.exception.UserNotFoundException;
import com.chrisr.apigatewayzuul.controller.proxy.UserServiceProxy;
import com.chrisr.apigatewayzuul.entity.User;
import com.chrisr.apigatewayzuul.request.LoginRequest;
import com.chrisr.apigatewayzuul.request.SignUpRequest;
import com.chrisr.apigatewayzuul.response.ApiResponse;
import com.chrisr.apigatewayzuul.response.JwtAuthResponse;
import com.chrisr.apigatewayzuul.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
public class AuthRestControllerImpl implements AuthRestController {
    private static final Logger logger = LoggerFactory.getLogger(AuthRestControllerImpl.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserServiceProxy userServiceProxy;

    @Autowired
    public AuthRestControllerImpl(AuthenticationManager authenticationManager,
                                  JwtTokenProvider jwtTokenProvider,
                                  UserServiceProxy userServiceProxy) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userServiceProxy = userServiceProxy;
    }

    @Override
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        // ***  CAVEAT  ***
        // if Feign is returning ResponseEntity, you must to extract the body and return it in your top layer service's own ResponseEntity
        // you CANNOT pass back the ResponseEntity from the downstream layer, the top layer will not be able to parse

        ResponseEntity<ApiResponse> responseEntity = userServiceProxy.registerUser(signUpRequest);
        return ResponseEntity.ok().body(responseEntity.getBody());
    }

    @Override
    public ResponseEntity<JwtAuthResponse> authenticateUserAndCreateJWT(@Valid @RequestBody LoginRequest loginRequest) {
        // I _could_ implement my own custom authentication approach, but I still need the Spring Security Authentication object
        // in order to be able to set the SecurityContextHolder so I can retrieve the logged in user anywhere globally

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // SecurityContext used by the framework to hold the currently logged-in user
        // After setting the Authentication in the context,
        // we’ll now be able to check if the current user is authenticated – using securityContext.getAuthentication().isAuthenticated()
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // look up user and include userId in the JWT header

        System.out.println("login username = " + loginRequest.getUsername());
        System.out.println("login password = " + loginRequest.getPassword());


        List<User> users = userServiceProxy.findUsers(loginRequest.getUsername(), "true").getBody();
        User user = null;

        if (users != null && users.size() == 1) {
            user = users.get(0);
        }

        if (user == null) {
            String errorMessage = String.format("User not found with username = %s", loginRequest.getUsername());
            logger.warn(errorMessage);
            throw new UserNotFoundException(errorMessage);
        }
        String jwt = jwtTokenProvider.generateToken(authentication, user);


        System.out.println("JWT = " + jwt);


        return ResponseEntity.ok().body(new JwtAuthResponse(jwt));
    }
}
