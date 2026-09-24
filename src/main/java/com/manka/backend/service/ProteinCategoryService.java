package com.manka.backend.service;

import com.manka.backend.dto.request.ProteinCategoryCreateRequest;
import com.manka.backend.dto.request.ProteinCategoryUpdateRequest;
import com.manka.backend.dto.response.ProteinCategoryResponse;

import java.util.List;

public interface ProteinCategoryService {

    List<ProteinCategoryResponse> findAll();

    ProteinCategoryResponse findById(Long id);

    ProteinCategoryResponse create(ProteinCategoryCreateRequest request);

    ProteinCategoryResponse update(Long id, ProteinCategoryUpdateRequest request);

    void delete(Long id);
}
