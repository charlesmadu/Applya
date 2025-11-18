package com.applyr.backend.Respositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.applyr.backend.Models.Job;

public interface JobRepository extends JpaRepository<Job, Long>{
    
}
