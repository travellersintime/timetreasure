package com.timetravellers.backend.controllers;

import com.timetravellers.backend.entities.to.AuthRequestTo;
import com.timetravellers.backend.entities.to.AuthResponseTo;
import com.timetravellers.backend.exceptions.authentication.*;
import com.timetravellers.backend.security.services.AuthenticationService;
import com.timetravellers.backend.services.PwResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private PwResetService pwResetService;

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
        catch (InvalidPasswordException e) {
            return new ResponseEntity("Password needs to be at least 8 characters long.", HttpStatus.BAD_REQUEST);
        }
        catch (UsernameCannotBeEmptyException e) {
            return new ResponseEntity("E-mail cannot be empty.", HttpStatus.BAD_REQUEST);
        }
        catch (PasswordCannotBeEmptyException e) {
            return new ResponseEntity("Password cannot be empty.", HttpStatus.BAD_REQUEST);
        }
        catch (Exception e) {
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

    @CrossOrigin
    @GetMapping("/auth/forgotPassword/{username}")
    public ResponseEntity forgotPassword(@PathVariable String username) {
        try {
            pwResetService.resetPassword(username);
        } catch (UsernameCannotBeEmptyException e) {
            return new ResponseEntity("E-mail cannot be empty.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity("Please check your mail for the password reset code we sent to you.", HttpStatus.OK);
    }
}
