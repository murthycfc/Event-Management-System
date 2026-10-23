package com.murthy.backend.controller;

import com.murthy.backend.Facade.api.AuthFacade;
import com.murthy.backend.dto.request.LoginRequest;
import com.murthy.backend.dto.request.RegisterRequest;
import com.murthy.backend.dto.response.AuthResponse;
import com.murthy.backend.dto.response.LogoutResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthFacade authFacade;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest){
        return ResponseEntity.ok(authFacade.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(authFacade.login(loginRequest));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(){
        log.info("controller");
        return ResponseEntity.ok(authFacade.logout());
    }

}
