package com.example.FirstGrocery.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double discountPrice;
    private String quantity;
    private String imageUrl;
    private Long categoryId; // Include category ID
    private Long subCategoryId; // Include subcategory ID
    private String subCategoryName; // Include subcategory name for response


}
