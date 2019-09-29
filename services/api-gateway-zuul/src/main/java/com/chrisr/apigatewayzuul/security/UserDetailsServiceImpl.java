package com.chrisr.apigatewayzuul.security;

import com.chrisr.apigatewayzuul.controller.proxy.UserServiceProxy;
import com.chrisr.apigatewayzuul.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserServiceProxy userServiceProxy;

    @Autowired
    public UserDetailsServiceImpl(UserServiceProxy userServiceProxy) {
        this.userServiceProxy = userServiceProxy;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("ZUUL loadUserByUsername = " + username);

        List<User> users = userServiceProxy.findUsers(username, "true").getBody();

        if (users == null || users.size() == 0) {
            String errorMessage = String.format("Username Not Found = %s", username);
            throw new UsernameNotFoundException(errorMessage);
        }

        User user = users.get(0);
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), Collections.emptyList());
    }
}
