package com.manka.backend.service.impl;

import com.manka.backend.dto.request.LoginRequest;
import com.manka.backend.dto.request.RegisterRequest;
import com.manka.backend.dto.response.AuthResponse;
import com.manka.backend.event.UserRegisteredEvent;
import com.manka.backend.exception.InvalidCredentialsException;
import com.manka.backend.exception.UserAlreadyExistsException;
import com.manka.backend.mapper.AccountMapper;
import com.manka.backend.model.Role;
import com.manka.backend.model.RoleName;
import com.manka.backend.model.User;
import com.manka.backend.repository.RoleRepository;
import com.manka.backend.repository.UserRepository;
import com.manka.backend.security.JwtService;
import com.manka.backend.service.AuthService;
import com.manka.backend.service.RefreshTokenService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AccountMapper mapper;
    private final ApplicationEventPublisher eventPublisher;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            RefreshTokenService refreshTokenService,
            AccountMapper mapper,
            ApplicationEventPublisher eventPublisher
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.mapper = mapper;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new UserAlreadyExistsException("Email is already registered");
        }
        User user = new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password())
        );
        user.getRoles().add(getOrCreateRole(RoleName.USER));
        User saved = userRepository.save(user);
        AuthResponse response = issueTokens(saved);
        eventPublisher.publishEvent(new UserRegisteredEvent(saved.getId(), saved.getName(), saved.getEmail()));
        return response;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password())
            );
        } catch (AuthenticationException exception) {
            throw new InvalidCredentialsException("Email or password is incorrect");
        }
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new InvalidCredentialsException("Email or password is incorrect"));
        return issueTokens(user);
    }

    @Override
    public AuthResponse refresh(String refreshToken) {
        RefreshTokenService.Rotation rotation = refreshTokenService.rotate(refreshToken);
        return buildResponse(rotation.user(), rotation.refreshToken());
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenService.revoke(refreshToken);
    }

    private AuthResponse issueTokens(User user) {
        return buildResponse(user, refreshTokenService.issue(user));
    }

    private AuthResponse buildResponse(User user, String refreshToken) {
        return new AuthResponse(
                jwtService.generateAccessToken(user),
                refreshToken,
                "Bearer",
                jwtService.getAccessExpirationSeconds(),
                mapper.toResponse(user)
        );
    }

    private Role getOrCreateRole(RoleName roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
