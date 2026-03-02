package com.electromart.controller;

import com.electromart.dtos.CartItemDto;
import com.electromart.model.CartItem;
import com.electromart.model.Product;
import com.electromart.repository.CartItemRepository;
import com.electromart.repository.ProductRepository;

import jakarta.transaction.Transactional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

  private final CartItemRepository cartItemRepository;
  private final ProductRepository productRepository;

  public CartController(
      CartItemRepository cartItemRepository,
      ProductRepository productRepository
  ) {
    this.cartItemRepository = cartItemRepository;
    this.productRepository = productRepository;
  }

  // ✅ RETURN ENRICHED CART
  @GetMapping
  public List<CartItemDto> getCart(Authentication auth) {
    String username = auth.getName();

    return cartItemRepository.findByUsername(username).stream().map(item -> {
      Product p = productRepository.findById(item.getProductId()).orElseThrow();

      return new CartItemDto(
          p.getId(),
          p.getTitle(),
          p.getPrice(),
          item.getQty()
      );
    }).toList();
  }

  // ✅ UPSERT (ADD / UPDATE QTY)
  @PostMapping
  @Transactional
  public ResponseEntity<?> upsertItem(Authentication auth, @RequestBody Map<String, Object> body) {
    String username = auth.getName();
    String productId = (String) body.get("productId");
    Integer qty = (Integer) body.get("qty");

    if (productId == null || qty == null || qty < 1) {
      return ResponseEntity.badRequest().body(Map.of("error", "invalid_payload"));
    }

    cartItemRepository.deleteByUsernameAndProductId(username, productId);

    CartItem item = new CartItem();
    item.setUsername(username);
    item.setProductId(productId);
    item.setQty(qty);
    cartItemRepository.save(item);

    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{productId}")
  public ResponseEntity<?> remove(Authentication auth, @PathVariable String productId) {
    cartItemRepository.deleteByUsernameAndProductId(auth.getName(), productId);
    return ResponseEntity.noContent().build();
  }
}
