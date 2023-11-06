package com.timetravellers.backend.services;

import com.timetravellers.backend.entities.mongodb.User;
import com.timetravellers.backend.repositories.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User findById(ObjectId id){
        return null;
    }

    public boolean changePassword(ObjectId userId, String oldPassword, String newPassword){
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return false; // User not found
        }

        // Verify the old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false; // Old password is incorrect
        }

        // Encode and update the new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return true; // Password changed successfully
    }
}
