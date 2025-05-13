package com.example.FirstGrocery.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddToCartDto {
    private Long userId;
    private Long productId;
    private Integer quantity;
}
