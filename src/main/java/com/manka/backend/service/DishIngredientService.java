package com.manka.backend.service;

import com.manka.backend.dto.request.DishIngredientCreateRequest;
import com.manka.backend.dto.request.DishIngredientUpdateRequest;
import com.manka.backend.dto.response.DishIngredientResponse;

import java.util.List;

public interface DishIngredientService {

    List<DishIngredientResponse> findAll();

    DishIngredientResponse findById(Long id);

    DishIngredientResponse create(DishIngredientCreateRequest request);

    DishIngredientResponse update(Long id, DishIngredientUpdateRequest request);

    void delete(Long id);
}
