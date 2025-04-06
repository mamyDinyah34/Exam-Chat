package com.mamydinyah.chat.controller;

import com.mamydinyah.chat.security.JWT.JwtConstants;
import com.mamydinyah.chat.dto.request. UpdateUserRequestDto;
import com.mamydinyah.chat.dto.response. ApiResponseDto;
import com.mamydinyah.chat.dto.response. UserDto;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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
    public ResponseEntity< UserDto> getUserProfile(@RequestHeader(JwtConstants.TOKEN_HEADER) String token){
        User user = userService.findUserByProfile(token);
        return new ResponseEntity<>( UserDto.fromUser(user), HttpStatus.OK);
    }

    @GetMapping("/{query}")
    public ResponseEntity<List< UserDto>> searchUsers(@PathVariable String query) {
        List<User> users = userService.searchUser(query);
        return new ResponseEntity<>( UserDto.fromUsersAsList(users), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Set< UserDto>> searchUsersByName(@RequestParam("name") String name) {
        List<User> users = userService.searchUserByName(name);
        return new ResponseEntity<>( UserDto.fromUsers(users), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity< ApiResponseDto> updateUser(@RequestBody  UpdateUserRequestDto request,
                                                     @RequestHeader(JwtConstants.TOKEN_HEADER) String token)
    {
        User user = userService.findUserByProfile(token);
        System.out.println("user: " +user );
        user = userService.updateUser(user.getId(), request);
        log.info("User updated: {}", user.getEmail());
         ApiResponseDto response =  ApiResponseDto.builder()
                .message("User updated")
                .status(true)
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
