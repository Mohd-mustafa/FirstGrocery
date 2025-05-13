package com.example.FirstGrocery.Controller;

import com.example.FirstGrocery.Model.Cart;
import com.example.FirstGrocery.Model.CartRequest;
import com.example.FirstGrocery.Model.User;
import com.example.FirstGrocery.Service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(){
        Long authenticatedUserId = getAuthenticatedUserId();
        Cart cart = cartService.getUserCart(authenticatedUserId);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/view")
    public ResponseEntity<Map<String, Object>> getCartDetails() {
        Long authenticatedUserId = getAuthenticatedUserId();
        Cart cart = cartService.getUserCart(authenticatedUserId);

        // Create a response map with Object as the value type
        Map<String, Object> response = Map.of(
                "userId", authenticatedUserId,
                "totalProducts", cart.getCartItemList().size(), // Assuming cart has a list of items
                "cartItems", cart.getCartItemList()            // Detailed list of items in the cart
        );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestParam Long productId, @RequestParam int quantity) {
        Long authenticatedUserId = getAuthenticatedUserId();
        Cart updatedCart = cartService.addItemToCart(authenticatedUserId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }
    private Long getAuthenticatedUserId() {
        // Cast principal to your custom UserDetails object
        User user=(User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getId();
    }
    @PostMapping("/addMultiple")
    public ResponseEntity<Cart> addMultipleProducts(@RequestBody List<CartRequest> cartRequests){
        Long authenticatedUserId = getAuthenticatedUserId();
        Cart cart = cartService.addItemsToCart(authenticatedUserId, cartRequests);
         return ResponseEntity.ok(cart);
    }

    @PatchMapping("/increment")
    public ResponseEntity<Cart> incrementCartItem(@RequestBody Map<String, Long> requestBody) {
        Long productId = requestBody.get("productId");
        Long authenticatedUserId = getAuthenticatedUserId();
        Cart updatedCart = cartService.incrementItem(authenticatedUserId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    @PatchMapping("/{productId}/decrement")
    public ResponseEntity<Cart> decrementCartItem(@RequestParam Long productId) {
        Long authenticatedUserId = getAuthenticatedUserId();
        Cart updatedCart = cartService.decrementItem(authenticatedUserId, productId);
        return ResponseEntity.ok(updatedCart);
    }


}