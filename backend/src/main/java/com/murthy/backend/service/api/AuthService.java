package com.murthy.backend.service.api;

import com.murthy.backend.dto.request.LoginRequest;
import com.murthy.backend.dto.request.RegisterRequest;
import com.murthy.backend.dto.response.AuthResponse;
import com.murthy.backend.dto.response.LogoutResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    LogoutResponse logout();
}
