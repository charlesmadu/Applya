package com.applya.backend.Models;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    public enum AuthProvider {
        LOCAL,
        GOOGLE,
        FACEBOOK
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "firstname", length = 50, nullable = false)
    private String firstname;

    @Column(name = "lastname", length = 50, nullable = false)
    private String lastname;

    @Column(name = "password", columnDefinition = "TEXT")
    private String password; // Nullable for OAuth users

    @Column(name = "profile_url", columnDefinition = "TEXT")
    private String profileURL;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "provider_id")
    private String providerId; // ID from OAuth provider

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserJob> jobs;

    // Constructors
    protected User() {}

    public User(String email, String firstname, String lastname, String password) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.authProvider = AuthProvider.LOCAL;
    }

    // OAuth constructor
    public User(String email, String firstname, String lastname, AuthProvider provider, String providerId) {
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.authProvider = provider;
        this.providerId = providerId;
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
        return String.format("User[id=%d, email=%s, name=%s %s]", 
            this.id, this.email, this.firstname, this.lastname);
    }

    // Getters
    public Long getId() { return this.id; }
    public String getEmail() { return this.email; }
    public String getFirstname() { return this.firstname; }
    public String getLastname() { return this.lastname; }
    public String getPassword() { return this.password; }
    public String getProfileURL() { return this.profileURL; }
    public AuthProvider getAuthProvider() { return this.authProvider; }
    public String getProviderId() { return this.providerId; }
    public LocalDateTime getCreatedAt() { return this.createdAt; }
    public LocalDateTime getUpdatedAt() { return this.updatedAt; }
    public Set<UserJob> getJobs() { return this.jobs; }

    // Setters
    public void setEmail(String email) { this.email = email; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public void setPassword(String password) { this.password = password; }
    public void setProfileURL(String profileURL) { this.profileURL = profileURL; }
    public void setAuthProvider(AuthProvider authProvider) { this.authProvider = authProvider; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
}