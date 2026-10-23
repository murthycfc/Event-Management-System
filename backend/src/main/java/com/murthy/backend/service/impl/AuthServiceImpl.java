package com.murthy.backend.service.impl;

import com.murthy.backend.dto.request.LoginRequest;
import com.murthy.backend.dto.request.RegisterRequest;
import com.murthy.backend.dto.response.AuthResponse;
import com.murthy.backend.dto.response.LogoutResponse;
import com.murthy.backend.enums.Role;
import com.murthy.backend.exception.*;
import com.murthy.backend.model.User;
import com.murthy.backend.repo.UserRepository;
import com.murthy.backend.security.CustomUserPrincipal;
import com.murthy.backend.security.JwtService;
import com.murthy.backend.security.SecurityUtils;
import com.murthy.backend.service.api.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        try {
            if(userRepository.existsEmail(request.getEmail())==1){
                log.error("Registration failed, email {} already exists", request.getEmail());
                throw new ResourceAlreadyExistsException("Email already exists");
            }
            User user = new User();
            BeanUtils.copyProperties(request, user);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(Role.CUSTOMER);
            user.setLoggedIn(true);
            User savedUser = userRepository.save(user);

            log.info("New user registered with email {}", request.getEmail());

            AuthResponse response = new AuthResponse();
            BeanUtils.copyProperties(savedUser, response);

            CustomUserPrincipal principal = new CustomUserPrincipal(savedUser);
            String token = jwtService.generateToken(principal);
            response.setToken(token);
            return response;
        }
        catch (ResourceAlreadyExistsException ex){
            throw ex;
        }
        catch (Exception e) {
            log.info("An error occurred in register method while registering {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            User user = userRepository.findEmail(request.getEmail())
                    .orElseThrow(()->{
                        log.error("{} not found while user trying to login", request.getEmail());
                       return new InvalidCredentialsException("Invalid credentials");
                    });
            if(!user.isActive()){
                log.error("Login failed: {} is deactivated", request.getEmail());
                throw new UserInactiveException("Account deactivated");
            }
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            CustomUserPrincipal principal = (CustomUserPrincipal) authentication.getPrincipal();
            String token = jwtService.generateToken(principal);

            user.setLoggedIn(true);
            userRepository.save(user);

            AuthResponse response = new AuthResponse();
            BeanUtils.copyProperties(user, response);
            response.setToken(token);

            log.info("A user logged in with email {}", request.getEmail());

            return response;
        }
        catch (InvalidCredentialsException | UserInactiveException ex){
            throw ex;
        }
        catch (BadCredentialsException e){
            log.error("Invalid credentials. Email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid credentials");
        }
        catch (Exception e) {
            log.error("An error occurred in login method while logging a user with email {}, {}", request.getEmail(), e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public LogoutResponse logout() {
        try {

            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();

            currentUser.setLoggedIn(false);
            userRepository.save(currentUser);

            LogoutResponse response = new LogoutResponse();
            response.setMessage("Logged out successfully");
            response.setLoggedOutAt(LocalDateTime.now());

            return response;

        } catch (Exception e) {
            log.error("An error occurred in logout {}", e.getMessage() );
            throw new BadRequestException(e.getMessage());
        }
    }
}


