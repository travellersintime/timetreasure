package com.timetravellers.backend.controllers;

import com.timetravellers.backend.entities.mongodb.Message;
import com.timetravellers.backend.entities.to.MessageTo;
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
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(message, HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/messages/id/{id}")
    public ResponseEntity<Message> getById(@PathVariable ObjectId id) {
        Message message = messageService.findById(id);

        HttpStatus httpStatus = HttpStatus.OK;

        if (message == null) {
            httpStatus = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(message, httpStatus);
    }

    @CrossOrigin
    @GetMapping("/messages/recipient/{recipient}")
    public ResponseEntity<List<Message>> getByRecipient(@PathVariable String recipient) {
        List<Message> messageList = messageService.findByRecipient(recipient);

        HttpStatus httpStatus = HttpStatus.OK;

        if (messageList.size() == 0) {
            httpStatus = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(messageList, httpStatus);
    }

    @CrossOrigin
    @GetMapping("/messages/isPublic/{isPublic}")
    public ResponseEntity getByIsPublic(@PathVariable String isPublic) {
        List<Message> messageList = messageService.findByIsPublic(isPublic);

        HttpStatus httpStatus = HttpStatus.OK;

        if (messageList.size() == 0) {
            httpStatus = HttpStatus.BAD_REQUEST;
        }

        return new ResponseEntity<>(messageList, httpStatus);
    }
}