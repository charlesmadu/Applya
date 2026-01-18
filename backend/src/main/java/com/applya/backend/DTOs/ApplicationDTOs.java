package com.applya.backend.DTOs;

import com.applya.backend.Models.UserJob.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ApplicationDTOs {

    // Request to create a new job application
    public record CreateApplicationRequest(
        @NotBlank(message = "Job title is required")
        String title,

        @NotBlank(message = "Company is required")
        String company,

        String location,
        String salary,
        String url,
        String description,
        String notes,
        String contactName,
        String contactEmail,

        LocalDate appliedDate,

        ApplicationStatus status
    ) {}

    // Request to update an existing application
    public record UpdateApplicationRequest(
        String title,
        String company,
        String location,
        String salary,
        String url,
        String description,
        String notes,
        String contactName,
        String contactEmail,
        LocalDate appliedDate,
        ApplicationStatus status
    ) {}

    // Response DTO for applications
    public record ApplicationResponse(
        Long id,
        Long jobId,
        String title,
        String company,
        String location,
        String salary,
        String url,
        String description,
        String notes,
        String contactName,
        String contactEmail,
        LocalDate appliedDate,
        ApplicationStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {}

    // Summary stats for dashboard
    public record ApplicationStats(
        long total,
        long applied,
        long interview,
        long offer,
        long rejected
    ) {}
}