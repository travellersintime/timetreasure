package com.timetravellers.backend.validators;

import org.springframework.stereotype.Component;

@Component
public class PasswordValidator {
    public boolean validate(String password) {
        if (password.length() < 8) {
            return false;
        }

        return true;
    }

}
