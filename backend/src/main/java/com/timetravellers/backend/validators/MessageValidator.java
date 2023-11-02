package com.timetravellers.backend.validators;

import com.timetravellers.backend.entities.mongodb.Message;
import org.springframework.stereotype.Component;

@Component
public class MessageValidator {
    public boolean isValid(Message message) {
        if (message.getTitle() != null && !message.getTitle().isBlank() &&
                message.getContent() != null && !message.getContent().isBlank() &&
                message.getAuthor() != null && !message.getAuthor().isBlank() &&
                message.getRecipient() != null && !message.getRecipient().isBlank()) {
            return true;
        }
        return false;
    }
}
