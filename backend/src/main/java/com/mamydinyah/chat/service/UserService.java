package com.mamydinyah.chat.service;

import com.mamydinyah.chat.dto.request.UpdateUserRequestDto;
import com.mamydinyah.chat.entity.User;

import java.util.List;

public interface UserService {
    User findUserById(Long id);
    User findUserByProfile(String jwt);
    User updateUser(Long id, UpdateUserRequestDto request);
    List<User> searchUser(String query);
    List<User> searchUserByName(String name);
}
