package com.electromart.controller;

import com.electromart.dtos.AuthResponse;
import com.electromart.dtos.LoginRequest;
import com.electromart.dtos.SignupRequest;
import com.electromart.model.Role;
import com.electromart.model.User;
import com.electromart.repository.UserRepository;
import com.electromart.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
    if (userRepository.existsByUsername(req.getUsername())) {
      return ResponseEntity.badRequest().body(Map.of("error", "username_taken"));
    }
    User u = new User();
    u.setUsername(req.getUsername());
    u.setPassword(passwordEncoder.encode(req.getPassword()));
    u.setEmail(req.getEmail());
    if ("admin".equalsIgnoreCase(req.getRole())) {
      u.setRole(Role.ADMIN);
    } else {
      u.setRole(Role.USER);
    }
    userRepository.save(u);
    String token = jwtUtil.generateToken(u.getUsername(), u.getRole().name());
    return ResponseEntity.ok(new AuthResponse(token, u.getUsername(), u.getRole().name()));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    return userRepository.findByUsername(req.getUsername())
        .map(user -> {
          if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "invalid_credentials"));
          }
          String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
          return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.getRole().name()));
        })
        .orElseGet(() -> {
          // optional fallback demo creds (useful for dev)
          if ("admin".equals(req.getUsername()) && "admin".equals(req.getPassword())) {
            String token = jwtUtil.generateToken("admin", Role.ADMIN.name());
            return ResponseEntity.ok(new AuthResponse(token, "admin", Role.ADMIN.name()));
          }
          if ("user".equals(req.getUsername()) && "user".equals(req.getPassword())) {
            String token = jwtUtil.generateToken("user", Role.USER.name());
            return ResponseEntity.ok(new AuthResponse(token, "user", Role.USER.name()));
          }
          return ResponseEntity.status(401).body(Map.of("error", "invalid_credentials"));
        });
  }
}
