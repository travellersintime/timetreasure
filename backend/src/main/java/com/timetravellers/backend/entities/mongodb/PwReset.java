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
@Document(collection="pwreset")
public class PwReset {
    @MongoId(value = FieldType.OBJECT_ID)
    private String id;
    private String username;
    private String code;

    public PwReset(String username, String code) {
        this.username = username;
        this.code = code;
    }
}
