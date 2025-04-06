package com.mamydinyah.chat.dto.response;

import lombok.Builder;

@Builder
public record ApiResponseDto(String message, boolean status) {
}
