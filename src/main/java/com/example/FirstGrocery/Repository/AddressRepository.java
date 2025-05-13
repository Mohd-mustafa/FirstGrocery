package com.example.FirstGrocery.Repository;

import com.example.FirstGrocery.Model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address,Long> {

    List<Address> findByUserId(Long userId);
}
