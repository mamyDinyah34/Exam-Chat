package com.mamydinyah.chat.dto.request;

public record UpdateUserRequestDto(String email, String password, String fullName, String nickname) {
}
