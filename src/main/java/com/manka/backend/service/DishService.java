package com.manka.backend.service;

import com.manka.backend.dto.request.DishCreateRequest;
import com.manka.backend.dto.request.DishUpdateRequest;
import com.manka.backend.dto.response.DishDetailResponse;
import com.manka.backend.dto.response.DishResponse;

import java.util.List;

public interface DishService {

    List<DishResponse> findAll();

    DishDetailResponse findById(Long id);

    DishDetailResponse create(DishCreateRequest request);

    DishDetailResponse update(Long id, DishUpdateRequest request);

    void delete(Long id);
}
