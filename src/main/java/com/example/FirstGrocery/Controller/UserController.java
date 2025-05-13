package com.example.FirstGrocery.Controller;

 import com.example.FirstGrocery.Dto.UserDTO;
 import com.example.FirstGrocery.Model.User;
 import com.example.FirstGrocery.Service.UserService;
import lombok.RequiredArgsConstructor;
 import org.springframework.http.HttpStatus;
 import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

 @RestController
 @RequestMapping("/api/user")
 @RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/")
    public ResponseEntity<List<User>> allUser() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);

    }

    @GetMapping("/current-user")
    public ResponseEntity<UserDTO> getCurrentUserDetails(){
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        if(authentication !=null){
            User currentUser =(User) authentication.getPrincipal();
            return ResponseEntity.ok(new UserDTO(currentUser) );
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

}