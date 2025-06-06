package com.example.FirstGrocery.Repository;

import com.example.FirstGrocery.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {

  @Query("SELECT p FROM Product p WHERE p.subCategory.id= :subCategoryId")
  List<Product> findProductsBySubCategoryId(@Param("subCategoryId") Long subCategoryId);


   }
