package com.mamydinyah.chat.dto.request;

public record UpdateUserRequestDTO(String email, String password, String fullName, String nickname) {
}
