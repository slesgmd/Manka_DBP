package com.manka.backend.security;

import com.manka.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final String secret;
    private final long accessExpirationSeconds;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.access-expiration-seconds}") long accessExpirationSeconds
    ) {
        this.secret = secret;
        this.accessExpirationSeconds = accessExpirationSeconds;
    }

    @PostConstruct
    void validateSecret() {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT secret must contain at least 32 bytes");
        }
    }

    public String generateAccessToken(User user) {
        Instant issuedAt = Instant.now();
        List<String> roles = user.getRoles().stream().map(role -> role.getName().name()).toList();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("email", user.getEmail())
                .claim("roles", roles)
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plusSeconds(accessExpirationSeconds)))
                .signWith(signingKey())
                .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        if (!(user instanceof AuthenticatedUser authenticatedUser)) {
            return false;
        }
        Claims claims = parseClaims(token);
        Object userId = claims.get("userId");
        Date expiration = claims.getExpiration();
        Object rolesClaim = claims.get("roles");
        List<String> userRoles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.substring("ROLE_".length()))
                .toList();
        return userId instanceof Number number
                && number.longValue() == authenticatedUser.id()
                && user.getUsername().equalsIgnoreCase(claims.getSubject())
                && user.getUsername().equalsIgnoreCase(claims.get("email", String.class))
                && rolesClaim instanceof List<?> roles
                && !userRoles.isEmpty()
                && roles.size() == userRoles.size()
                && roles.containsAll(userRoles)
                && user.isEnabled()
                && expiration != null
                && expiration.after(new Date());
    }

    public long getAccessExpirationSeconds() {
        return accessExpirationSeconds;
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
