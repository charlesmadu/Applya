package com.applya.backend.Controllers;

import com.applya.backend.DTOs.AuthDTOs.*;
import com.applya.backend.Models.User;
import com.applya.backend.Repositories.UserRepository;
import com.applya.backend.Security.CustomUserDetails;
import com.applya.backend.Security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder,
                         JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(MessageResponse.error("Email is already registered"));
        }

        // Create new user
        User user = new User(
            request.email(),
            request.firstName(),
            request.lastName(),
            passwordEncoder.encode(request.password())
        );

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());

        // Return response
        UserDTO userDTO = new UserDTO(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getFirstname(),
            savedUser.getLastname(),
            savedUser.getProfileURL(),
            savedUser.getAuthProvider().name()
        );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new AuthResponse(token, userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            String token = tokenProvider.generateToken(user.getId(), user.getEmail());

            UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstname(),
                user.getLastname(),
                user.getProfileURL(),
                user.getAuthProvider().name()
            );

            return ResponseEntity.ok(new AuthResponse(token, userDTO));

        } catch (BadCredentialsException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(MessageResponse.error("Invalid email or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(MessageResponse.error("Not authenticated"));
        }

        User user = userDetails.getUser();

        UserDTO userDTO = new UserDTO(
            user.getId(),
            user.getEmail(),
            user.getFirstname(),
            user.getLastname(),
            user.getProfileURL(),
            user.getAuthProvider().name()
        );

        return ResponseEntity.ok(userDTO);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // For JWT, logout is handled client-side by removing the token
        // This endpoint can be used to invalidate tokens server-side if needed
        return ResponseEntity.ok(MessageResponse.success("Logged out successfully"));
    }
}