package com.example.FirstGrocery.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // Allow requests from your frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allow necessary HTTP methods
                .allowedHeaders("*")  // Allow all headers
                .allowCredentials(true)  // Enable if you need cookies or credentials
                .maxAge(3600000
                );  // Cache the CORS preflight response for 1 hour
    }
}