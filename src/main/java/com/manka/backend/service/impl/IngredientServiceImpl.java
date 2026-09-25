package com.manka.backend.service.impl;

import com.manka.backend.dto.request.IngredientCreateRequest;
import com.manka.backend.dto.request.IngredientUpdateRequest;
import com.manka.backend.dto.response.IngredientResponse;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.exception.InvalidCatalogOperationException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.mapper.CatalogMapper;
import com.manka.backend.model.Ingredient;
import com.manka.backend.repository.IngredientRepository;
import com.manka.backend.repository.DishIngredientRepository;
import com.manka.backend.repository.PantryItemRepository;
import com.manka.backend.service.IngredientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository repository;
    private final DishIngredientRepository dishIngredientRepository;
    private final PantryItemRepository pantryItemRepository;
    private final CatalogMapper mapper;

    public IngredientServiceImpl(IngredientRepository repository, DishIngredientRepository dishIngredientRepository,
                                 PantryItemRepository pantryItemRepository, CatalogMapper mapper) {
        this.repository = repository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.pantryItemRepository = pantryItemRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IngredientResponse> search(String name, Pageable pageable) {
        String filter = name == null || name.isBlank() ? null : name.trim();
        return repository.search(filter, pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientResponse findById(Long id) {
        return mapper.toResponse(getIngredient(id));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public IngredientResponse create(IngredientCreateRequest request) {
        String name = normalize(request.name());
        ensureUnique(name, null);
        Ingredient parent = findParent(request.parentIngredientId(), null);
        Ingredient ingredient = new Ingredient(name);
        ingredient.setParentIngredient(parent);
        return mapper.toResponse(repository.save(ingredient));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public IngredientResponse update(Long id, IngredientUpdateRequest request) {
        Ingredient ingredient = getIngredient(id);
        String name = normalize(request.name());
        ensureUnique(name, id);
        ingredient.setName(name);
        ingredient.setParentIngredient(findParent(request.parentIngredientId(), id));
        return mapper.toResponse(ingredient);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void delete(Long id) {
        Ingredient ingredient = getIngredient(id);
        if (dishIngredientRepository.existsByIngredientId(id) || pantryItemRepository.existsByIngredientId(id)
                || repository.existsByParentIngredientId(id)) {
            throw new DuplicateResourceException("Ingredient " + id + " is used by dishes, pantry items or variants");
        }
        repository.delete(ingredient);
    }

    private Ingredient findParent(Long parentId, Long currentId) {
        if (parentId == null) {
            return null;
        }
        Ingredient parent = getIngredient(parentId);
        Set<Long> visited = new HashSet<>();
        for (Ingredient ancestor = parent; ancestor != null; ancestor = ancestor.getParentIngredient()) {
            if (!visited.add(ancestor.getId()) || ancestor.getId().equals(currentId)) {
                throw new InvalidCatalogOperationException("Ingredient hierarchy contains a cycle");
            }
        }
        return parent;
    }

    private Ingredient getIngredient(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient " + id + " was not found"));
    }

    private void ensureUnique(String name, Long id) {
        boolean exists = id == null
                ? repository.existsByNameIgnoreCase(name)
                : repository.existsByNameIgnoreCaseAndIdNot(name, id);
        if (exists) {
            throw new DuplicateResourceException("Ingredient name is already in use");
        }
    }

    private String normalize(String name) {
        return name.trim();
    }
}
