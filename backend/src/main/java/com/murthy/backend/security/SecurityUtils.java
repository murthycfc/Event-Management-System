package com.murthy.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

public class SecurityUtils {
    public static CustomUserPrincipal getCurrentPrincipal(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserPrincipal) authentication.getPrincipal();
    }

    public static UUID getCurrentUserId(){
        return getCurrentPrincipal().getUserId();
    }
}
