package com.manka.backend.service;

import com.manka.backend.exception.InvalidCredentialsException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.model.User;
import com.manka.backend.repository.UserRepository;
import com.manka.backend.security.AuthenticatedUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new InvalidCredentialsException("Authentication is required");
        }
        return user.id();
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Long userId = getCurrentUserId();
        return userRepository.findWithRolesById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + userId + " was not found"));
    }
}
