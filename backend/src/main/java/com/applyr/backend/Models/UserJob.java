package com.applyr.backend.Models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "USERJOB")
public class UserJob {

    public enum ApplicationStatus{
        Applied,
        Interview,
        Offer,
        Rejected
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "JOB_ID", nullable = false)
    private Job job;

    @Column(name = "DATE", nullable = false, unique = false)
    private LocalDate date;

    @Column(name = "NOTES", length = 1000, nullable = true, unique = false)
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false, unique = false)
    private ApplicationStatus status;
    
    protected UserJob() {};

    public UserJob(User user, Job job, LocalDate date, String notes, ApplicationStatus status){
        this.user = user;
        this.job = job;
        this.date = date;
        this.notes = notes;
        this.status = status;
    }

    // Getter Methods

    public Long getId(){
        return this.id;
    }

    public User getUser(){
        return this.user;
    }

    public Job getJob(){
        return this.job;
    }

    public LocalDate getDate(){
        return this.date;
    }

    public String getNotes(){
        return this.notes;
    }

    public ApplicationStatus getStatus(){
        return this.status;
    }

    // Setter Methods

    public void setUser(User user){
        this.user = user;
    }

    public void setJob(Job job){
        this.job = job;
    }

    public void setDate(LocalDate date){
        this.date = date;
    }

    public void setNotes(String notes){
        this.notes = notes;
    }

    public void setStatus(ApplicationStatus status){
        this.status = status;
    }
}
