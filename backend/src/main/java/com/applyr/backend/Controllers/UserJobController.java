package com.applyr.backend.Controllers;

import java.util.List;

import com.applyr.backend.Models.Job;
import com.applyr.backend.Models.User;
import com.applyr.backend.Models.UserJob;
import com.applyr.backend.Respositories.JobRepository;
import com.applyr.backend.Respositories.UserJobRepository;
import com.applyr.backend.Respositories.UserRepository;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/userjobs")
public class UserJobController {

    private final UserJobRepository repository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public UserJobController(UserJobRepository repository, JobRepository jobRepository, UserRepository userRepository){
        this.repository = repository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserJob> getAllUserJob() {
        return this.repository.findAll();
    }

    @GetMapping("/{id}")
    public UserJob getUserJob(@PathVariable Long id) {
        return this.repository.findById(id).orElseThrow(() -> new RuntimeException("UserJob Id not found !"));
    }

    @PostMapping
    public UserJob createUserJob(@RequestBody UserJob userjob) {

        User user = userRepository.findById(userjob.getUser().getId()).orElseThrow( () -> new RuntimeException("User not found !"));
        Job job = jobRepository.findById(userjob.getJob().getId()).orElseThrow( () -> new RuntimeException("User not found !"));

        userjob.setUser(user);
        userjob.setJob(job);
        return this.repository.save(userjob);
    }

    @PutMapping("/{id}")
    public UserJob updateUserJob(@PathVariable Long id, @RequestBody UserJob newUserJob) {

        UserJob userjob = this.repository.findById(id).orElseThrow( () -> new RuntimeException("UserJob Id not found !"));

        userjob.setUser(newUserJob.getUser());
        userjob.setJob(newUserJob.getJob());
        userjob.setDate(newUserJob.getDate());
        userjob.setNotes(newUserJob.getNotes());
        userjob.setStatus(newUserJob.getStatus());

        return this.repository.save(userjob);
    }

    @DeleteMapping("/{id}")
    public void deleteUserJobById(@PathVariable Long id){
        this.repository.deleteById(id);
    }
       
}
