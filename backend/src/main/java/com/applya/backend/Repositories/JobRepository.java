package com.applya.backend.Repositories;

import com.applya.backend.Models.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    
    List<Job> findByCreatedByIdOrderByCreatedAtDesc(Long userId);
    
    List<Job> findByCompanyContainingIgnoreCase(String company);
    
    List<Job> findByTitleContainingIgnoreCase(String title);
}