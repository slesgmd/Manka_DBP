package com.manka.backend.controller;

import com.manka.backend.dto.request.DishIngredientCreateRequest;
import com.manka.backend.dto.request.DishIngredientUpdateRequest;
import com.manka.backend.dto.response.DishIngredientResponse;
import com.manka.backend.service.DishIngredientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dish-ingredients")
public class DishIngredientController {

    private final DishIngredientService service;

    public DishIngredientController(DishIngredientService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DishIngredientResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DishIngredientResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<DishIngredientResponse> create(
            @Valid @RequestBody DishIngredientCreateRequest request
    ) {
        DishIngredientResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/dish-ingredients/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishIngredientResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody DishIngredientUpdateRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
