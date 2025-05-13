package com.example.FirstGrocery.Repository;

import com.example.FirstGrocery.Model.Product;
import com.example.FirstGrocery.Model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubCategoryRepository  extends JpaRepository<SubCategory,Long> {

    List<SubCategory> findByCategoryCid(Long cid);

}
