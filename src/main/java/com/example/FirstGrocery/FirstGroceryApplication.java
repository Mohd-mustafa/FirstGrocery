package com.example.FirstGrocery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.example.FirstGrocery")
  @EntityScan(basePackages = "com.example.FirstGrocery.Model")
 @EnableJpaRepositories(basePackages = "com.example.FirstGrocery.Repository")

public class FirstGroceryApplication {

	public static void main(String[] args) {
		SpringApplication.run(FirstGroceryApplication.class, args);
	}

}
