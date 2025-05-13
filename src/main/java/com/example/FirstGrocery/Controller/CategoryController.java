package com.example.FirstGrocery.Controller;


import com.example.FirstGrocery.Model.Category;
import com.example.FirstGrocery.Service.CategoryService;
import com.example.FirstGrocery.Service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")

public class CategoryController {
    private final CategoryService categoryService;
    private final S3Service s3Service;
    @PostMapping(value = "/addCategory", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Category> addCategory(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file
    ) {
        // Create a new Category object
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);

        // Save the category to the database
        Category savedCategory = categoryService.createCategory(category);

        // Handle image upload if needed (for example, save to S3)
        String imageUrl = s3Service.upload(file);
        savedCategory.setImageUrl(imageUrl);
        categoryService.createCategory(savedCategory);

        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }
@GetMapping("/getCategory/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable("id") Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable("id") Long id, @RequestBody Category category) {
        try {
            Category updatedCategory = categoryService.updateCategory(id, category);
            return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long id) {
        try {
            categoryService.deleteCategory(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getAllCategories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> allCategories = categoryService.getAllCategories();
        allCategories.forEach(category -> {
            category.getProducts().size(); // Forces initialization
            category.getSubCategories().size(); // Forces initialization
        });
        return ResponseEntity.ok(allCategories);
    }


}
