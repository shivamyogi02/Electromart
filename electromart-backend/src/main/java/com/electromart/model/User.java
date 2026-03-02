package com.electromart.model;


import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
  @Id
  private String id = UUID.randomUUID().toString();

  @Column(unique = true, nullable = false)
  private String username;

  @Column(nullable = false)
  private String password; // stored as BCrypt hash

  private String email;

  @Lob
  @Column(length = 100000)
  private String avatarBase64;

  @Enumerated(EnumType.STRING)
  private Role role = Role.USER;

  // getters and setters
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getUsername() { return username; }
  public void setUsername(String username) { this.username = username; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getAvatarBase64() { return avatarBase64; }
  public void setAvatarBase64(String avatarBase64) { this.avatarBase64 = avatarBase64; }
  public Role getRole() { return role; }
  public void setRole(Role role) { this.role = role; }
}


