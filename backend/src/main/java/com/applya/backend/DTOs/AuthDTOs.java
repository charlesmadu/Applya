package com.applya.backend.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Login Request DTO
public class AuthDTOs {

    public record LoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        String password
    ) {}

    public record RegisterRequest(
        @NotBlank(message = "First name is required")
        @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password
    ) {}

    public record AuthResponse(
        String token,
        String tokenType,
        UserDTO user
    ) {
        public AuthResponse(String token, UserDTO user) {
            this(token, "Bearer", user);
        }
    }

    public record UserDTO(
        Long id,
        String email,
        String firstName,
        String lastName,
        String profileURL,
        String authProvider
    ) {}

    public record MessageResponse(
        String message,
        boolean success
    ) {
        public static MessageResponse success(String message) {
            return new MessageResponse(message, true);
        }

        public static MessageResponse error(String message) {
            return new MessageResponse(message, false);
        }
    }
}