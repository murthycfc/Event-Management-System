package com.murthy.backend.dto.response;

import com.murthy.backend.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AuthResponse {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private String token;
}
