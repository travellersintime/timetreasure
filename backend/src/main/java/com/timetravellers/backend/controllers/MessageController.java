package com.timetravellers.backend.controllers;

import com.timetravellers.backend.entities.mongodb.Message;
import com.timetravellers.backend.entities.to.MessageTo;
import com.timetravellers.backend.exceptions.MessageNotYetAvailableException;
import com.timetravellers.backend.services.MessageService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;

    @CrossOrigin
    @PostMapping("/messages")
    public ResponseEntity<Message> createMessage(@RequestBody MessageTo messageTo) {
        Message message = messageService.insert(messageTo);

        if (message == null) {
            return new ResponseEntity("There was an error while creating the message.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(message, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/messages/id/{id}")
    public ResponseEntity<Message> getById(@PathVariable ObjectId id) {
        Message message = null;
        try {
            message = messageService.findById(id);
        } catch (MessageNotYetAvailableException e) {
            return new ResponseEntity("The current message is not yet available.", HttpStatus.BAD_REQUEST);
        }

        if (message == null) {
            return new ResponseEntity("Message with given ID does not exist.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(message, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/messages/recipient/{recipient}")
    public ResponseEntity<List<Message>> getByRecipient(@PathVariable String recipient) {
        List<Message> messageList = messageService.findByRecipient(recipient);

        if (messageList == null) {
            return new ResponseEntity("Could not process messages for given recipient ID.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(messageList, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/messages/isPublic/{isPublic}")
    public ResponseEntity getByIsPublic(@PathVariable String isPublic) {
        List<Message> messageList = messageService.findByIsPublic(isPublic);

        if (messageList == null) {
            return new ResponseEntity("Could not process messages for given recipient ID.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(messageList, HttpStatus.OK);
    }
}