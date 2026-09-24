package com.manka.backend.service.impl;

import com.manka.backend.dto.request.CookingHistoryCreateRequest;
import com.manka.backend.dto.response.CookingHistoryResponse;
import com.manka.backend.event.DishCookedEvent;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.mapper.AccountMapper;
import com.manka.backend.model.CookingHistory;
import com.manka.backend.model.Dish;
import com.manka.backend.model.User;
import com.manka.backend.repository.CookingHistoryRepository;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.service.CookingHistoryService;
import com.manka.backend.service.CurrentUserService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class CookingHistoryServiceImpl implements CookingHistoryService {

    private final CookingHistoryRepository repository;
    private final DishRepository dishRepository;
    private final CurrentUserService currentUserService;
    private final AccountMapper mapper;
    private final ApplicationEventPublisher eventPublisher;

    public CookingHistoryServiceImpl(
            CookingHistoryRepository repository,
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
    public List<CookingHistoryResponse> findCurrentUserHistory() {
        Long userId = currentUserService.getCurrentUserId();
        return repository.findAllByUserIdOrderByCookedAtDesc(userId).stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public CookingHistoryResponse create(CookingHistoryCreateRequest request) {
        User user = currentUserService.getCurrentUser();
        Dish dish = dishRepository.findById(request.dishId())
                .orElseThrow(() -> new ResourceNotFoundException("Dish " + request.dishId() + " was not found"));
        Instant cookedAt = request.cookedAt() == null ? Instant.now() : request.cookedAt();
        CookingHistory saved = repository.save(new CookingHistory(user, dish, cookedAt));
        eventPublisher.publishEvent(new DishCookedEvent(
                user.getId(), user.getName(), user.getEmail(), dish.getName(), cookedAt
        ));
        return mapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Long userId = currentUserService.getCurrentUserId();
        CookingHistory history = repository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cooking history " + id + " was not found"));
        repository.delete(history);
    }
}
