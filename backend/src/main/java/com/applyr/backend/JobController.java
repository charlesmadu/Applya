package com.applyr.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository repository;

    public JobController(JobRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return this.repository.findAll();
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long param) {
        return this.repository.findById(param).orElseThrow(() -> new RuntimeException("Product not found !"));
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return this.repository.save(job);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {

        Job job = this.repository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));

        job.setTitle(updatedJob.getTitle());
        job.setCompany(updatedJob.getCompany());
        job.setSalary(updatedJob.getSalary());
        job.setLocation(updatedJob.getLocation());
        job.setURL(updatedJob.getURL());
        job.setDate(updatedJob.getDate());
        job.setNotes(updatedJob.getNotes());
        job.setStatus(updatedJob.getStatus());

        return this.repository.save(job);
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id){
        this.repository.deleteById(id);
    }

}
