package com.timetravellers.backend.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

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
}
