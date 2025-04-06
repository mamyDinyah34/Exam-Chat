package com.mamydinyah.chat.dto.request;

import java.util.List;

public record GroupChatRequestDto(List<Long> userIds, String chatName) {
}
