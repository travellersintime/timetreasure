package com.timetravellers.backend.entities.mongodb;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="messages")
public class Message {
    private String title;
    private String content;
    private String author;
    private String recipient;
    private boolean isPublic;
    private LocalDateTime expiresOn;
}
