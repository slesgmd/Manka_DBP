package com.manka.backend.controller;

import com.manka.backend.dto.request.IngredientCreateRequest;
import com.manka.backend.dto.request.IngredientUpdateRequest;
import com.manka.backend.dto.response.IngredientResponse;
import com.manka.backend.service.IngredientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
@RestController
@RequestMapping("/api/v1/ingredients")
public class IngredientController {

    private final IngredientService service;

    public IngredientController(IngredientService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<IngredientResponse>> findAll(
            @RequestParam(required = false) String name,
            @PageableDefault(size = 20, sort = "name") Pageable pageable
    ) {
        return ResponseEntity.ok(service.search(name, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<IngredientResponse> create(@Valid @RequestBody IngredientCreateRequest request) {
        IngredientResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/ingredients/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredientResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody IngredientUpdateRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
