package com.applya.backend.Models;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

@Entity(name = "Job")
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "company", length = 100, nullable = false)
    private String company;

    @Column(name = "salary", length = 50)
    private String salary;

    @Column(name = "location", length = 100, nullable = false)
    private String location;

    @Column(name = "url", columnDefinition = "TEXT")
    private String url;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Who created/added this job listing
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<UserJob> userJobs;

    // Constructors
    protected Job() {}

    public Job(String title, String company, String salary, String location, String url, User createdBy) {
        this.title = title;
        this.company = company;
        this.salary = salary;
        this.location = location;
        this.url = url;
        this.createdBy = createdBy;
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

    @Override
    public String toString() {
        return String.format("Job[id=%d, title=%s, company=%s]", this.id, this.title, this.company);
    }

    // Getters
    public Long getId() { return this.id; }
    public String getTitle() { return this.title; }
    public String getCompany() { return this.company; }
    public String getSalary() { return this.salary; }
    public String getLocation() { return this.location; }
    public String getUrl() { return this.url; }
    public String getDescription() { return this.description; }
    public User getCreatedBy() { return this.createdBy; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setSalary(String salary) { this.salary = salary; }
    public void setLocation(String location) { this.location = location; }
    public void setUrl(String url) { this.url = url; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}