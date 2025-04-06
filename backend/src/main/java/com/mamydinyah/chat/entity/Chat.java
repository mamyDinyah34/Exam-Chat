package com.mamydinyah.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chats")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String chatName;
    private Boolean isGroup;

    @ManyToMany
    private Set<User> admins = new HashSet<>();

    @ManyToMany
    private Set<User> users = new HashSet<>();

    @ManyToOne
    private User createdBy;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof Chat other)) {
            return false;
        }
        return Objects.equals(chatName, other.getChatName())
                && Objects.equals(isGroup, other.getIsGroup())
                && Objects.equals(admins, other.getAdmins())
                && Objects.equals(users, other.getUsers())
                && Objects.equals(createdBy, other.getCreatedBy());
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatName, isGroup, admins, users, createdBy);
    }

    @Override
    public String toString() {
        return "Chat{" +
                "id=" + id +
                ", chatName='" + chatName + '\'' +
                ", isGroup=" + isGroup +
                '}';
    }

}
