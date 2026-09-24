package com.manka.backend.controller;

import com.manka.backend.dto.request.PantryItemCreateRequest;
import com.manka.backend.dto.response.PantryItemResponse;
import com.manka.backend.service.PantryService;
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
@RequestMapping("/api/v1/pantry-items")
public class PantryController {

    private final PantryService service;

    public PantryController(PantryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PantryItemResponse>> findAll() {
        return ResponseEntity.ok(service.findCurrentUserPantry());
    }

    @PostMapping
    public ResponseEntity<PantryItemResponse> create(@Valid @RequestBody PantryItemCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @DeleteMapping("/{ingredientId}")
    public ResponseEntity<Void> delete(@PathVariable Long ingredientId) {
        service.deleteByIngredientId(ingredientId);
        return ResponseEntity.noContent().build();
    }
}
