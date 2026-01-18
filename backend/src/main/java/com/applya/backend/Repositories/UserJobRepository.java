package com.applya.backend.Repositories;

import com.applya.backend.Models.User;
import com.applya.backend.Models.UserJob;
import com.applya.backend.Models.UserJob.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserJobRepository extends JpaRepository<UserJob, Long> {
    
    List<UserJob> findByUserOrderByCreatedAtDesc(User user);
    
    List<UserJob> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    long countByUserId(Long userId);
    
    long countByUserIdAndStatus(Long userId, ApplicationStatus status);
    
    @Query("SELECT uj FROM UserJob uj JOIN FETCH uj.job WHERE uj.user.id = :userId ORDER BY uj.createdAt DESC")
    List<UserJob> findByUserIdWithJob(@Param("userId") Long userId);
    
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}