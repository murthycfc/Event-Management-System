package com.murthy.backend.security;

import com.murthy.backend.model.User;
import com.murthy.backend.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findEmail(email)
                .orElseThrow(()->new UsernameNotFoundException("Email not found"));
        return new CustomUserPrincipal(user);
    }
}
