package com.mamydinyah.chat.controller;

import com.mamydinyah.chat.security.JWT.JwtConstants;
import com.mamydinyah.chat.dto.request.SendMessageRequestDto;
import com.mamydinyah.chat.dto.response.ApiResponseDto;
import com.mamydinyah.chat.dto.response.MessageDto;
import com.mamydinyah.chat.entity.Message;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.service.MessageService;
import com.mamydinyah.chat.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private UserService userService;
    @Autowired
    private MessageService messageService;

    @PostMapping("/create")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody SendMessageRequestDto req,
                                                  @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        Message message = messageService.sendMessage(req, user.getId());
        log.info("User {} sent message: {}", user.getEmail(), message.getId());

        return new ResponseEntity<>(MessageDto.fromMessage(message), HttpStatus.OK);
    }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<MessageDto>> getChatMessages(@PathVariable Long chatId,
                                                            @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        List<Message> messages = messageService.getChatMessages(chatId, user);

        return new ResponseEntity<>(MessageDto.fromMessages(messages), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto> deleteMessage(@PathVariable Long id,
                                                        @RequestHeader(JwtConstants.TOKEN_HEADER) String jwt)
    {

        User user = userService.findUserByProfile(jwt);
        messageService.deleteMessageById(id, user);
        log.info("User {} deleted message: {}", user.getEmail(), id);

        ApiResponseDto res = ApiResponseDto.builder()
                .message("Message deleted successfully")
                .status(true)
                .build();

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

}
