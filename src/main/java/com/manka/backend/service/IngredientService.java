package com.manka.backend.service;

import com.manka.backend.dto.request.IngredientCreateRequest;
import com.manka.backend.dto.request.IngredientUpdateRequest;
import com.manka.backend.dto.response.IngredientResponse;

import java.util.List;

public interface IngredientService {

    List<IngredientResponse> findAll();

    IngredientResponse findById(Long id);

    IngredientResponse create(IngredientCreateRequest request);

    IngredientResponse update(Long id, IngredientUpdateRequest request);

    void delete(Long id);
}
