package com.timetravellers.backend.entities.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageTo {
    private String title;
    private String content;
    private String author;
    private String recipient;
    private String isPublic;
    private LocalDateTime expiresOn;
    private int minutes;
    private int hours;
    private int days;
}
