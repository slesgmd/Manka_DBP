package com.manka.backend.mapper;

import com.manka.backend.dto.response.CookingHistoryResponse;
import com.manka.backend.dto.response.FavoriteResponse;
import com.manka.backend.dto.response.PantryItemResponse;
import com.manka.backend.dto.response.UserResponse;
import com.manka.backend.model.CookingHistory;
import com.manka.backend.model.Favorite;
import com.manka.backend.model.PantryItem;
import com.manka.backend.model.RoleName;
import com.manka.backend.model.User;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AccountMapper {

    public UserResponse toResponse(User user) {
        Set<RoleName> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toUnmodifiableSet());
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roles,
                user.isEnabled(),
                user.getCreatedAt()
        );
    }

    public CookingHistoryResponse toResponse(CookingHistory history) {
        return new CookingHistoryResponse(
                history.getId(),
                history.getDish().getId(),
                history.getDish().getName(),
                history.getCookedAt()
        );
    }

    public FavoriteResponse toResponse(Favorite favorite) {
        return new FavoriteResponse(
                favorite.getId(),
                favorite.getDish().getId(),
                favorite.getDish().getName(),
                favorite.getDish().getTotalTimeMinutes(),
                favorite.getCreatedAt()
        );
    }

    public PantryItemResponse toResponse(PantryItem pantryItem) {
        return new PantryItemResponse(
                pantryItem.getId(),
                pantryItem.getIngredient().getId(),
                pantryItem.getIngredient().getName(),
                pantryItem.getAddedAt()
        );
    }
}
