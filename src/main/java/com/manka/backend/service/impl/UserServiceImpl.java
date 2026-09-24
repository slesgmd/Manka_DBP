package com.manka.backend.service.impl;

import com.manka.backend.dto.request.UserRoleUpdateRequest;
import com.manka.backend.dto.response.UserResponse;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.exception.RoleNotFoundException;
import com.manka.backend.mapper.AccountMapper;
import com.manka.backend.model.Role;
import com.manka.backend.model.User;
import com.manka.backend.repository.RoleRepository;
import com.manka.backend.repository.UserRepository;
import com.manka.backend.service.CurrentUserService;
import com.manka.backend.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CurrentUserService currentUserService;
    private final AccountMapper mapper;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            CurrentUserService currentUserService,
            AccountMapper mapper
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        return mapper.toResponse(currentUserService.getCurrentUser());
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateRoles(Long userId, UserRoleUpdateRequest request) {
        User user = userRepository.findWithRolesById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User " + userId + " was not found"));
        Set<Role> roles = request.roles().stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new RoleNotFoundException("Role " + roleName + " was not found")))
                .collect(Collectors.toSet());
        user.setRoles(roles);
        return mapper.toResponse(user);
    }
}
