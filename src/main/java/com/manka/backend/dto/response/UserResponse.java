package com.manka.backend.dto.response;

import com.manka.backend.model.RoleName;

import java.time.Instant;
import java.util.Set;

public record UserResponse(
        Long id,
        String name,
        String email,
        Set<RoleName> roles,
        boolean enabled,
        Instant createdAt
) {
}
