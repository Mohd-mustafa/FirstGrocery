package com.example.FirstGrocery.Controller;


import com.example.FirstGrocery.Dto.SubCategoryDto;
import com.example.FirstGrocery.Model.Category;
import com.example.FirstGrocery.Model.Product;
import com.example.FirstGrocery.Model.SubCategory;
import com.example.FirstGrocery.ResourceNotFoundException;
import com.example.FirstGrocery.Service.CategoryService;
import com.example.FirstGrocery.Service.S3Service;
import com.example.FirstGrocery.Service.SubCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subcategories")
@RequiredArgsConstructor
public class SubCategoryController {

    private final SubCategoryService subCategoryService;
    private final CategoryService categoryService;
    private final S3Service s3Service;
    @PostMapping("/addSubCategory")
    public ResponseEntity<SubCategory> createSubCategory(@RequestBody SubCategoryDto subCategoryDto) {
        try {
            SubCategory subCategory = new SubCategory();
            subCategory.setName(subCategoryDto.getName());
            subCategory.setImageUrl(subCategoryDto.getImage());

            // Optional: Set Category if needed
            if (subCategoryDto.getCategoryId() != null) {
                Optional<Category> categoryOptional = categoryService.getCategoryById(subCategoryDto.getCategoryId());
                if (categoryOptional.isPresent()) {
                    subCategory.setCategory(categoryOptional.get());
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Invalid categoryId
                }
            }

            SubCategory createdSubCategory = subCategoryService.createSubCategory(subCategory);
            return new ResponseEntity<>(createdSubCategory, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the exception (you might use a logger here)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("id") Long id
    ) {
        // Upload the image to AWS S3 and get the URL
        String imageUrl = s3Service.upload(file);
        // Fetch the existing product
        Optional<SubCategory> productOptional = subCategoryService.getSubCategoryById(id);
        if (productOptional.isEmpty()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
        // Update the product with the image URL
        SubCategory subCategory = productOptional.get();
        subCategory.setImageUrl(imageUrl);
        subCategoryService.createSubCategory(subCategory);

        return new ResponseEntity<>("Image uploaded and product updated successfully", HttpStatus.OK);
    }
    // Get all subcategories
    @GetMapping
    public ResponseEntity<List<SubCategory>> getAllSubCategories() {
        try {
            List<SubCategory> subCategories = subCategoryService.getAllSubCategories();
            return new ResponseEntity<>(subCategories, HttpStatus.OK);
        } catch (Exception e) {
            // Log the exception (you might use a logger here)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get a subcategory by ID
    @GetMapping("/{id}")
    public ResponseEntity<SubCategory> getSubCategoryById(@PathVariable Long id) {
        try {
            Optional<SubCategory> subCategoryOptional = subCategoryService.getSubCategoryById(id);
            if (subCategoryOptional.isPresent()) {
                return new ResponseEntity<>(subCategoryOptional.get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // SubCategory not found
            }
        } catch (Exception e) {
            // Log the exception (you might use a logger here)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a subcategory by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<SubCategory> updateSubCategory(@PathVariable Long id, @RequestBody SubCategoryDto subCategoryDto) {
        try {
            SubCategory updatedSubCategory = subCategoryService.updateSubCategory(id, subCategoryDto);
            if (updatedSubCategory != null) {
                return new ResponseEntity<>(updatedSubCategory, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // SubCategory not found
            }
        } catch (Exception e) {
            // Log the exception (you might use a logger here)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a subcategory by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSubCategory(@PathVariable Long id) {
        try {
            boolean isDeleted = subCategoryService.deleteSubCategory(id);
            if (isDeleted) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // SubCategory not found
            }
        } catch (Exception e) {
            // Log the exception (you might use a logger here)
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SubCategory>>
    getSubCategoriesByCategoryId(@PathVariable Long categoryId){
         try {
             List<SubCategory> subCategories = subCategoryService.getSubCategoriesByCategoryId(categoryId);
             return new ResponseEntity<>(subCategories, HttpStatus.OK);
         }catch (ResourceNotFoundException e){
             return new ResponseEntity<>(HttpStatus.NOT_FOUND);
         }catch (Exception e){
             return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
         }
         }

}
