package com.timetravellers.backend.entities.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PwResetTo {
    private String code;
    private String newPassword;
}
