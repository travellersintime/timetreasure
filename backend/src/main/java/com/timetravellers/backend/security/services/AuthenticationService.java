package com.timetravellers.backend.security.services;

import com.timetravellers.backend.entities.mongodb.Role;
import com.timetravellers.backend.entities.mongodb.User;
import com.timetravellers.backend.entities.to.AuthRequestTo;
import com.timetravellers.backend.entities.to.AuthResponseTo;
import com.timetravellers.backend.exceptions.authentication.*;
import com.timetravellers.backend.repositories.UserRepository;
import com.timetravellers.backend.validators.EmailValidator;
import com.timetravellers.backend.validators.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EmailValidator emailValidator;
    @Autowired
    private PasswordValidator passwordValidator;

    /**
     * This method inserts a new user into the database (with encoded password) and returns a newly generated JWT token for that user
     * @param authRequestTo
     * @return
     */
    public AuthResponseTo register(AuthRequestTo authRequestTo) throws UserAlreadyExistsException, InvalidEmailException, InvalidPasswordException, UsernameCannotBeEmptyException, PasswordCannotBeEmptyException {
        if (authRequestTo.getUsername().isEmpty()) {
            throw new UsernameCannotBeEmptyException();
        }

        if (authRequestTo.getPassword().isEmpty()) {
            throw new PasswordCannotBeEmptyException();
        }

        Optional<User> userOptional = userRepository.findByUsername(authRequestTo.getUsername());

        // Check if the E-Mail (expressed as Username) is valid
        if (!emailValidator.validate(authRequestTo.getUsername())) {
            throw new InvalidEmailException();
        }

        // Check if the password is at least 8 characters long
        if (!passwordValidator.validate(authRequestTo.getPassword())) {
            throw new InvalidPasswordException();
        }

        // Check if the user already exists
        if (!userOptional.isEmpty()) {
            throw new UserAlreadyExistsException();
        }

        User user = new User(authRequestTo.getUsername().toLowerCase(), passwordEncoder.encode(authRequestTo.getPassword()), Role.USER);
        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        return new AuthResponseTo(jwtToken);
    }

    /**
     * This method calls Spring's AuthenticationManager.authenticate() method in order to login the user
     * @param authRequestTo
     * @return
     */
    public AuthResponseTo login(AuthRequestTo authRequestTo) throws UserDoesNotExistException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authRequestTo.getUsername(),
                authRequestTo.getPassword()
        ));

        Optional<User> userOptional = userRepository.findByUsername(authRequestTo.getUsername());

        if (userOptional.isEmpty()) {
            throw new UserDoesNotExistException();
        }

        // Same as for register. Token is generated for newly authenticated user.
        User user = userOptional.get();
        String jwtToken = jwtService.generateToken(user);
        return new AuthResponseTo(jwtToken);
    }
}
