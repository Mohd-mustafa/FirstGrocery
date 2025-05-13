package com.example.FirstGrocery.Controller;

import com.example.FirstGrocery.Model.Address;
import com.example.FirstGrocery.Model.User;
import com.example.FirstGrocery.Service.AddressService;
import com.example.FirstGrocery.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    private final AddressService addressService;
    private final UserService userService;
    @PostMapping("/create/{userId}")
    public ResponseEntity<String> createAddress(@RequestBody Address address, @PathVariable Long userId){
        User byUserId = userService.findByUserId(userId);
         if(byUserId ==null){
             return ResponseEntity.badRequest().body("User not found.");

         }
         address.setUser(byUserId);
         addressService.saveAddress(address);
        return ResponseEntity.ok("Address created successfully.");

    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAllAddressByUserId(@PathVariable Long userId){
        List<Address> allAddressesByUserId = addressService.getAllAddressesByUserId(userId);
        return new ResponseEntity<>(allAddressesByUserId,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Long id){
        Optional<Address> address=addressService.getAddressById(id);
        return address.map(ResponseEntity::ok).orElseGet(()->ResponseEntity.status(HttpStatus.NOT_FOUND).build())
    ;}

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateCurrentAddress(@PathVariable Long id,@RequestBody Address address){
        Optional<Address> addressById = addressService.getAddressById(id);
        if(addressById.isPresent()){
            Address updatedAddress = addressService.updateAddress(id, address);
            return new ResponseEntity<>(updatedAddress, HttpStatus.OK);
        }
        else
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

        }

    }

    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable Long id){
        Optional<Address> addressById = addressService.getAddressById(id);

    }

}
