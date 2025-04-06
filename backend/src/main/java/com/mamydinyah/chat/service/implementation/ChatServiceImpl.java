package com.mamydinyah.chat.service.implementation;

import com.mamydinyah.chat.dto.request. GroupChatRequestDto;
import com.mamydinyah.chat.entity.Chat;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.repository.ChatRepository;
import com.mamydinyah.chat.service.ChatService;
import com.mamydinyah.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    private UserService userService;
    @Autowired
    private ChatRepository chatRepository;

    @Override
    public Chat createChat(User reqUser, Long userId2){
        User user2 = userService.findUserById(userId2);
        Optional<Chat> existingChatOptional = chatRepository.findSingleChatByUsers(user2, reqUser);
        if (existingChatOptional.isPresent()) {
            return existingChatOptional.get();
        }
        Chat chat = Chat.builder()
                .createdBy(reqUser)
                .users(new HashSet<>(Set.of(reqUser, user2)))
                .isGroup(false)
                .build();
        return chatRepository.save(chat);
    }

    @Override
    public Chat findChatById(Long id){
        Optional<Chat> chatOptional = chatRepository.findById(id);
        if (chatOptional.isPresent()) {
            return chatOptional.get();
        }
        throw new RuntimeException("No chat found with id " + id);
    }

    @Override
    public List<Chat> findAllByUserId(Long userId){
        User user = userService.findUserById(userId);
        return chatRepository.findChatByUserId(user.getId()).stream()
                .sorted((chat1, chat2) -> {
                    if (chat1.getMessages().isEmpty() && chat2.getMessages().isEmpty()) {
                        return 0;
                    } else if (chat1.getMessages().isEmpty()) {
                        return 1;
                    } else if (chat2.getMessages().isEmpty()) {
                        return -1;
                    }
                    LocalDateTime timeStamp1 = chat1.getMessages().get(chat1.getMessages().size() - 1).getTimeStamp();
                    LocalDateTime timeStamp2 = chat2.getMessages().get(chat2.getMessages().size() - 1).getTimeStamp();
                    return timeStamp2.compareTo(timeStamp1);
                })
                .toList();
    }

    @Override
    public Chat createGroup( GroupChatRequestDto req, User reqUser){
        Chat groupChat = Chat.builder()
                .isGroup(true)
                .chatName(req.chatName())
                .createdBy(reqUser)
                .admins(new HashSet<>(Set.of(reqUser)))
                .users(new HashSet<>())
                .build();
        for (Long userId : req.userIds()) {
            User userToAdd = userService.findUserById(userId);
            groupChat.getUsers().add(userToAdd);
        }
        return chatRepository.save(groupChat);
    }

    @Override
    public Chat addUserToGroup(Long userId, Long chatId, User reqUser){
        Chat chat = findChatById(chatId);
        User user = userService.findUserById(userId);
        if (chat.getAdmins().contains(reqUser)) {
            chat.getUsers().add(user);
            return chatRepository.save(chat);
        }
        throw new RuntimeException("User doesn't have permissions to add members to group chat");
    }

    @Override
    public Chat renameGroup(Long chatId, String groupName, User reqUser){
        Chat chat = findChatById(chatId);
        if (chat.getAdmins().contains(reqUser)) {
            chat.setChatName(groupName);
            return chatRepository.save(chat);
        }
        throw new RuntimeException("User doesn't have permissions to rename group chat");
    }

    @Override
    public Chat removeFromGroup(Long chatId, Long userId, User reqUser){
        Chat chat = findChatById(chatId);
        User user = userService.findUserById(userId);
        boolean isAdminOrRemoveSelf = chat.getAdmins().contains(reqUser) ||
                (chat.getUsers().contains(reqUser) && user.getId().equals(reqUser.getId()));
        if (isAdminOrRemoveSelf) {
            chat.getUsers().remove(user);
            return chatRepository.save(chat);
        }
        throw new RuntimeException("User doesn't have permissions to remove users from group chat");
    }

    @Override
    public void deleteChat(Long chatId, Long userId){
        Chat chat = findChatById(chatId);
        User user = userService.findUserById(userId);
        boolean isSingleChatOrAdmin = !chat.getIsGroup() || chat.getAdmins().contains(user);
        if (isSingleChatOrAdmin) {
            chatRepository.deleteById(chatId);
            return;
        }
        throw new RuntimeException("User doesn't have permissions to delete group chat");
    }

    @Override
    public Chat markAsRead(Long chatId, User reqUser){
        Chat chat = findChatById(chatId);
        if (chat.getUsers().contains(reqUser)) {
            chat.getMessages().forEach(msg -> msg.getReadBy().add(reqUser.getId()));
            return chatRepository.save(chat);
        }
        throw new RuntimeException("User is not related to chat");
    }
}
