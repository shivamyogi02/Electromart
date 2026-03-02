package com.electromart.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            @Value("${allowed.origin}") String allowedOrigin
    ) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource(allowedOrigin)))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

            	    // 🔓 AUTH & SWAGGER
            	    .requestMatchers(
            	        "/api/auth/**",
            	        "/v3/api-docs/**",
            	        "/swagger-ui/**",
            	        "/swagger-ui.html"
            	    ).permitAll()

            	    // 🔓 PUBLIC PRODUCTS
            	    .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

            	    // 🔐 ADMIN ONLY
            	    .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
            	    .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
            	    .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

            	    // 🔐 USER + ADMIN
            	    .requestMatchers("/api/profile/**").hasAnyRole("USER", "ADMIN")
            	    .requestMatchers("/api/cart/**").hasAnyRole("USER", "ADMIN")

            	    .anyRequest().authenticated()
            	);


        // ✅ JWT FILTER
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ CORS CONFIG
    @Bean
    public CorsConfigurationSource corsConfigurationSource(String allowedOrigin) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ✅ PASSWORD ENCODER
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
