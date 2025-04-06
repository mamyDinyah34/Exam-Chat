package com.mamydinyah.chat.controller;

import com.mamydinyah.chat.dto.request.UpdateUserRequestDTO;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UpdateUserRequestDTO signupRequestDTO) {

        String email = signupRequestDTO.email();
        String password = signupRequestDTO.password();
        String fullName = signupRequestDTO.fullName();

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            throw new RuntimeException("Account with email " + email + " already exists");
        }

        User newUser = User.builder()
                .email(email)
                .password((password))
                .fullName(fullName)
                .build();

        userRepository.save(newUser);

        log.info("User {} successfully signed up", email);

        return new ResponseEntity<>(newUser, HttpStatus.ACCEPTED);
    }
}
