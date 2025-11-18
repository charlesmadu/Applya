package com.applyr.backend.Respositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.applyr.backend.Models.UserJob;

public interface UserJobRepository extends JpaRepository<UserJob, Long>{

    
} 
