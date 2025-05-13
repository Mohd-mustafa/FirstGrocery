package com.example.FirstGrocery.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data@Entity@NoArgsConstructor@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonBackReference // Prevents serialization of the parent Cart object to avoid recursion.

    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;  // Assuming you have a Product model

    private int quantity;
}

