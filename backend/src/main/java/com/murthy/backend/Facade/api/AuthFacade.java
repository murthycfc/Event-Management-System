package com.murthy.backend.Facade.api;

import com.murthy.backend.dto.request.LoginRequest;
import com.murthy.backend.dto.request.RegisterRequest;
import com.murthy.backend.dto.response.AuthResponse;
import com.murthy.backend.dto.response.LogoutResponse;

public interface AuthFacade {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    LogoutResponse logout();
}
