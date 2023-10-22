package com.timetravellers.backend.controllers;

import com.timetravellers.backend.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;

    @GetMapping("/messages/id/{id}")
    public ResponseEntity getById(@PathVariable String id) {
        return null;
    }

    @GetMapping("/messages/recipient/{recipient}")
    public ResponseEntity getByRecipient(@PathVariable String recipient) {
        return null;
    }

    @GetMapping("/messages/isPublic/{isPublic}")
    public ResponseEntity getByIsPublic(@PathVariable boolean isPublic) {
        return null;
    }
}