package com.manka.backend.dto.request;

import com.manka.backend.model.RoleName;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record UserRoleUpdateRequest(@NotEmpty Set<@NotNull RoleName> roles) {
}
