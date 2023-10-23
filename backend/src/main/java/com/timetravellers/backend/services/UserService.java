package com.timetravellers.backend.services;

import com.timetravellers.backend.entities.Message;
import com.timetravellers.backend.entities.User;
import com.timetravellers.backend.repositories.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findById(ObjectId id){
        return null;
    }

    public boolean changePassword(String userId, String oldPassword, String newPassword){
        return false;
    }
}
