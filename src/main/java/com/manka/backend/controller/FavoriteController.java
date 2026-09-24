package com.manka.backend.controller;

import com.manka.backend.dto.request.FavoriteCreateRequest;
import com.manka.backend.dto.response.FavoriteResponse;
import com.manka.backend.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    private final FavoriteService service;

    public FavoriteController(FavoriteService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponse>> findAll() {
        return ResponseEntity.ok(service.findCurrentUserFavorites());
    }

    @PostMapping
    public ResponseEntity<FavoriteResponse> create(@Valid @RequestBody FavoriteCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @DeleteMapping("/{dishId}")
    public ResponseEntity<Void> delete(@PathVariable Long dishId) {
        service.deleteByDishId(dishId);
        return ResponseEntity.noContent().build();
    }
}
