package com.manka.backend.service.impl;

import com.manka.backend.dto.request.ProteinCategoryCreateRequest;
import com.manka.backend.dto.request.ProteinCategoryUpdateRequest;
import com.manka.backend.dto.response.ProteinCategoryResponse;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.mapper.CatalogMapper;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.repository.ProteinCategoryRepository;
import com.manka.backend.service.ProteinCategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@Service
@Transactional
public class ProteinCategoryServiceImpl implements ProteinCategoryService {

    private final ProteinCategoryRepository repository;
    private final CatalogMapper mapper;

    public ProteinCategoryServiceImpl(ProteinCategoryRepository repository, CatalogMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProteinCategoryResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProteinCategoryResponse findById(Long id) {
        return mapper.toResponse(getCategory(id));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ProteinCategoryResponse create(ProteinCategoryCreateRequest request) {
        String name = normalize(request.name());
        ensureUnique(name, null);
        return mapper.toResponse(repository.save(new ProteinCategory(name)));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ProteinCategoryResponse update(Long id, ProteinCategoryUpdateRequest request) {
        ProteinCategory category = getCategory(id);
        String name = normalize(request.name());
        ensureUnique(name, id);
        category.setName(name);
        return mapper.toResponse(category);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void delete(Long id) {
        repository.delete(getCategory(id));
    }

    private ProteinCategory getCategory(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Protein category " + id + " was not found"));
    }

    private void ensureUnique(String name, Long id) {
        boolean exists = id == null
                ? repository.existsByNameIgnoreCase(name)
                : repository.existsByNameIgnoreCaseAndIdNot(name, id);
        if (exists) {
            throw new DuplicateResourceException("Protein category name is already in use");
        }
    }

    private String normalize(String name) {
        return name.trim();
    }
}
