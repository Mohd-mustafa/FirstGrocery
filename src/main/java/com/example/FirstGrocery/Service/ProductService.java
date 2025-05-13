package com.example.FirstGrocery.Service;

import com.example.FirstGrocery.Dto.ProductDto;
import com.example.FirstGrocery.Model.Category;
import com.example.FirstGrocery.Model.Product;
 import com.example.FirstGrocery.Repository.CategoryRepository;
import com.example.FirstGrocery.Repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
     public Product addProduct(Product product) {

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setQuantity(updatedProduct.getQuantity());
            product.setDiscountPrice(updatedProduct.getDiscountPrice());
            product.setImageUrl(updatedProduct.getImageUrl());
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id " + id));
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public Product saveProductWithCategory(Product product) {
        if (product.getCategory() != null && product.getCategory().getCid() != null) {
            // Fetch and check if the category exists
            Optional<Category> categoryOptional = categoryRepository.findById(product.getCategory().getCid());
            if (!categoryOptional.isPresent()) {
                throw new RuntimeException("Category not found");
            }
        }
        // Save the product with the existing category
        return productRepository.save(product);
    }

    public List<ProductDto> getProductsBySubCategory(Long subCategoryId){
        return productRepository.findProductsBySubCategoryId(subCategoryId)
                .stream()
                .map(product -> {
                    ProductDto productDto = new ProductDto();
                    productDto.setId(product.getProductId());
                    productDto.setName(product.getName());
                    productDto.setDescription(product.getDescription());
                    productDto.setPrice(product.getPrice());
                    productDto.setDiscountPrice(product.getDiscountPrice());
                    productDto.setQuantity(product.getQuantity());
                    productDto.setImageUrl(product.getImageUrl());
                    if(product.getSubCategory() !=null){
                        productDto.setSubCategoryName(product.getSubCategory().getName());
                    }
                    return productDto;
                })
                .collect(Collectors.toList());
    }

}

