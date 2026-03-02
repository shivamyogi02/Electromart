package com.electromart.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "cart_items")
public class CartItem {
  @Id
  private String id = UUID.randomUUID().toString();

  private String username; // owner
  private String productId;
  private int qty;

  // getters & setters
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getProductId() { return productId; }
  public void setProductId(String productId) { this.productId = productId; }
  public int getQty() { return qty; }
  public void setQty(int qty) { this.qty = qty; }
}
