package com.timetravellers.backend.security.filters;

import com.timetravellers.backend.security.services.JwtService;
import com.timetravellers.backend.security.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;

    /**
     * Filter that does JWT Token processing in 4 steps (mentioned throughout the method's logic)
     * @param request
     * @param response
     * @param filterChain
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Step 1: Take the 'Authorization' header. This is the header that contains the JWT Token
        String authHeader = request.getHeader("Authorization");

        // Step 2: JWT needs to be mentioned as the first item in the Authorization header, next to the 'Bearer' word
        String jwtToken;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3: Extract the JWT Token from the Authorization header into jwt
        jwtToken = authHeader.substring(7); // avoid 'Bearer '
        String username = jwtService.extractUsername(jwtToken);

        // Step 4: Check if the user exists in the database and the token is valid
        boolean userAuthenticated = SecurityContextHolder.getContext().getAuthentication() == null ? false : true;
        if (username != null && !userAuthenticated) {
            UserDetails userDetails = this.userService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwtToken, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }

            // Pass flow to next filter in the chain
            filterChain.doFilter(request, response);
        }
    }
}
