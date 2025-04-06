package com.mamydinyah.chat.service;

import com.mamydinyah.chat.dto.request.GroupChatRequestDto;
import com.mamydinyah.chat.entity.Chat;
import com.mamydinyah.chat.entity.User;

import java.util.List;

public interface ChatService {
    Chat createChat(User reqUser, Long userId2);
    Chat findChatById(Long id);
    List<Chat> findAllByUserId(Long userId);
    Chat createGroup(GroupChatRequestDto req, User reqUser);
    Chat addUserToGroup(Long userId, Long chatId, User reqUser);
    Chat renameGroup(Long chatId, String groupName, User reqUser);
    Chat removeFromGroup(Long chatId, Long userId, User reqUser);
    void deleteChat(Long chatId, Long userId);
    Chat markAsRead(Long chatId, User reqUser);
}
