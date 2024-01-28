package com.timetravellers.backend.services;

import com.timetravellers.backend.entities.mongodb.PwReset;
import com.timetravellers.backend.entities.mongodb.User;
import com.timetravellers.backend.entities.to.PwResetTo;
import com.timetravellers.backend.exceptions.authentication.*;
import com.timetravellers.backend.repositories.PwResetRepository;
import com.timetravellers.backend.repositories.UserRepository;
import com.timetravellers.backend.utils.StringGenerator;
import com.timetravellers.backend.validators.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class PwResetService {
    @Autowired
    private PwResetRepository pwResetRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender emailSender;
    @Autowired
    private PasswordValidator passwordValidator;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void requestPasswordReset(String username) throws UsernameCannotBeEmptyException {
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
        message.setFrom("timetreasure@mateasmario.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void resetPassword(PwResetTo pwResetTo) throws InvalidCodeException, InvalidPasswordException, UserDoesNotExistException {
        Optional<PwReset> pwReset = pwResetRepository.findByCode(pwResetTo.getCode());

        if (pwReset.isEmpty()) {
            throw new InvalidCodeException();
        }

        if (pwResetTo.getCode().equals(pwReset.get().getCode())) {
            if (!passwordValidator.validate(pwResetTo.getNewPassword())) {
                throw new InvalidPasswordException();
            }

            Optional<User> userOptional = userRepository.findByUsername(pwReset.get().getUsername().toLowerCase());

            if (userOptional.isEmpty()) {
                throw new UserDoesNotExistException();
            }

            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(pwResetTo.getNewPassword()));
            userRepository.save(user);

            pwResetRepository.deleteByUsername(pwReset.get().getUsername().toLowerCase());
        }
        else {
            throw new InvalidCodeException();
        }
    }
}
