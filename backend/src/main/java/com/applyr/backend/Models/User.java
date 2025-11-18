package com.applyr.backend.Models;

import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "FIRSTNAME", length = 50, nullable = false, unique = false)
    private String firstname;

    @Column(name = "LASTNAME", length = 50, nullable = false, unique = false)
    private String lastname;

    @Column(name = "PASSWORD", columnDefinition = "TEXT", nullable = false, unique = false)
    private String password;

    @Column(name = "PROFILEURL", columnDefinition = "TEXT", nullable = true, unique = false)
    private String profileURL;

    @OneToMany(mappedBy = "user")
    private Set<UserJob> jobs;

    protected User() {};

    public User(String firstname, String lastname, String password, String profileURL){
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.profileURL = profileURL;
    }

    @Override
    public String toString(){
        return String.format("User[Firstname:%s, Lastname:%s, Password:%s, ProfileURL:%s]", this.firstname, this.lastname, this.password, this.profileURL);
    }

    // Getters

    public Long getId(){
        return this.id;
    }

    public String getFirstname(){
        return this.firstname;
    }

    public String getLastname(){
        return this.lastname;
    }

    public String getPassword(){
        return this.password;
    }

    public String getProfileURL(){
        return this.profileURL;
    }

    // Setters

    public void setFirstname(String firstname){
        this.firstname = firstname;
    }

    public void setLastname(String lastname){
        this.lastname = lastname;
    }

    public void setPassword(String password){
        this.password = password;
    }

    public void setProfileURL(String profileURL){
        this.profileURL = profileURL;
    }

}
