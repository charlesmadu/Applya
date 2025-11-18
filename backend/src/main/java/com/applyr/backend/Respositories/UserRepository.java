package com.applyr.backend.Respositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.applyr.backend.Models.User;

public interface UserRepository extends JpaRepository<User, Long>{
    
}
