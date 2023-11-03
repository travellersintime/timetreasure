package com.timetravellers.backend.controllers;

import com.timetravellers.backend.entities.to.AuthRequestTo;
import com.timetravellers.backend.entities.to.AuthResponseTo;
import com.timetravellers.backend.security.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponseTo> register(@RequestBody AuthRequestTo authRequestTo) {
        return ResponseEntity.ok(authenticationService.register(authRequestTo));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponseTo> login(@RequestBody AuthRequestTo authRequestTo) {
        return ResponseEntity.ok(authenticationService.login(authRequestTo));
    }
}
