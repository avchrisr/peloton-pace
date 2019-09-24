package com.chrisr.pelotonpace.controller;

import com.chrisr.pelotonpace.exception.BadRequestException;
import com.chrisr.pelotonpace.repository.entity.User;
import com.chrisr.pelotonpace.response.ApiResponse;
import com.chrisr.pelotonpace.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;

@RestController
public class UserRestControllerImpl implements UserRestController {

    private final UserService userService;

    @Autowired
    public UserRestControllerImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        for (User user : users) {
            removeSensitiveInfoFromUser(user);
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
    }



    // TODO: to be removed ----------------------------

    @GetMapping("/public/create-jwt")
    public String createJwt() {

        final String SECRET_KEY = "MY_SECRET_KEY";

        String id = "USER-12345";
        String issuer = "MY_APP";
        String subject = "chrisr";
        long ttlMillis = 360000L;
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);

        //Let's set the JWT Claims
        JwtBuilder builder = Jwts.builder().setId(id)
                .setIssuedAt(now)
                .setSubject(subject)
                .setIssuer(issuer)
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY);

        //if it has been specified, let's add the expiration
        if (ttlMillis > 0) {
            long expMillis = nowMillis + ttlMillis;
            Date exp = new Date(expMillis);
            builder.setExpiration(exp);
        }

        // adds custom properties (k/v pair)
        builder.claim("scope", "my custom scope");

        //Builds the JWT and serializes it to a compact, URL-safe string
        return builder.compact();
    }

    @PostMapping("/public/decode-jwt")
    public String decodeJwt(@RequestBody String jwt) {

        final String SECRET_KEY = "MY_SECRET_KEY";


        //This line will throw an exception if it is not a signed JWS (as expected)
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(jwt).getBody();

/*
        try {
            Claims claim = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(jwt).getBody();
            String subject = claim.getSubject();
            // OK, you can trust this JWT

        } catch (SignatureException e) {
            // don't trust this JWT!

        }
*/

        return claims.toString();
    }
}
