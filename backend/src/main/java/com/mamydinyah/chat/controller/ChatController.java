package com.mamydinyah.chat.controller;

import com.mamydinyah.chat.dto.request.GroupChatRequestDto;
import com.mamydinyah.chat.dto.response.ApiResponseDto;
import com.mamydinyah.chat.dto.response.ChatDto;
import com.mamydinyah.chat.entity.Chat;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.security.JWT.JwtConstants;
import com.mamydinyah.chat.service.ChatService;
import com.mamydinyah.chat.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/chats")
public class ChatController {
    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;

    @PostMapping("/single")
    public ResponseEntity<ChatDto> createSingleChat(@RequestBody Long userId,
                                                    @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.createChat(user, userId);
        log.info("User {} created single chat: {}", user.getEmail(), chat.getId());

        return new ResponseEntity<>(ChatDto.fromChat(chat), HttpStatus.OK);
    }

    @PostMapping("/group")
    public ResponseEntity<ChatDto> createGroupChat(@RequestBody GroupChatRequestDto req,
                                                   @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.createGroup(req, user);
        log.info("User {} created group chat: {}", user.getEmail(), chat.getId());

        return new ResponseEntity<>(ChatDto.fromChat(chat), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatDto> findChatById(@PathVariable("id") Long id)
    {

        Chat chat = chatService.findChatById(id);

        return new ResponseEntity<>(ChatDto.fromChat(chat), HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ChatDto>> findAllChatsByUserId(@RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        List<Chat> chats = chatService.findAllByUserId(user.getId());

        return new ResponseEntity<>(ChatDto.fromChats(chats), HttpStatus.OK);
    }

    @PutMapping("/{chatId}/add/{userId}")
    public ResponseEntity<ChatDto> addUserToGroup(@PathVariable Long chatId, @PathVariable Long userId,
                                                  @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.addUserToGroup(userId, chatId, user);
        log.info("User {} added user {} to group chat: {}", user.getEmail(), userId, chat.getId());

        return new ResponseEntity<>(ChatDto.fromChat(chat), HttpStatus.OK);
    }

    @PutMapping("/{chatId}/remove/{userId}")
    public ResponseEntity<ChatDto> removeUserFromGroup(@PathVariable Long chatId, @PathVariable Long userId,
                                                       @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.removeFromGroup(chatId, userId, user);
        log.info("User {} removed user {} from group chat: {}", user.getEmail(), userId, chat.getId());

        return new ResponseEntity<>(ChatDto.fromChat(chat), HttpStatus.OK);
    }

    @PutMapping("/{chatId}/markAsRead")
    public ResponseEntity<ChatDto> markAsRead(@PathVariable Long chatId,
                                              @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        Chat chat = chatService.markAsRead(chatId, user);
        log.info("Chat {} marked as read for user: {}", chatId, user.getEmail());

        return new ResponseEntity<>(ChatDto.fromChat(chat), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponseDto> deleteChat(@PathVariable Long id,
                                                     @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        chatService.deleteChat(id, user.getId());
        log.info("User {} deleted chat: {}", user.getEmail(), id);

        ApiResponseDto res = ApiResponseDto.builder()
                .message("Chat deleted successfully")
                .status(true)
                .build();

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
