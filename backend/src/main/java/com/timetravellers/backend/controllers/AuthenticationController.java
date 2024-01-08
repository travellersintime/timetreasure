package com.timetravellers.backend.controllers;

import com.timetravellers.backend.entities.to.AuthRequestTo;
import com.timetravellers.backend.entities.to.AuthResponseTo;
import com.timetravellers.backend.exceptions.InvalidEmailException;
import com.timetravellers.backend.exceptions.UserAlreadyExistsException;
import com.timetravellers.backend.exceptions.UserDoesNotExistException;
import com.timetravellers.backend.security.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @CrossOrigin
    @PostMapping("/auth/register")
    public ResponseEntity register(@RequestBody AuthRequestTo authRequestTo) {

        try {
            AuthResponseTo authResponseTo = authenticationService.register(authRequestTo);
            return ResponseEntity.ok(authResponseTo);
        } catch(UserAlreadyExistsException e) {
            return new ResponseEntity("An account with the same email already exists.", HttpStatus.BAD_REQUEST);
        }
        catch (InvalidEmailException e) {
            return new ResponseEntity("E-mail is invalid.", HttpStatus.BAD_REQUEST);
        }
        finally {
            return new ResponseEntity("There was an error while attempting the registration.", HttpStatus.BAD_REQUEST);
        }
    }

    @CrossOrigin
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponseTo> login(@RequestBody AuthRequestTo authRequestTo) {
        try {
            AuthResponseTo authResponseTo = authenticationService.login(authRequestTo);
            return ResponseEntity.ok(authResponseTo);
        } catch (UserDoesNotExistException e) {
            return new ResponseEntity("User does not exist.", HttpStatus.BAD_REQUEST);
        }
    }
}
