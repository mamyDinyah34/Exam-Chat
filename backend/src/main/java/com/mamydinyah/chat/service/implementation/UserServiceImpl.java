package com.mamydinyah.chat.service.implementation;

import com.mamydinyah.chat.security.JWT.JwtConstants;
import com.mamydinyah.chat.security.JWT.JwtGenerator;
import com.mamydinyah.chat.dto.request.UpdateUserRequestDto;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.repository.UserRepository;
import com.mamydinyah.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtGenerator jwtGenerator;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User findUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return user.get();
        }
        throw new RuntimeException("User not found with id " + id);
    }

    @Override
    public User findUserByProfile(String jwt) {

        String email = String.valueOf(jwtGenerator.claimsFromToken(jwt).get(JwtConstants.EMAIL));
        if (email == null) {
            throw new BadCredentialsException("Invalid token");
        }
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user.get();
        }
        throw new RuntimeException("User not found with email " + email);
    }

    @Override
    public User updateUser(Long id, UpdateUserRequestDto request) {
        User user = findUserById(id);
        if (Objects.nonNull(request.fullName())) {
            user.setFullName(request.fullName());
        }
        if (Objects.nonNull(request.email())) {
            user.setEmail(request.email());
        }
        if (Objects.nonNull(request.password())) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        return userRepository.save(user);
    }

    @Override
    public List<User> searchUser(String query) {
        return userRepository.findByFullNameOrEmail(query).stream()
                .sorted(Comparator.comparing(User::getFullName))
                .toList();
    }

    @Override
    public List<User> searchUserByName(String name) {
        return userRepository.findByFullName(name).stream()
                .sorted(Comparator.comparing(User::getFullName))
                .toList();
    }

}
