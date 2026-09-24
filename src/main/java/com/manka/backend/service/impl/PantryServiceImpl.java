package com.manka.backend.service.impl;

import com.manka.backend.dto.request.PantryItemCreateRequest;
import com.manka.backend.dto.response.PantryItemResponse;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.mapper.AccountMapper;
import com.manka.backend.model.Ingredient;
import com.manka.backend.model.PantryItem;
import com.manka.backend.model.User;
import com.manka.backend.repository.IngredientRepository;
import com.manka.backend.repository.PantryItemRepository;
import com.manka.backend.service.CurrentUserService;
import com.manka.backend.service.PantryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PantryServiceImpl implements PantryService {

    private final PantryItemRepository repository;
    private final IngredientRepository ingredientRepository;
    private final CurrentUserService currentUserService;
    private final AccountMapper mapper;

    public PantryServiceImpl(
            PantryItemRepository repository,
            IngredientRepository ingredientRepository,
            CurrentUserService currentUserService,
            AccountMapper mapper
    ) {
        this.repository = repository;
        this.ingredientRepository = ingredientRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PantryItemResponse> findCurrentUserPantry() {
        Long userId = currentUserService.getCurrentUserId();
        return repository.findAllByUserIdOrderByAddedAtDesc(userId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public PantryItemResponse create(PantryItemCreateRequest request) {
        User user = currentUserService.getCurrentUser();
        if (repository.existsByUserIdAndIngredientId(user.getId(), request.ingredientId())) {
            throw new DuplicateResourceException("Ingredient is already in the pantry");
        }
        Ingredient ingredient = ingredientRepository.findById(request.ingredientId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ingredient " + request.ingredientId() + " was not found"
                ));
        return mapper.toResponse(repository.save(new PantryItem(user, ingredient)));
    }

    @Override
    public void deleteByIngredientId(Long ingredientId) {
        Long userId = currentUserService.getCurrentUserId();
        PantryItem pantryItem = repository.findByUserIdAndIngredientId(userId, ingredientId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pantry item for ingredient " + ingredientId + " was not found"
                ));
        repository.delete(pantryItem);
    }
}
