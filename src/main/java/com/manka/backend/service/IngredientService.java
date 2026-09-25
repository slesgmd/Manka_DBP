package com.manka.backend.service;

import com.manka.backend.dto.request.IngredientCreateRequest;
import com.manka.backend.dto.request.IngredientUpdateRequest;
import com.manka.backend.dto.response.IngredientResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IngredientService {

    Page<IngredientResponse> search(String name, Pageable pageable);

    IngredientResponse findById(Long id);

    IngredientResponse create(IngredientCreateRequest request);

    IngredientResponse update(Long id, IngredientUpdateRequest request);

    void delete(Long id);
}
