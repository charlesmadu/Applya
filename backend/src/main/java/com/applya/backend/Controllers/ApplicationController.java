package com.applya.backend.Controllers;

import com.applya.backend.DTOs.ApplicationDTOs.*;
import com.applya.backend.Models.Job;
import com.applya.backend.Models.User;
import com.applya.backend.Models.UserJob;
import com.applya.backend.Models.UserJob.ApplicationStatus;
import com.applya.backend.Repositories.JobRepository;
import com.applya.backend.Repositories.UserJobRepository;
import com.applya.backend.Security.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final UserJobRepository userJobRepository;
    private final JobRepository jobRepository;

    public ApplicationController(UserJobRepository userJobRepository, JobRepository jobRepository) {
        this.userJobRepository = userJobRepository;
        this.jobRepository = jobRepository;
    }

    // Get all applications for current user
    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getAllApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<UserJob> userJobs = userJobRepository.findByUserIdWithJob(userDetails.getId());
        
        List<ApplicationResponse> responses = userJobs.stream()
            .map(this::toApplicationResponse)
            .toList();

        return ResponseEntity.ok(responses);
    }

    // Get single application by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return userJobRepository.findById(id)
            .filter(uj -> uj.getUser().getId().equals(userDetails.getId()))
            .map(uj -> ResponseEntity.ok(toApplicationResponse(uj)))
            .orElse(ResponseEntity.notFound().build());
    }

    // Create new application
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody CreateApplicationRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        User user = userDetails.getUser();

        // Create the job entry
        Job job = new Job(
            request.title(),
            request.company(),
            request.salary(),
            request.location() != null ? request.location() : "Not specified",
            request.url(),
            user
        );
        job.setDescription(request.description());
        Job savedJob = jobRepository.save(job);

        // Create the user-job association (application)
        UserJob userJob = new UserJob(
            user,
            savedJob,
            request.appliedDate() != null ? request.appliedDate() : LocalDate.now(),
            request.status() != null ? request.status() : ApplicationStatus.APPLIED
        );
        userJob.setNotes(request.notes());
        userJob.setContactName(request.contactName());
        userJob.setContactEmail(request.contactEmail());

        UserJob savedUserJob = userJobRepository.save(userJob);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(toApplicationResponse(savedUserJob));
    }

    // Update application
    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return userJobRepository.findById(id)
            .filter(uj -> uj.getUser().getId().equals(userDetails.getId()))
            .map(userJob -> {
                Job job = userJob.getJob();

                // Update job details if provided
                if (request.title() != null) job.setTitle(request.title());
                if (request.company() != null) job.setCompany(request.company());
                if (request.location() != null) job.setLocation(request.location());
                if (request.salary() != null) job.setSalary(request.salary());
                if (request.url() != null) job.setUrl(request.url());
                if (request.description() != null) job.setDescription(request.description());
                jobRepository.save(job);

                // Update application details
                if (request.notes() != null) userJob.setNotes(request.notes());
                if (request.contactName() != null) userJob.setContactName(request.contactName());
                if (request.contactEmail() != null) userJob.setContactEmail(request.contactEmail());
                if (request.appliedDate() != null) userJob.setAppliedDate(request.appliedDate());
                if (request.status() != null) userJob.setStatus(request.status());

                UserJob updated = userJobRepository.save(userJob);
                return ResponseEntity.ok(toApplicationResponse(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Update application status only
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return userJobRepository.findById(id)
            .filter(uj -> uj.getUser().getId().equals(userDetails.getId()))
            .map(userJob -> {
                userJob.setStatus(status);
                UserJob updated = userJobRepository.save(userJob);
                return ResponseEntity.ok(toApplicationResponse(updated));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Delete application
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        return userJobRepository.findById(id)
            .filter(uj -> uj.getUser().getId().equals(userDetails.getId()))
            .map(userJob -> {
                userJobRepository.delete(userJob);
                // Optionally delete the job if it's not shared
                jobRepository.delete(userJob.getJob());
                return ResponseEntity.noContent().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // Get application statistics
    @GetMapping("/stats")
    public ResponseEntity<ApplicationStats> getStats(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        Long userId = userDetails.getId();
        
        ApplicationStats stats = new ApplicationStats(
            userJobRepository.countByUserId(userId),
            userJobRepository.countByUserIdAndStatus(userId, ApplicationStatus.APPLIED),
            userJobRepository.countByUserIdAndStatus(userId, ApplicationStatus.INTERVIEW),
            userJobRepository.countByUserIdAndStatus(userId, ApplicationStatus.OFFER),
            userJobRepository.countByUserIdAndStatus(userId, ApplicationStatus.REJECTED)
        );

        return ResponseEntity.ok(stats);
    }

    // Helper method to convert UserJob to ApplicationResponse
    private ApplicationResponse toApplicationResponse(UserJob userJob) {
        Job job = userJob.getJob();
        return new ApplicationResponse(
            userJob.getId(),
            job.getId(),
            job.getTitle(),
            job.getCompany(),
            job.getLocation(),
            job.getSalary(),
            job.getUrl(),
            job.getDescription(),
            userJob.getNotes(),
            userJob.getContactName(),
            userJob.getContactEmail(),
            userJob.getAppliedDate(),
            userJob.getStatus(),
            userJob.getCreatedAt(),
            userJob.getUpdatedAt()
        );
    }
}