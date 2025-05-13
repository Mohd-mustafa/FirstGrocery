package com.example.FirstGrocery.Controller;

import com.example.FirstGrocery.Dto.LoginDto;
import com.example.FirstGrocery.Dto.LoginResponse;
import com.example.FirstGrocery.Dto.RegisterUserDto;
import com.example.FirstGrocery.Model.User;
import com.example.FirstGrocery.Service.AuthenticationService;
import com.example.FirstGrocery.Service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
@RequiredArgsConstructor
public class AuthenticationController {
      private final JwtService jwtService;
      private final AuthenticationService authenticationService;

      @PostMapping("/signup")
      public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto){
          User registeredUser = authenticationService.signup(registerUserDto);
          return ResponseEntity.ok(registeredUser);
      }

      @PostMapping("/login")
      public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginDto loginDto){
          User authenticateUser = authenticationService.authenticate(loginDto);
          String jwtToken = jwtService.generateToken((UserDetails) authenticateUser);
           LoginResponse loginResponse = new LoginResponse() ;

          loginResponse.setToken(jwtToken);
          loginResponse.setExpiresIn(jwtService.getExpirationTime());
          return ResponseEntity.ok(loginResponse);

      }
}
