package com.mamydinyah.chat.dto.response;

import com.mamydinyah.chat.entity.Message;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.*;

@Builder
public record MessageDto(Long id, String content, LocalDateTime timeStamp, UserDto user, Set<Long> readBy) {

    public static MessageDto fromMessage(Message message) {
        if (Objects.isNull(message)) return null;
        return MessageDto.builder()
                .id(message.getId())
                .content(message.getContent())
                .timeStamp(message.getTimeStamp())
                .user(UserDto.fromUser(message.getUser()))
                .readBy(new HashSet<>(message.getReadBy()))
                .build();
    }

    public static List<MessageDto> fromMessages(Collection<Message> messages) {
        if (Objects.isNull(messages)) return List.of();
        return messages.stream()
                .map(MessageDto::fromMessage)
                .toList();
    }

}
