package com.manka.backend.service.impl;

import com.manka.backend.dto.request.FavoriteCreateRequest;
import com.manka.backend.dto.response.FavoriteResponse;
import com.manka.backend.event.FavoriteAddedEvent;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.mapper.AccountMapper;
import com.manka.backend.model.Dish;
import com.manka.backend.model.Favorite;
import com.manka.backend.model.User;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.FavoriteRepository;
import com.manka.backend.service.CurrentUserService;
import com.manka.backend.service.FavoriteService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository repository;
    private final DishRepository dishRepository;
    private final CurrentUserService currentUserService;
    private final AccountMapper mapper;
    private final ApplicationEventPublisher eventPublisher;

    public FavoriteServiceImpl(
            FavoriteRepository repository,
            DishRepository dishRepository,
            CurrentUserService currentUserService,
            AccountMapper mapper,
            ApplicationEventPublisher eventPublisher
    ) {
        this.repository = repository;
        this.dishRepository = dishRepository;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FavoriteResponse> findCurrentUserFavorites() {
        Long userId = currentUserService.getCurrentUserId();
        return repository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public FavoriteResponse create(FavoriteCreateRequest request) {
        User user = currentUserService.getCurrentUser();
        if (repository.existsByUserIdAndDishId(user.getId(), request.dishId())) {
            throw new DuplicateResourceException("Dish is already a favorite");
        }
        Dish dish = dishRepository.findById(request.dishId())
                .orElseThrow(() -> new ResourceNotFoundException("Dish " + request.dishId() + " was not found"));
        Favorite saved = repository.save(new Favorite(user, dish));
        eventPublisher.publishEvent(new FavoriteAddedEvent(user.getId(), dish.getId(), dish.getName()));
        return mapper.toResponse(saved);
    }

    @Override
    public void deleteByDishId(Long dishId) {
        Long userId = currentUserService.getCurrentUserId();
        Favorite favorite = repository.findByUserIdAndDishId(userId, dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite for dish " + dishId + " was not found"));
        repository.delete(favorite);
    }
}
