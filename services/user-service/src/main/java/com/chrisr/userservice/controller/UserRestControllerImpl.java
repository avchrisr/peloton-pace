package com.chrisr.userservice.controller;

import com.chrisr.userservice.exception.BadRequestException;
import com.chrisr.userservice.repository.entity.User;
import com.chrisr.userservice.request.SignUpRequest;
import com.chrisr.userservice.response.ApiResponse;
import com.chrisr.userservice.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserRestControllerImpl implements UserRestController {

    private static final Logger logger = LoggerFactory.getLogger(UserRestControllerImpl.class);

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @Autowired
    public UserRestControllerImpl(PasswordEncoder passwordEncoder, UserService userService) {
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Override
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {

        User user = userService.registerUser(signUpRequest);
        return ResponseEntity.ok().body(new ApiResponse(true, "User (" + user.getUsername() + ") registered successfully."));

//		URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/users/{username}").buildAndExpand(result.getUsername()).toUri();
//		return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
    }

    @Override
    public ResponseEntity<List<User>> getUsers(String username, String isAuth) {
        List<User> users = new ArrayList<>();

        if (username != null && !username.isBlank()) {
            User user = userService.getUserByUsername(username);
            users.add(user);
        } else {
            users = userService.getAllUsers();
        }

        if (!"true".equalsIgnoreCase(isAuth)) {
            for (User user : users) {
                removeSensitiveInfoFromUser(user);
            }
        }
        return ResponseEntity.ok().body(users);
    }

    @Override
    public ResponseEntity<User> getUserById(long id) {
        User user = userService.getUserById(id);
        removeSensitiveInfoFromUser(user);
        return ResponseEntity.ok().body(user);
    }

    @Override
    public ResponseEntity<User> addUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.addUser(user);
        return ResponseEntity.ok().body(user);
    }

    @Override
    public ResponseEntity<ApiResponse> updateUserById(long id, @Valid User user) {
        // at least one field must exist. "id" field does not count

        // TODO: update passwords via a separate workflow, with current password + new password workflow
        //  - store encrypted password in DB, and have a way to decrypt peloton password for logging in purpose

        if ((user.getUsername() == null || user.getUsername().isBlank()) &&
                (user.getFirstname() == null || user.getFirstname().isBlank()) &&
                (user.getLastname() == null || user.getLastname().isBlank()) &&
                (user.getDob() == null || user.getDob().isBlank()) &&
                (user.getEmail() == null || user.getEmail().isBlank()) &&
                (user.getPelotonUsername() == null || user.getPelotonUsername().isBlank()) &&
                (user.getPelotonPassword() == null || user.getPelotonPassword().isBlank())) {

            String errorMessage = "At least one field is required.";
            throw new BadRequestException(errorMessage);
        }

        userService.updateUserById(id, user);

        return ResponseEntity.ok().body(new ApiResponse(true, "Successfully updated user."));
    }

    @Override
    public ResponseEntity<ApiResponse> deleteUser(long id) {
        userService.deleteUserById(id);
        String responseMessage = String.format("User with id = %s has been deleted.", id);
        return ResponseEntity.ok().body(new ApiResponse(true, responseMessage));
    }

    private void removeSensitiveInfoFromUser(User user) {
        user.setPassword(null);
        user.setPelotonPassword(null);
    }
}
