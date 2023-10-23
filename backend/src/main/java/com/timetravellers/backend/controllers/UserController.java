package com.timetravellers.backend.controllers;

import com.timetravellers.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users/id/{id}")
    public ResponseEntity getById(@PathVariable String id){
        return null;
    }

    @PutMapping("users/id/{id}")
    public ResponseEntity changeUserPassword(@PathVariable String id, @RequestBody String oldPassword, @RequestBody String newPassword){
        return null;
    }
}
