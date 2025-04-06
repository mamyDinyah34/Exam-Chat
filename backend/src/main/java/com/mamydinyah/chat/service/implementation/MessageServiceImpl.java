package com.mamydinyah.chat.service.implementation;

import com.mamydinyah.chat.dto.request. SendMessageRequestDto;
import com.mamydinyah.chat.entity.Chat;
import com.mamydinyah.chat.entity.Message;
import com.mamydinyah.chat.entity.User;
import com.mamydinyah.chat.repository.MessageRepository;
import com.mamydinyah.chat.service.ChatService;
import com.mamydinyah.chat.service.MessageService;
import com.mamydinyah.chat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;
    @Autowired
    private MessageRepository messageRepository;

    @Override
    public Message sendMessage( SendMessageRequestDto req, Long userId){
        User user = userService.findUserById(userId);
        Chat chat = chatService.findChatById(req.chatId());
        Message message = Message.builder()
                .chat(chat)
                .user(user)
                .content(req.content())
                .timeStamp(LocalDateTime.now())
                .readBy(new HashSet<>(Set.of(user.getId())))
                .build();

        chat.getMessages().add(message);
        return messageRepository.save(message);
    }

    @Override
    public List<Message> getChatMessages(Long chatId, User reqUser){
        Chat chat = chatService.findChatById(chatId);
        if (!chat.getUsers().contains(reqUser)) {
            throw new RuntimeException("User isn't related to chat " + chatId);
        }
        return messageRepository.findByChat_Id(chat.getId());
    }

    @Override
    public Message findMessageById(Long messageId){
        Optional<Message> message = messageRepository.findById(messageId);
        if (message.isPresent()) {
            return message.get();
        }
        throw new RuntimeException("Message not found " + messageId);
    }

    @Override
    public void deleteMessageById(Long messageId, User reqUser){
        Message message = findMessageById(messageId);
        if (message.getUser().getId().equals(reqUser.getId())) {
            messageRepository.deleteById(messageId);
            return;
        }
        throw new RuntimeException("User is not related to message " + message.getId());
    }

}
