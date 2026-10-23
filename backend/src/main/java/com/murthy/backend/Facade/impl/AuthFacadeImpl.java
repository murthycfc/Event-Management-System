package com.murthy.backend.Facade.impl;

import com.murthy.backend.Facade.api.AuthFacade;
import com.murthy.backend.dto.request.LoginRequest;
import com.murthy.backend.dto.request.RegisterRequest;
import com.murthy.backend.dto.response.AuthResponse;
import com.murthy.backend.dto.response.LogoutResponse;
import com.murthy.backend.service.api.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthFacadeImpl implements AuthFacade {
    private final AuthService authService;

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        return authService.login(loginRequest);
    }

    @Override
    public LogoutResponse logout() {
        return authService.logout();
    }
}
