package com.applyr.backend.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.applyr.backend.Models.User;
import com.applyr.backend.Respositories.UserRepository;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository){
        this.repository = repository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return this.repository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id){
        return this.repository.findById(id).orElseThrow(() -> new RuntimeException("User Id not found !"));
    }

    @PostMapping
    public User createUser(@RequestBody User user) { 
        System.out.println(user);       
        return this.repository.save(user);
    }

    @PutMapping("/{id}")
    public User updateUserById(@PathVariable Long id, @RequestBody User newUser) {

        User user = this.repository.findById(id).orElseThrow(() -> new RuntimeException("User Id not found !"));
        
        user.setFirstname(newUser.getFirstname());
        user.setLastname(newUser.getLastname());
        user.setPassword(user.getPassword());
        user.setProfileURL(newUser.getProfileURL());
        
        return this.repository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUserById(@PathVariable Long id){
        this.repository.deleteById(id);
    }
    
}
