package com.manka.backend.service;

import com.manka.backend.dto.response.RecommendationResponse;
import com.manka.backend.model.Dish;
import com.manka.backend.model.Ingredient;
import com.manka.backend.recommendation.RecommendationContext;
import com.manka.backend.recommendation.RecommendationEngine;
import com.manka.backend.repository.CookingHistoryRepository;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.FavoriteRepository;
import com.manka.backend.repository.PantryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecommendationService {
    private final CurrentUserService currentUserService;
    private final PantryItemRepository pantryRepository;
    private final DishRepository dishRepository;
    private final CookingHistoryRepository historyRepository;
    private final FavoriteRepository favoriteRepository;
    private final RecommendationEngine engine;

    public RecommendationService(CurrentUserService currentUserService, PantryItemRepository pantryRepository,
                                 DishRepository dishRepository, CookingHistoryRepository historyRepository,
                                 FavoriteRepository favoriteRepository, RecommendationEngine engine) {
        this.currentUserService = currentUserService;
        this.pantryRepository = pantryRepository;
        this.dishRepository = dishRepository;
        this.historyRepository = historyRepository;
        this.favoriteRepository = favoriteRepository;
        this.engine = engine;
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> recommend(int availableMinutes, int limit) {
        Long userId = currentUserService.getCurrentUserId();
        List<Ingredient> pantry = pantryRepository.findAllByUserIdOrderByAddedAtDesc(userId).stream()
                .map(item -> item.getIngredient()).toList();
        if (pantry.isEmpty()) {
            return List.of();
        }
        List<Dish> dishes = dishRepository.findAllForRecommendations();
        Map<Long, Long> popularity = popularityCounts();
        long max = dishes.stream().mapToLong(dish -> popularity.getOrDefault(dish.getId(), 0L)).max().orElse(0);
        RecommendationContext context = new RecommendationContext(pantry, availableMinutes,
                historyRepository.findAllByUserIdOrderByCookedAtDesc(userId), popularity, max, Instant.now());
        return engine.rank(dishes, context, limit);
    }

    private Map<Long, Long> popularityCounts() {
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : historyRepository.countByDish()) {
            counts.merge((Long) row[0], (Long) row[1], Long::sum);
        }
        for (Object[] row : favoriteRepository.countByDish()) {
            counts.merge((Long) row[0], (Long) row[1], Long::sum);
        }
        return counts;
    }
}
