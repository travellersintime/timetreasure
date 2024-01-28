package com.timetravellers.backend.services;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.timetravellers.backend.entities.mongodb.History;
import com.timetravellers.backend.entities.mongodb.Message;
import com.timetravellers.backend.entities.mongodb.Role;
import com.timetravellers.backend.entities.mongodb.User;
import com.timetravellers.backend.entities.to.MessageTo;
import com.timetravellers.backend.exceptions.messages.*;
import com.timetravellers.backend.repositories.HistoryRepository;
import com.timetravellers.backend.repositories.MessageRepository;
import com.timetravellers.backend.repositories.UserRepository;
import com.timetravellers.backend.utils.StringGenerator;
import com.timetravellers.backend.validators.MessageValidator;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private MessageValidator messageValidator;
    @Autowired
    private AmazonS3 amazonS3Client;

    public Message insertTextMessage(MessageTo messageTo) throws MessageRecipientCannotBeEmptyException, MessageTitleCannotBeEmptyException, MessageContentCannotBeEmptyException, MessageRecipientDoesNotExistException, MessageLimitExceededException {
        performMessageChecks(messageTo.getIsPublic(), messageTo.getRecipient().toLowerCase(), messageTo.getTitle());

        if (messageTo.getIsPublic().equals("false") && messageTo.getRecipient().isEmpty()) {
            throw new MessageRecipientCannotBeEmptyException();
        }

        if (messageTo.getTitle().isEmpty()) {
            throw new MessageTitleCannotBeEmptyException();
        }

        if (messageTo.getContent().isEmpty()) {
            throw new MessageContentCannotBeEmptyException();
        }

        List<History> historyList = historyRepository.findByUsernameAndIssuedOnGreaterThan(messageTo.getAuthor(), LocalDateTime.now().minusHours(1));
        if (historyList.size() >= 3) {
            throw new MessageLimitExceededException();
        }

        LocalDateTime newExpiresOn = processRelativeExpireDate(messageTo.getExpiresOn(), messageTo.getActualTime());

        Message message = new Message("text", messageTo.getTitle(), messageTo.getContent(), messageTo.getAuthor(), messageTo.getRecipient().toLowerCase(), messageTo.getIsPublic(), newExpiresOn);

        History history = new History(messageTo.getAuthor(), LocalDateTime.now());
        historyRepository.save(history);

        return messageRepository.save(message);
    }


    public Message insertImageMessage(MultipartFile multipartFile, String title, String author, String recipient, String isPublic, String expiresOn, String actualTime) throws IOException, MessageRecipientCannotBeEmptyException, MessageTitleCannotBeEmptyException, MessageContentCannotBeEmptyException, MessageRecipientDoesNotExistException, MessageLimitExceededException {
        performMessageChecks(isPublic, recipient, title);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                .withZone(ZoneId.of("UTC"));
        LocalDateTime expiresOnDate = LocalDateTime.parse(expiresOn, formatter);
        LocalDateTime actualTimeDate = LocalDateTime.parse(actualTime, formatter);

        if (multipartFile.isEmpty()) {
            throw new MessageContentCannotBeEmptyException();
        }

        String objectKey;

        // Generate a random objectKey until it is a unique one (not found in the database)
        do {
            objectKey = StringGenerator.generateObjectKey();
        } while (!messageRepository.findByObjectKey(objectKey).isEmpty());

        List<History> historyList = historyRepository.findByUsernameAndIssuedOnGreaterThan(author, LocalDateTime.now().minusHours(1));
        if (historyList.size() >= 3) {
            throw new MessageLimitExceededException();
        }

        LocalDateTime newExpiresOn = processRelativeExpireDate(expiresOnDate, actualTimeDate);

        Message message = new Message("image", title, null, author, recipient, isPublic, newExpiresOn);
        message.setObjectKey(objectKey);

        // Convert the multipart file into a java File
        File file = new File(objectKey);

        FileOutputStream fileOutputStream = new FileOutputStream(file);

        try (OutputStream os = fileOutputStream) {
            os.write(multipartFile.getBytes());
        }

        // Upload the file to AWS S3
        var putObjectRequest = new PutObjectRequest("timetreasure", objectKey, file).withCannedAcl(CannedAccessControlList.PublicRead);
        amazonS3Client.putObject(putObjectRequest);

        // Remove the create file from the backend
        file.delete();
        fileOutputStream.close();

        History history = new History(author, LocalDateTime.now());
        historyRepository.save(history);

        // Add the message to the database
        return messageRepository.save(message);
    }

    /**
     * Get details of a message with a certain ID. The message will only be returned back if the user is the author, the recipient, or has the ADMIN role
     *
     * @param id
     * @return
     */
    public Message findById(ObjectId id) throws MessageNotYetAvailableException {
        Optional<Message> message = messageRepository.findById(id);

        if (message.isEmpty()) {
            return null;
        }

        // User needs to have sent that message, or received it, or be an ADMIN, or the message should be public
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (message.get().getIsPublic().equals("true")) {
            if (message.get().getExpiresOn().isAfter(LocalDateTime.now())) {
                throw new MessageNotYetAvailableException();
            } else {
                return message.get();
            }
        } else if (user.getUsername().equals(message.get().getAuthor()) || user.getUsername().equals(message.get().getRecipient().toLowerCase()) || user.getRole().equals(Role.ADMIN)) {
            if (message.get().getExpiresOn().isAfter(LocalDateTime.now())) {
                throw new MessageNotYetAvailableException();
            } else {
                return message.get();
            }
        }

        return null;
    }

    public List<Message> findByRecipient(String recipient) {
        List<Message> messageList = messageRepository.findByRecipient(recipient.toLowerCase());

        // User needs to be that recipient, or be an ADMIN
        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!user.getUsername().equals(recipient.toLowerCase()) && !user.getRole().equals(Role.ADMIN)) {
            return null;
        }

        return messageList;
    }

    public List<Message> findByIsPublic(String isPublic) {
        List<Message> messageList = messageRepository.findByIsPublic(isPublic);

        messageList.sort((o1, o2) -> o2.getId().compareTo(o1.getId()));

        return messageList;
    }

    public void deleteById(ObjectId id) throws MessageDoesNotExistException, InsufficientPermissionsException {
        Optional<Message> message = messageRepository.findById(id);

        if (message.isEmpty()) {
            throw new MessageDoesNotExistException();
        }

        var user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!message.get().getRecipient().toLowerCase().equals(user.getUsername()) && !user.getRole().equals(Role.ADMIN)) {
            throw new InsufficientPermissionsException();
        }

        messageRepository.deleteById(id);
    }

    private void performMessageChecks(String isPublic, String recipient, String title) throws MessageRecipientCannotBeEmptyException, MessageTitleCannotBeEmptyException, MessageRecipientDoesNotExistException {
        if (isPublic.equals("false") && recipient.isEmpty()) {
            throw new MessageRecipientCannotBeEmptyException();
        }

        if (isPublic.equals("false") && userRepository.findByUsername(recipient).isEmpty()) {
            throw new MessageRecipientDoesNotExistException();
        }

        if (title.isEmpty()) {
            throw new MessageTitleCannotBeEmptyException();
        }
    }

    private LocalDateTime processRelativeExpireDate(LocalDateTime expiresOn, LocalDateTime actualTime) {
        LocalDateTime now = LocalDateTime.now();

        long hourDifference = now.minusHours(expiresOn.getHour()).getHour();

        return expiresOn.plusHours(hourDifference);
    }
}