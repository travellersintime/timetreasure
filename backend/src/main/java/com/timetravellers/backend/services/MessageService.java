package com.timetravellers.backend.services;

import com.timetravellers.backend.entities.Message;
import com.timetravellers.backend.repositories.MessageRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public Message findById(ObjectId id) {
        return null;
    }

    public List<Message> findByRecipient(String recipient) {
        return null;
    }

    public List<Message> findByIsPublic(boolean isPublic) {
        return null;
    }
}