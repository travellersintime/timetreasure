package com.timetravellers.backend.services;

import com.timetravellers.backend.entities.mongodb.Message;
import com.timetravellers.backend.entities.to.MessageTo;
import com.timetravellers.backend.repositories.MessageRepository;
import com.timetravellers.backend.validators.MessageValidator;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageValidator messageValidator;

    public Message insert(MessageTo messageTo) {
        Message message = new Message(messageTo.getTitle(), messageTo.getContent(), messageTo.getAuthor(), messageTo.getRecipient(), messageTo.isPublic(), null);

        if (!messageValidator.isValid(message)) {
            return null;
        }

        LocalDateTime localDateTime = LocalDateTime.now();
        localDateTime = localDateTime.plusMinutes(messageTo.getMinutes());
        localDateTime = localDateTime.plusHours(messageTo.getHours());
        localDateTime = localDateTime.plusDays(messageTo.getDays());
        message.setExpiresOn(localDateTime);

        return messageRepository.save(message);
    }

    public Message findById(ObjectId id) {
        Optional<Message> message = messageRepository.findById(id);

        if (message.isEmpty()) {
            return null;
        }

        return message.get();
    }

    public List<Message> findByRecipient(String recipient) {
        List<Message> messageList = messageRepository.findByRecipient(recipient);

        return messageList;
    }

    public List<Message> findByIsPublic(boolean isPublic) {
        List<Message> messageList = messageRepository.findByIsPublic(isPublic);

        return messageList;
    }
}