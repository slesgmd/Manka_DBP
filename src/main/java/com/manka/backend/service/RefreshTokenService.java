package com.manka.backend.service;

import com.manka.backend.exception.InvalidTokenException;
import com.manka.backend.exception.RefreshTokenExpiredException;
import com.manka.backend.model.RefreshToken;
import com.manka.backend.model.User;
import com.manka.backend.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final long expirationSeconds;
    private final SecureRandom secureRandom = new SecureRandom();

    public RefreshTokenService(
            RefreshTokenRepository repository,
            @Value("${security.jwt.refresh-expiration-seconds}") long expirationSeconds
    ) {
        this.repository = repository;
        this.expirationSeconds = expirationSeconds;
    }

    public String issue(User user) {
        String rawToken = generateToken();
        repository.save(new RefreshToken(
                hash(rawToken),
                user,
                Instant.now().plusSeconds(expirationSeconds)
        ));
        return rawToken;
    }

    public Rotation rotate(String rawToken) {
        RefreshToken stored = findActive(rawToken);
        if (!stored.getUser().isEnabled()) {
            throw new InvalidTokenException("User account is disabled");
        }
        stored.setRevoked(true);
        return new Rotation(stored.getUser(), issue(stored.getUser()));
    }

    public void revoke(String rawToken) {
        RefreshToken stored = repository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new InvalidTokenException("Refresh token is invalid"));
        stored.setRevoked(true);
    }

    private RefreshToken findActive(String rawToken) {
        RefreshToken stored = repository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new InvalidTokenException("Refresh token is invalid"));
        if (stored.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked");
        }
        if (stored.getExpiresAt().isBefore(Instant.now())) {
            stored.setRevoked(true);
            throw new RefreshTokenExpiredException("Refresh token has expired");
        }
        return stored;
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }

    public record Rotation(User user, String refreshToken) {
    }
}
