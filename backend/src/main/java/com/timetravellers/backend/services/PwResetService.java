package com.timetravellers.backend.services;

import com.timetravellers.backend.entities.mongodb.PwReset;
import com.timetravellers.backend.entities.mongodb.User;
import com.timetravellers.backend.exceptions.authentication.UsernameCannotBeEmptyException;
import com.timetravellers.backend.repositories.PwResetRepository;
import com.timetravellers.backend.utils.StringGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class PwResetService {
    @Autowired
    private PwResetRepository pwResetRepository;
    @Autowired
    private JavaMailSender emailSender;

    public void resetPassword(String username) throws UsernameCannotBeEmptyException {
        if (username.isEmpty()) {
            throw new UsernameCannotBeEmptyException();
        }

        PwReset pwReset = new PwReset();

        pwReset.setUsername(username);
        String code = StringGenerator.generateCode();
        pwReset.setCode(code);

        pwResetRepository.deleteByUsername(username);
        pwResetRepository.insert(pwReset);
        sendSimpleMessage(username, "Your Timetreasure Password Reset Code", "Password Reset Code: " + pwReset.getCode());
    }

    public void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("timetreasure39@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
}
