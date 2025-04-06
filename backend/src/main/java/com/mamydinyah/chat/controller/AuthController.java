package com.mamydinyah.chat.controller;

import com.mamydinyah.chat.security.JWT.JwtGenerator;
import com.mamydinyah.chat.dto.request.LoginRequestDto;
import com.mamydinyah.chat.dto.request.UpdateUserRequestDto;
import com.mamydinyah.chat.dto.response.LoginResponseDto;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.repository.UserRepository;
import com.mamydinyah.chat.service.implementation.CustomUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtGenerator jwtGenerator;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/signup")
    public ResponseEntity<LoginResponseDto> signup(@RequestBody UpdateUserRequestDto signupRequestDTO) {

        final String email = signupRequestDTO.email();
        final String password = signupRequestDTO.password();
        final String fullName = signupRequestDTO.fullName();

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            throw new RuntimeException("Account with email " + email + " already exists");
        }

        User newUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .build();

        userRepository.save(newUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtGenerator.generateToken(authentication);

        LoginResponseDto loginResponseDTO = LoginResponseDto.builder()
                .token(jwt)
                .isAuthenticated(true)
                .build();

        log.info("User {} successfully signed up", email);

        return new ResponseEntity<>(loginResponseDTO, HttpStatus.ACCEPTED);
    }

    @PostMapping("/signin")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDTO) {

        final String email = loginRequestDTO.email();
        final String password = loginRequestDTO.password();

        Authentication authentication = authenticateReq(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtGenerator.generateToken(authentication);

        LoginResponseDto loginResponseDTO = LoginResponseDto.builder()
                .token(jwt)
                .isAuthenticated(true)
                .build();

        log.info("User {} successfully signed in", loginRequestDTO.email());

        return new ResponseEntity<>(loginResponseDTO, HttpStatus.ACCEPTED);
    }

    public Authentication authenticateReq(String username, String password) {

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }

}
