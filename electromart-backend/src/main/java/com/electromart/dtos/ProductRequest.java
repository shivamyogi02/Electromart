package com.electromart.dtos;

public class ProductRequest {
  private String title;
  private String description;
  private double price;
  private String category;
  private String imageBase64;
  // getters & setters
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public double getPrice() { return price; }
  public void setPrice(double price) { this.price = price; }
  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }
  public String getImageBase64() { return imageBase64; }
  public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }
}
