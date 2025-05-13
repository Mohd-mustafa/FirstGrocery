package com.example.FirstGrocery.Model;

import lombok.Data;

@Data
public class CartRequest {
    private Long productId;
    private int quantity;
}
