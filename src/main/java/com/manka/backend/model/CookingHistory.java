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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(
        name = "cooking_history",
        indexes = {
                @Index(name = "idx_cooking_history_user_id", columnList = "user_id"),
                @Index(name = "idx_cooking_history_dish_id", columnList = "dish_id"),
                @Index(name = "idx_cooking_history_cooked_at", columnList = "cooked_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class CookingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @Column(name = "cooked_at", nullable = false)
    private Instant cookedAt;

    public CookingHistory(User user, Dish dish, Instant cookedAt) {
        this.user = user;
        this.dish = dish;
        this.cookedAt = cookedAt;
    }
}
