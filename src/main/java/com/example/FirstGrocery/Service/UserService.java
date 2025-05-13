package com.example.FirstGrocery.Service;

import com.example.FirstGrocery.Model.User;
 import com.example.FirstGrocery.Repository.ProductRepository;
import com.example.FirstGrocery.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
     private final ProductRepository productRepository;



    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }

   public User findByUserId(Long id){
        return userRepository.findById(id).orElse(null);
    }




}
