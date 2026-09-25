package com.manka.backend.service.impl;

import com.manka.backend.dto.request.DishCreateRequest;
import com.manka.backend.dto.request.DishUpdateRequest;
import com.manka.backend.dto.response.DishDetailResponse;
import com.manka.backend.dto.response.DishResponse;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.mapper.CatalogMapper;
import com.manka.backend.model.Dish;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.ProteinCategoryRepository;
import com.manka.backend.service.DishService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
public class DishServiceImpl implements DishService {

    private final DishRepository dishRepository;
    private final ProteinCategoryRepository categoryRepository;
    private final CatalogMapper mapper;

    public DishServiceImpl(
            DishRepository dishRepository,
            ProteinCategoryRepository categoryRepository,
            CatalogMapper mapper
    ) {
        this.dishRepository = dishRepository;
        this.categoryRepository = categoryRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DishResponse> search(String name, Integer maxPrepMinutes, Long proteinCategoryId, Pageable pageable) {
        String filter = name == null || name.isBlank() ? null : name.trim();
        return dishRepository.search(filter, maxPrepMinutes, proteinCategoryId, pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public DishDetailResponse findById(Long id) {
        Dish dish = dishRepository.findDetailById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish " + id + " was not found"));
        return mapper.toDetailResponse(dish);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public DishDetailResponse create(DishCreateRequest request) {
        String name = normalize(request.name());
        ensureUnique(name, null);
        ProteinCategory category = getCategory(request.proteinCategoryId());
        Dish dish = new Dish(name, request.totalTimeMinutes(), category);
        return mapper.toDetailResponse(dishRepository.save(dish));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public DishDetailResponse update(Long id, DishUpdateRequest request) {
        Dish dish = getDish(id);
        String name = normalize(request.name());
        ensureUnique(name, id);
        dish.setName(name);
        dish.setTotalTimeMinutes(request.totalTimeMinutes());
        dish.setProteinCategory(getCategory(request.proteinCategoryId()));
        return mapper.toDetailResponse(dish);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void delete(Long id) {
        dishRepository.delete(getDish(id));
    }

    private Dish getDish(Long id) {
        return dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish " + id + " was not found"));
    }

    private ProteinCategory getCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Protein category " + id + " was not found"));
    }

    private void ensureUnique(String name, Long id) {
        boolean exists = id == null
                ? dishRepository.existsByNameIgnoreCase(name)
                : dishRepository.existsByNameIgnoreCaseAndIdNot(name, id);
        if (exists) {
            throw new DuplicateResourceException("Dish name is already in use");
        }
    }

    private String normalize(String name) {
        return name.trim();
    }
}
