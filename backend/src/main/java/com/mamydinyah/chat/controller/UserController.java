package com.mamydinyah.chat.controller;

import com.mamydinyah.chat.dto.request.UpdateUserRequestDto;
import com.mamydinyah.chat.dto.response.ApiResponseDto;
import com.mamydinyah.chat.dto.response.UserDto;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.security.JWT.JwtConstants;
import com.mamydinyah.chat.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/")
    public String test() {
        return "User controller is working";
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(@RequestHeader(JwtConstants.TOKEN_HEADER) String token) {
        User user = userService.findUserByProfile(token);
        return new ResponseEntity<>(UserDto.fromUser(user), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponseDto> updateUser(@RequestBody UpdateUserRequestDto request,
                                                     @RequestHeader(JwtConstants.TOKEN_HEADER) String token)
    {
        User user = userService.findUserByProfile(token);
        user = userService.updateUser(user.getId(), request);
        log.info("User updated: {}", user.getEmail());
        ApiResponseDto response = ApiResponseDto.builder()
                .message("User updated")
                .status(true)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
