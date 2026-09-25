package com.manka.backend.service;

import com.manka.backend.dto.request.DishCreateRequest;
import com.manka.backend.dto.request.DishUpdateRequest;
import com.manka.backend.dto.response.DishDetailResponse;
import com.manka.backend.dto.response.DishResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DishService {

    Page<DishResponse> search(String name, Integer maxPrepMinutes, Long proteinCategoryId, Pageable pageable);

    DishDetailResponse findById(Long id);

    DishDetailResponse create(DishCreateRequest request);

    DishDetailResponse update(Long id, DishUpdateRequest request);

    void delete(Long id);
}
