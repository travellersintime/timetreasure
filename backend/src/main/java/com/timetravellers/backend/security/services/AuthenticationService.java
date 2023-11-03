package com.timetravellers.backend.security.services;

import com.timetravellers.backend.entities.mongodb.Role;
import com.timetravellers.backend.entities.mongodb.User;
import com.timetravellers.backend.entities.to.AuthRequestTo;
import com.timetravellers.backend.entities.to.AuthResponseTo;
import com.timetravellers.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    /**
     * This method inserts a new user into the database (with encoded password) and returns a newly generated JWT token for that user
     * @param authRequestTo
     * @return
     */
    public AuthResponseTo register(AuthRequestTo authRequestTo) {
        User user = new User(authRequestTo.getUsername(), passwordEncoder.encode(authRequestTo.getPassword()), Role.USER);
        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);
        return new AuthResponseTo(jwtToken);
    }

    /**
     * This method calls Spring's AuthenticationManager.authenticate() method in order to login the user
     * @param authRequestTo
     * @return
     */
    public AuthResponseTo login(AuthRequestTo authRequestTo) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authRequestTo.getUsername(),
                authRequestTo.getPassword()
        ));

        User user = userRepository.findByUsername(authRequestTo.getUsername()).orElseThrow();

        // Same as for register. Token is generated for newly authenticated user.
        String jwtToken = jwtService.generateToken(user);
        return new AuthResponseTo(jwtToken);
    }
}
