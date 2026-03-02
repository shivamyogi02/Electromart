
package com.electromart.controller;

import com.electromart.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth) {
        String username = auth.getName();

        return userRepository.findByUsername(username)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok().body(user))
                .orElseGet(() -> ResponseEntity.status(404).body(
                        Map.of("error", "not_found")
                ));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody Map<String, Object> body) {
        String username = auth.getName();

        return userRepository.findByUsername(username)
                .<ResponseEntity<?>>map(user -> {
                    if (body.containsKey("email"))
                        user.setEmail((String) body.get("email"));

                    if (body.containsKey("avatarBase64"))
                        user.setAvatarBase64((String) body.get("avatarBase64"));

                    if (body.containsKey("password"))
                        user.setPassword((String) body.get("password")); // encode if needed

                    userRepository.save(user);
                    return ResponseEntity.ok().body(user);
                })
                .orElseGet(() -> ResponseEntity.status(404).body(
                        Map.of("error", "not_found")
                ));
    }
}
