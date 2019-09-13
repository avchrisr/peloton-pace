package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.repository.entity.User;
import com.chrisr.pelotonpace.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/users")
public interface UserRestController {

    // not specifying path will allow both "" and "/" paths
    // i.e.) specifying "/" will only allow "/" path, and not ""
    @GetMapping
    ResponseEntity<List<User>> getAllUsers();

    @GetMapping(path = "/{id}")
    ResponseEntity<User> getUserById(@PathVariable(name = "id") long id);

    // TODO: remove this endpoint. use /auth/register instead
//    @PostMapping
//    ResponseEntity<User> addUser(@RequestBody User user);

    @DeleteMapping(path = "/{id}")
    ResponseEntity<ApiResponse> deleteUser(@PathVariable(name = "id") long id);
}
