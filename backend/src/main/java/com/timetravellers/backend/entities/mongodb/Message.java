package com.timetravellers.backend.entities.mongodb;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="messages")
public class Message {
    @MongoId(value = FieldType.OBJECT_ID)
    private String id;
    private String messageType;
    private String title;
    private String content;
    private String author;
    private String recipient;
    private String isPublic;
    private LocalDateTime expiresOn;
    private String objectKey;

    public Message(String messageType, String title, String content, String author, String recipient, String isPublic, LocalDateTime expiresOn) {
        this.messageType = messageType;
        this.title = title;
        this.content = content;
        this.author = author;
        this.recipient = recipient;
        this.isPublic = isPublic;
        this.expiresOn = expiresOn;
    }
}
