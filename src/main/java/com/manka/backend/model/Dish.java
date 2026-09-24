package com.manka.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
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
import org.hibernate.annotations.Check;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "dishes",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_dishes_name",
                columnNames = "name"
        ),
        indexes = @Index(name = "idx_dishes_protein_category_id", columnList = "protein_category_id")
)
@Check(constraints = "total_time_minutes >= 1")
@Getter
@Setter
@NoArgsConstructor
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(name = "total_time_minutes", nullable = false)
    private Integer totalTimeMinutes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "protein_category_id", nullable = false)
    private ProteinCategory proteinCategory;

    @OneToMany(mappedBy = "dish", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishIngredient> dishIngredients = new ArrayList<>();

    @OneToMany(mappedBy = "dish", fetch = FetchType.LAZY)
    private List<CookingHistory> cookingHistory = new ArrayList<>();

    @OneToMany(mappedBy = "dish", fetch = FetchType.LAZY)
    private List<Favorite> favorites = new ArrayList<>();

    public Dish(String name, Integer totalTimeMinutes, ProteinCategory proteinCategory) {
        this.name = name;
        this.totalTimeMinutes = totalTimeMinutes;
        this.proteinCategory = proteinCategory;
    }
}
