package com.applya.backend.Models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "user_jobs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "job_id"})
})
public class UserJob {

    public enum ApplicationStatus {
        APPLIED,
        INTERVIEW,
        OFFER,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "applied_date", nullable = false)
    private LocalDate appliedDate;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "contact_name", length = 100)
    private String contactName;

    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    protected UserJob() {}

    public UserJob(User user, Job job, LocalDate appliedDate, ApplicationStatus status) {
        this.user = user;
        this.job = job;
        this.appliedDate = appliedDate;
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return this.id; }
    public User getUser() { return this.user; }
    public Job getJob() { return this.job; }
    public LocalDate getAppliedDate() { return this.appliedDate; }
    public String getNotes() { return this.notes; }
    public ApplicationStatus getStatus() { return this.status; }
    public String getContactName() { return this.contactName; }
    public String getContactEmail() { return this.contactEmail; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }

    // Setters
    public void setUser(User user) { this.user = user; }
    public void setJob(Job job) { this.job = job; }
    public void setAppliedDate(LocalDate appliedDate) { this.appliedDate = appliedDate; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
}