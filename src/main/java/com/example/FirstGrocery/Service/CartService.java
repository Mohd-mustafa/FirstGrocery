package com.example.FirstGrocery.Service;
import com.example.FirstGrocery.Model.*;
import com.example.FirstGrocery.Repository.CartRepository;
import com.example.FirstGrocery.Repository.ProductRepository;
import com.example.FirstGrocery.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    public Cart getUserCart(Long userId){
        Optional<Cart> cart = cartRepository.findByUserId(userId);
         return cart.orElseGet(() -> createCartForUser(userId));
             }
              public Cart addItemToCart(Long userId,Long productId,int quantity){
                  Cart cart = getUserCart(userId);
                  Product product =productRepository.findById(productId)
                           .orElseThrow(() -> new RuntimeException("Product not found"));
                  CartItem cartItem = new CartItem();
                  cartItem.setCart(cart);
                  cartItem.setProduct(product);
                  cartItem.setQuantity(quantity);
                  cart.getCartItemList().add(cartItem);
                  cartRepository.save(cart);
                  return cart;
              }
              private Cart createCartForUser(Long userId){
                  User user = userRepository.findById(userId)
                          .orElseThrow(() -> new RuntimeException("User not found"));
                  Cart newCart = new Cart();
                  newCart.setUser(user);
                  return cartRepository.save(newCart);
              }

              public Cart addItemsToCart(Long userId, List<CartRequest> cartRequests){
                  User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
                  Cart cart=cartRepository.findByUser(user).orElseGet(() ->{
                      Cart cart1 = new Cart();
                      cart1.setUser(user);
                      return cartRepository.save(cart1);
                  });
                  for (CartRequest cartRequest:cartRequests){
                 Product product= productRepository.findById(cartRequest.getProductId())
                              .orElseThrow(() -> new RuntimeException("Product not founds"));
                      CartItem exitstingCart = cart.getCartItemList().stream()
                              .filter(cartItem -> cartItem.getProduct().getProductId().equals(product.getProductId()))
                              .findFirst()
                              .orElse(null);
                      if(exitstingCart !=null){
                          exitstingCart.setQuantity(exitstingCart.getQuantity() +  cartRequest.getQuantity());

                      }else {
                          CartItem cartItem = new CartItem();
                          cartItem.setProduct(product);
                          cartItem.setQuantity(cartRequest.getQuantity());
                          cartItem.setCart(cart);
                          cart.getCartItemList().add(cartItem);
                      }
                  }

                  if(cart.getCartItemList().isEmpty()){
                      cartRepository.delete(cart);
                      return null;
                  }

              return cartRepository.save(cart);
              }

    public Cart incrementItem(Long userId, Long productId) {
        Cart cart = getUserCart(userId);
        CartItem item = cart.getCartItemList().stream()
                .filter(cartItem -> cartItem.getProduct().getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));
        item.setQuantity(item.getQuantity() + 1);
        return cartRepository.save(cart);
    }
    public Cart decrementItem(Long userId, Long productId) {
        Cart cart = getUserCart(userId);
        CartItem item = cart.getCartItemList().stream()
                .filter(cartItem -> cartItem.getProduct().getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));
        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
        } else {
            cart.getCartItemList().remove(item); // Remove item if quantity drops to zero
        }
        return cartRepository.save(cart);
    }

}