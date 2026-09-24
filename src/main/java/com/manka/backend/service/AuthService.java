package com.manka.backend.service;

import com.manka.backend.dto.request.LoginRequest;
import com.manka.backend.dto.request.RegisterRequest;
import com.manka.backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);
}
