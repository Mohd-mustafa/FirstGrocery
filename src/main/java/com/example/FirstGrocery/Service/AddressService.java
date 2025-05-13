package com.example.FirstGrocery.Service;


import com.example.FirstGrocery.Model.Address;
import com.example.FirstGrocery.Repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
     public Address saveAddress(Address address){
          return addressRepository.save(address);
    }

    public List<Address> getAllAddressesByUserId(Long userId){
         return addressRepository.findByUserId(userId);
    }

    public Optional<Address> getAddressById(Long id){
         return addressRepository.findById(id);
    }

    public Address updateAddress(Long id,Address address){
         address.setId(id);
         return addressRepository.save(address);
    }

    public void deleteAddress(Long id){
         addressRepository.deleteById(id);
    }



}
