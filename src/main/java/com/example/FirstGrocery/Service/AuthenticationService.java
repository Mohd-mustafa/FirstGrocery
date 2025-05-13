package com.example.FirstGrocery.Service;

import com.example.FirstGrocery.Dto.LoginDto;
import com.example.FirstGrocery.Dto.RegisterUserDto;
import com.example.FirstGrocery.Model.User;
import com.example.FirstGrocery.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public User signup(RegisterUserDto input) {
        User user = new User();
                user.setFullName(input.getFullName());
        user.setEmail(input.getEmail());
        user.setPassword(passwordEncoder.encode(input.getPassword()));
        user.setPhoneNumber(input.getPhoneNumber());
        return userRepository.save(user);
    }

    public User authenticate(LoginDto loginDto){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.getEmail(),
                        loginDto.getPassword()
                )
        );
        return userRepository.findByEmail(loginDto.getEmail()).orElseThrow();

    }

}
