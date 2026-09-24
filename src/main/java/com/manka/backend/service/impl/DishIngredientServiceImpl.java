package com.manka.backend.service.impl;

import com.manka.backend.dto.request.DishIngredientCreateRequest;
import com.manka.backend.dto.request.DishIngredientUpdateRequest;
import com.manka.backend.dto.response.DishIngredientResponse;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.mapper.CatalogMapper;
import com.manka.backend.model.Dish;
import com.manka.backend.model.DishIngredient;
import com.manka.backend.model.Ingredient;
import com.manka.backend.repository.DishIngredientRepository;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.IngredientRepository;
import com.manka.backend.service.DishIngredientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@Service
@Transactional
public class DishIngredientServiceImpl implements DishIngredientService {

    private final DishIngredientRepository repository;
    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;
    private final CatalogMapper mapper;

    public DishIngredientServiceImpl(
            DishIngredientRepository repository,
            DishRepository dishRepository,
            IngredientRepository ingredientRepository,
            CatalogMapper mapper
    ) {
        this.repository = repository;
        this.dishRepository = dishRepository;
        this.ingredientRepository = ingredientRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DishIngredientResponse> findAll() {
        return repository.findAll().stream().map(mapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DishIngredientResponse findById(Long id) {
        return mapper.toResponse(getDishIngredient(id));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public DishIngredientResponse create(DishIngredientCreateRequest request) {
        ensurePairIsUnique(request.dishId(), request.ingredientId(), null);
        Dish dish = getDish(request.dishId());
        Ingredient ingredient = getIngredient(request.ingredientId());
        return mapper.toResponse(repository.save(new DishIngredient(dish, ingredient)));
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public DishIngredientResponse update(Long id, DishIngredientUpdateRequest request) {
        DishIngredient dishIngredient = getDishIngredient(id);
        ensurePairIsUnique(request.dishId(), request.ingredientId(), id);
        dishIngredient.setDish(getDish(request.dishId()));
        dishIngredient.setIngredient(getIngredient(request.ingredientId()));
        return mapper.toResponse(dishIngredient);
    }

    @Override
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public void delete(Long id) {
        repository.delete(getDishIngredient(id));
    }

    private DishIngredient getDishIngredient(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish ingredient " + id + " was not found"));
    }

    private Dish getDish(Long id) {
        return dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish " + id + " was not found"));
    }

    private Ingredient getIngredient(Long id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient " + id + " was not found"));
    }

    private void ensurePairIsUnique(Long dishId, Long ingredientId, Long currentId) {
        boolean exists = currentId == null
                ? repository.existsByDishIdAndIngredientId(dishId, ingredientId)
                : repository.existsByDishIdAndIngredientIdAndIdNot(dishId, ingredientId, currentId);
        if (exists) {
            throw new DuplicateResourceException("The ingredient is already associated with this dish");
        }
    }
}
