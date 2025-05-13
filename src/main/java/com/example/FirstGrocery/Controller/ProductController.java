package com.example.FirstGrocery.Controller;

import com.example.FirstGrocery.Dto.ProductDto;
import com.example.FirstGrocery.Model.Category;
import com.example.FirstGrocery.Model.Product;
import com.example.FirstGrocery.Model.SubCategory;
import com.example.FirstGrocery.Service.CategoryService;
import com.example.FirstGrocery.Service.ProductService;
import com.example.FirstGrocery.Service.S3Service;
import com.example.FirstGrocery.Service.SubCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")

public class ProductController {
     private final ProductService productService;
     private final CategoryService categoryService;
     private final S3Service s3Service;
     private final SubCategoryService subCategoryService;
    @PostMapping("/addProduct")
    public ResponseEntity<Product> addProduct(@RequestBody ProductDto productDto) {
        try {
            Product product = new Product();
            product.setName(productDto.getName());
            product.setDescription(productDto.getDescription());
            product.setPrice(productDto.getPrice());
            product.setDiscountPrice(productDto.getDiscountPrice());
            product.setQuantity(productDto.getQuantity());
            product.setImageUrl(productDto.getImageUrl());

            // Validate and fetch the category
            if (productDto.getCategoryId() != null) {
                Optional<Category> categoryOptional = categoryService.getCategoryById(productDto.getCategoryId());
                 if (categoryOptional.isPresent()) {
                    product.setCategory(categoryOptional.get());
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Invalid categoryId
                }
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Missing categoryId
            }

            // Validate and fetch the subCategory
            if (productDto.getSubCategoryId() != null) {
                Optional<SubCategory> subCategoryOptional = subCategoryService.getSubCategoryById(productDto.getSubCategoryId());
                if (subCategoryOptional.isPresent()) {
                    product.setSubCategory(subCategoryOptional.get());
                } else {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Invalid subCategoryId
                }
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Missing subCategoryId
            }

            // Save the product with the category and subCategory
            Product savedProduct = productService.saveProductWithCategory(product);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (RuntimeException e) {
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
        Optional<Product> productOptional = productService.getProductById(id);
        if (productOptional.isEmpty()) {
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        }
        // Update the product with the image URL
        Product product = productOptional.get();
        product.setImageUrl(imageUrl);
        productService.addProduct(product);

        return new ResponseEntity<>("Image uploaded and product updated successfully", HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sub-category/{subCategoryId}")
    public ResponseEntity<List<ProductDto>> getProductsBySubCategory(@PathVariable Long subCategoryId){
        List<ProductDto> productsBySubCategory = productService.getProductsBySubCategory(subCategoryId);
         return ResponseEntity.ok(productsBySubCategory);
    }
}
