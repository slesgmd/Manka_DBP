package com.manka.backend.service;

import com.manka.backend.dto.request.FavoriteCreateRequest;
import com.manka.backend.dto.response.FavoriteResponse;

import java.util.List;

public interface FavoriteService {

    List<FavoriteResponse> findCurrentUserFavorites();

    FavoriteResponse create(FavoriteCreateRequest request);

    void deleteByDishId(Long dishId);
}
