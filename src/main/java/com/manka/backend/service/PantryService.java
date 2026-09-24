package com.manka.backend.service;

import com.manka.backend.dto.request.PantryItemCreateRequest;
import com.manka.backend.dto.response.PantryItemResponse;

import java.util.List;

public interface PantryService {

    List<PantryItemResponse> findCurrentUserPantry();

    PantryItemResponse create(PantryItemCreateRequest request);

    void deleteByIngredientId(Long ingredientId);
}
