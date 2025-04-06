package com.mamydinyah.chat.service.implementation;

import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.repository.UserRepository;
import com.mamydinyah.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUserById(Long id) {

        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            return user.get();
        }

        throw new RuntimeException("User not found with id " + id);
    }

}
