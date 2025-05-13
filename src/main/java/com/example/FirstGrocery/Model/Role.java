package com.example.FirstGrocery.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Role {
    @Id
    private String id;
    private String  nameRole;
    private String age;

    public Role(String nameRole) {
        this.nameRole = nameRole;
    }

}
