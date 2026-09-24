package com.manka.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
        name = "ingredients",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_ingredients_name",
                columnNames = "name"
        ),
        indexes = @Index(name = "idx_ingredients_parent_id", columnList = "parent_id")
)
@Getter
@Setter
@NoArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Ingredient parentIngredient;

    @OneToMany(mappedBy = "parentIngredient", fetch = FetchType.LAZY)
    private List<Ingredient> variants = new ArrayList<>();

    @OneToMany(mappedBy = "ingredient", fetch = FetchType.LAZY)
    private List<DishIngredient> dishIngredients = new ArrayList<>();

    @OneToMany(mappedBy = "ingredient", fetch = FetchType.LAZY)
    private List<PantryItem> pantryItems = new ArrayList<>();

    public Ingredient(String name) {
        this.name = name;
    }
}
