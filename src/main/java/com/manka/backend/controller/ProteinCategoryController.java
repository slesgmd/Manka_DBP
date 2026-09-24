package com.manka.backend.controller;

import com.manka.backend.dto.request.ProteinCategoryCreateRequest;
import com.manka.backend.dto.request.ProteinCategoryUpdateRequest;
import com.manka.backend.dto.response.ProteinCategoryResponse;
import com.manka.backend.service.ProteinCategoryService;
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
@RequestMapping("/api/v1/protein-categories")
public class ProteinCategoryController {

    private final ProteinCategoryService service;

    public ProteinCategoryController(ProteinCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ProteinCategoryResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProteinCategoryResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProteinCategoryResponse> create(@Valid @RequestBody ProteinCategoryCreateRequest request) {
        ProteinCategoryResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/protein-categories/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProteinCategoryResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ProteinCategoryUpdateRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
