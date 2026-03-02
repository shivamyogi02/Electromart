package com.electromart.controller;

import com.electromart.dtos.ProductRequest;
import com.electromart.model.Product;
import com.electromart.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

  private final ProductRepository productRepository;

  public ProductController(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  // GET /api/products?category=mobiles&page=0&size=8
  @GetMapping
  public Page<Product> list(@RequestParam(defaultValue = "all") String category,
                            @RequestParam(defaultValue = "0") int page,
                            @RequestParam(defaultValue = "8") int size) {
    Pageable p = PageRequest.of(page, size);
    if (!"all".equalsIgnoreCase(category)) {
      return productRepository.findByCategoryIgnoreCase(category, p);
    } else {
      return productRepository.findAll(p);
    }
  }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody ProductRequest req) {
    Product product = new Product();
    product.setTitle(req.getTitle());
    product.setDescription(req.getDescription());
    product.setPrice(req.getPrice());
    product.setCategory(req.getCategory() != null ? req.getCategory().toLowerCase() : null);
    product.setImageBase64(req.getImageBase64());
    productRepository.save(product);
    return ResponseEntity.ok(product);
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> update(@PathVariable String id, @RequestBody ProductRequest req) {
    return productRepository.findById(id).map(p -> {
      p.setTitle(req.getTitle());
      p.setDescription(req.getDescription());
      p.setPrice(req.getPrice());
      p.setCategory(req.getCategory() != null ? req.getCategory().toLowerCase() : p.getCategory());
      p.setImageBase64(req.getImageBase64() != null ? req.getImageBase64() : p.getImageBase64());
      productRepository.save(p);
      return ResponseEntity.ok(p);
    }).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable String id) {
    productRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
