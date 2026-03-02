package com.electromart.repository;

import com.electromart.model.CartItem;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, String> {
  List<CartItem> findByUsername(String username);
  
  @Transactional
  void deleteByUsernameAndProductId(String username, String productId);
}
