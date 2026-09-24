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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
        name = "pantry_items",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_pantry_items_user_ingredient",
                columnNames = {"user_id", "ingredient_id"}
        ),
        indexes = {
                @Index(name = "idx_pantry_items_user_id", columnList = "user_id"),
                @Index(name = "idx_pantry_items_ingredient_id", columnList = "ingredient_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class PantryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Column(name = "added_at", nullable = false, updatable = false)
    private Instant addedAt = Instant.now();

    public PantryItem(User user, Ingredient ingredient) {
        this.user = user;
        this.ingredient = ingredient;
    }
}
