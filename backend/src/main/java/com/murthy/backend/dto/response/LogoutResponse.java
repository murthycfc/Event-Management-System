package com.murthy.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class LogoutResponse {
    private String message;
    private LocalDateTime loggedOutAt;
}
