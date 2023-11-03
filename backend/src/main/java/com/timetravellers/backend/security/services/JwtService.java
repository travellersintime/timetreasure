package com.timetravellers.backend.security.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    /**
     * 24 hours * 3600 seconds * 1000 milliseconds
     */
    private static final long DAY_IN_MILLIS = 24 * 3600 * 1000;

    /**
     * Method that extracts the username out of a JWT token
     * Username should reside in the "subject" claim of the token
     * @param jwtToken
     * @return
     */
    public String extractUsername(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    /**
     * This method extracts a specific claim from the JWT token
     * @param jwtToken
     * @param claimsResolver
     * @param <T>
     * @return
     */
    public<T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(jwtToken);
        return claimsResolver.apply(claims);
    }

    /**
     * Returns true if the user calling the method has the same username as the one present in the token's claims, and the token has not yet expired
     * @param jwtToken
     * @param userDetails
     * @return
     */
    public boolean isTokenValid(String jwtToken, UserDetails userDetails) {
        String username = extractUsername(jwtToken);

        if (username.equals(userDetails.getUsername()) && !isTokenExpired(jwtToken)) {
            return true;
        }

        return false;
    }

    /**
     * Returns true if expiration date present as a claim in the token is less than the current server date
     * @param jwtToken
     * @return
     */
    private boolean isTokenExpired(String jwtToken) {
        return extractExpiration(jwtToken).before(new Date());
    }

    /**
     * This method extracts the expiration date from the JWT token claims
     * @param jwtToken
     * @return
     */
    private Date extractExpiration(String jwtToken) {
        return extractClaim(jwtToken, Claims::getExpiration);
    }

    /**
     * Method that extracts claims out of a JWT token
     * @param jwtToken
     * @return
     */
    private Claims extractAllClaims(String jwtToken) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * This method generates a JWT token without any extra claims (see called generateToken() method for more info)
     * @param userDetails
     * @return
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * This method generates a JWT token based on some claims (user info) and the specified SECRET_KEY
     * @param extraClaims
     * @param userDetails
     * @return
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + DAY_IN_MILLIS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
