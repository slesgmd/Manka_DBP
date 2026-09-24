package com.manka.backend.service;

import com.manka.backend.dto.request.UserRoleUpdateRequest;
import com.manka.backend.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getCurrentUser();

    List<UserResponse> findAll();

    UserResponse updateRoles(Long userId, UserRoleUpdateRequest request);
}
