package com.mamydinyah.chat.service;

import com.mamydinyah.chat.dto.request.UpdateUserRequestDto;
import com.mamydinyah.chat.entity.User;

public interface UserService {
    User findUserById(Long id);
    User findUserByProfile(String jwt);
    User updateUser(Long id, UpdateUserRequestDto request);
}
