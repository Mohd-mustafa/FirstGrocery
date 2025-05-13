package com.example.FirstGrocery.Dto;

import com.example.FirstGrocery.Model.Address;
import com.example.FirstGrocery.Model.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)

 public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber; // Add this field
    private List<Address> addresses;



    public UserDTO(User user) {
        this.id = user.getId();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.phoneNumber=user.getPhoneNumber();
        this.addresses = user.getAddresses() != null ? new ArrayList<>(user.getAddresses()) : null; // Force fetch
    }
}
