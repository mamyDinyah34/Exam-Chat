package com.mamydinyah.chat.service;

import com.mamydinyah.chat.dto.request.SendMessageRequestDto;
import com.mamydinyah.chat.entity.Message;
import com.mamydinyah.chat.entity.User;

import java.util.List;

public interface MessageService {
    Message sendMessage(SendMessageRequestDto req, Long userId);
    List<Message> getChatMessages(Long chatId, User reqUser);
    Message findMessageById(Long messageId);

    void deleteMessageById(Long messageId, User reqUser);

}
