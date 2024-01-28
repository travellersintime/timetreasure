package com.timetravellers.backend.controllers;

import com.timetravellers.backend.entities.mongodb.Message;
import com.timetravellers.backend.entities.to.MessageTo;
import com.timetravellers.backend.exceptions.messages.*;
import com.timetravellers.backend.services.MessageService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
public class MessageController {
    @Autowired
    private MessageService messageService;

    @CrossOrigin
    @PostMapping("/messages/text")
    public ResponseEntity<Message> createTextMessage(@RequestBody MessageTo messageTo) {

        Message message;
        try {
            message = messageService.insertTextMessage(messageTo);
        } catch (MessageRecipientCannotBeEmptyException e) {
            return new ResponseEntity("Message recipient cannot be empty.", HttpStatus.BAD_REQUEST);
        } catch (MessageTitleCannotBeEmptyException e) {
            return new ResponseEntity("Message title cannot be empty.", HttpStatus.BAD_REQUEST);
        } catch (MessageContentCannotBeEmptyException e) {
            return new ResponseEntity("Message content cannot be empty.", HttpStatus.BAD_REQUEST);
        } catch (MessageRecipientDoesNotExistException e) {
            return new ResponseEntity("Message recipient does not exist.", HttpStatus.BAD_REQUEST);
        } catch (MessageLimitExceededException e) {
            return new ResponseEntity("You can only send a maximum of 3 messages per hour. Please try again later", HttpStatus.BAD_REQUEST);
        }

        if (message == null) {
            return new ResponseEntity("There was an error while creating the message.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(message, HttpStatus.OK);
    }

    @CrossOrigin
    @PostMapping("/messages/image")
    public ResponseEntity<Message> createImageMessage(@RequestParam("file") MultipartFile multipartFile, @RequestPart("title") String title, @RequestPart("author") String author, @RequestPart("recipient") String recipient, @RequestPart("isPublic") String isPublic, @RequestPart("expiresOn") String expiresOn, @RequestPart("actualTime") String actualTime) {
        Message message;

        try {
            message = messageService.insertImageMessage(multipartFile, title, author, recipient, isPublic, expiresOn, actualTime);
        } catch (MessageRecipientCannotBeEmptyException e) {
            return new ResponseEntity("Message recipient cannot be empty.", HttpStatus.BAD_REQUEST);
        } catch (MessageTitleCannotBeEmptyException e) {
            return new ResponseEntity("Message title cannot be empty.", HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity("There was an error while trying to process the request.", HttpStatus.BAD_REQUEST);
        } catch (MessageContentCannotBeEmptyException e) {
            return new ResponseEntity("Message content cannot be empty.", HttpStatus.BAD_REQUEST);
        } catch (MessageRecipientDoesNotExistException e) {
            return new ResponseEntity("Message recipient does not exist.", HttpStatus.BAD_REQUEST);
        } catch (MessageLimitExceededException e) {
            return new ResponseEntity("You can only send a maximum of 3 messages per hour. Please try again later", HttpStatus.BAD_REQUEST);
        }

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

    @CrossOrigin
    @DeleteMapping("/messages/delete/{messageId}")
    public ResponseEntity deleteById(@PathVariable ObjectId messageId) {
        try {
            messageService.deleteById(messageId);
        } catch (MessageDoesNotExistException e) {
            return new ResponseEntity("Message with specified ID does not exist.", HttpStatus.BAD_REQUEST);
        } catch (InsufficientPermissionsException e) {
            return new ResponseEntity("Insufficient permissions to delete the message.", HttpStatus.UNAUTHORIZED);
        }

        return new ResponseEntity("Message has been deleted successfully", HttpStatus.OK);
    }
}