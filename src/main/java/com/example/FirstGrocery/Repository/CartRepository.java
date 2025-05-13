package com.example.FirstGrocery.Repository;

import com.example.FirstGrocery.Model.Cart;
import com.example.FirstGrocery.Model.User;
import org.checkerframework.checker.units.qual.C;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart,Long> {
    Optional<Cart> findByUserId(Long userId);
    Optional<Cart> findByUser(User user);
}