package com.example.FirstGrocery.Repository;

import com.example.FirstGrocery.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository  extends JpaRepository<User,Long> {
     public User findByPhoneNumber(String phoneNumber);
    Optional<User> findByEmail(String email);

    public boolean existsByEmail(String email);
    public boolean existsByPhoneNumber(String phoneNumber);
}
