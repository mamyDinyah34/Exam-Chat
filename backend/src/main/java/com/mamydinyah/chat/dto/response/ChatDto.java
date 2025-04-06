package com.mamydinyah.chat.dto.response;

import com.mamydinyah.chat.entity.Chat;
import lombok.Builder;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Builder
public record ChatDto(
        Long id,
        String chatName,
        Boolean isGroup,
        Set<UserDto> admins,
        Set<UserDto> users,
        UserDto createdBy,
        List<MessageDto> messages) {

    public static ChatDto fromChat(Chat chat) {
        if (Objects.isNull(chat)) return null;
        return ChatDto.builder()
                .id(chat.getId())
                .chatName(chat.getChatName())
                .isGroup(chat.getIsGroup())
                .admins(UserDto.fromUsers(chat.getAdmins()))
                .users(UserDto.fromUsers(chat.getUsers()))
                .createdBy(UserDto.fromUser(chat.getCreatedBy()))
                .messages(MessageDto.fromMessages(chat.getMessages()))
                .build();
    }

    public static List<ChatDto> fromChats(Collection<Chat> chats) {
        if (Objects.isNull(chats)) return List.of();
        return chats.stream()
                .map(ChatDto::fromChat)
                .toList();
    }

}
