package com.chrisr.pelotonpace.service;

import com.chrisr.pelotonpace.exception.ResourceAlreadyExistsException;
import com.chrisr.pelotonpace.repository.UserRepository;
import com.chrisr.pelotonpace.repository.entity.User;
import com.chrisr.pelotonpace.request.SignUpRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserService userService;

    private SignUpRequest signUpRequest;
    private String username = "user1";
    private String password = "myPassword";
    private String email = "user1@email.com";
    private String firstname = "Bear";
    private String lastname = "Green";

    @Before
    public void createSignUpRequest() {
        signUpRequest = new SignUpRequest();
        signUpRequest.setUsername(username);
        signUpRequest.setPassword(password);
        signUpRequest.setEmail(email);
        signUpRequest.setFirstname(firstname);
        signUpRequest.setLastname(lastname);
    }

    @Test(expected = ResourceAlreadyExistsException.class)
    public void registerUser_UsernameAlreadyExists_ShouldThrowResourceAlreadyExistsException() {
        when(userRepository.existsByUsername(anyString())).thenReturn(true);
        userService.registerUser(signUpRequest);
    }

    @Test
    public void registerUser_ValidNewUser_ShouldReturnUserWithEncryptedPassword() {
        String encryptedPassword = "encrypted_password";

        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(userRepository.getNextSequence()).thenReturn(1L);
        when(passwordEncoder.encode(anyString())).thenReturn(encryptedPassword);

        User user = userService.registerUser(signUpRequest);

        assertEquals(1L, user.getId());
        assertEquals(username, user.getUsername());
        assertEquals(encryptedPassword, user.getPassword());
        assertEquals(email, user.getEmail());
        assertEquals(firstname, user.getFirstname());
        assertEquals(lastname, user.getLastname());
    }
}
