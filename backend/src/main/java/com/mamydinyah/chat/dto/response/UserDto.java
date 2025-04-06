package com.mamydinyah.chat.dto.response;

import com.mamydinyah.chat.entity.User;
import lombok.Builder;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Builder
public record UserDto(Long id, String email, String fullName, String nickname, String profile) {

    public static UserDto fromUser(User user) {
        if (Objects.isNull(user)) return null;
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .nickname(user.getNickName())
                .build();
    }

    public static Set<UserDto> fromUsers(Collection<User> users) {
        if (Objects.isNull(users)) return Set.of();
        return users.stream()
                .map(UserDto::fromUser)
                .collect(Collectors.toSet());
    }

    public static List<UserDto> fromUsersAsList(Collection<User> users) {
        if (Objects.isNull(users)) return List.of();
        return users.stream()
                .map(UserDto::fromUser)
                .toList();
    }

}
