package com.manka.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "protein_categories",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_protein_categories_name",
                columnNames = "name"
        )
)
@Getter
@Setter
@NoArgsConstructor
public class ProteinCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "proteinCategory", fetch = FetchType.LAZY)
    private List<Dish> dishes = new ArrayList<>();

    public ProteinCategory(String name) {
        this.name = name;
    }
}
