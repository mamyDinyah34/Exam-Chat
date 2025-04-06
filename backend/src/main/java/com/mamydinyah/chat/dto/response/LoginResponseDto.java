package com.mamydinyah.chat.dto.response;

import lombok.Builder;

@Builder
public record LoginResponseDto(String token, boolean isAuthenticated) {

}
