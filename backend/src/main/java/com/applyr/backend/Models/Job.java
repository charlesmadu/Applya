package com.applyr.backend.Models;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity(name = "Job")
@Table(name = "JOBS")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "TITLE", length = 100, nullable = false, unique = false)
    private String title;

    @Column(name = "COMPANY", length = 50, nullable = false, unique = false)
    private String company;

    @Column(name = "SALARY", nullable = true, unique = false)
    private Integer salary;

    @Column(name = "LOCATION", length = 50, nullable = false, unique = false)
    private String location;

    @Column(name = "URL", columnDefinition = "TEXT", nullable = false, unique = true)
    private String URL;

    @OneToMany(mappedBy = "job")
    private List<UserJob> userjob;

    protected Job(){};

    public Job(String title, String company, Integer salary, String location, String URL){
        this.title = title;
        this.company = company;
        this.salary = salary;
        this.location = location;
        this.URL = URL;

    }

    @Override
    public String toString(){
        return String.format(
            "Job[id=%d, Title=%s, Company=%s, Salary=%d, Location=%s, URL=%s]",
        this.id, this.title, this.company, this.salary, this.location, this.URL);
    }

    // Getter Methods

    public Long getId(){
        return this.id;
    }

    public String getTitle(){
        return this.title;
    }

    public String getCompany(){
        return this.company;
    }

    public Integer getSalary(){
        return this.salary;
    }

    public String getLocation(){
        return this.location;
    }

    public String getURL(){
        return this.URL;
    }

    // Setter Methods

    public void setTitle(String title){
        this.title = title;
    }

    public void setCompany(String company){
        this.company = company;
    }

    public void setSalary(Integer salary){
        this.salary = salary;
    }

    public void setLocation(String location){
        this.location = location;
    }

    public void setURL(String URL){
        this.URL = URL;
    }
    
}
