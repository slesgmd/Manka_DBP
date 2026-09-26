package com.manka.backend.controller;

import com.manka.backend.dto.request.DishCreateRequest;
import com.manka.backend.dto.request.DishUpdateRequest;
import com.manka.backend.dto.response.DishDetailResponse;
import com.manka.backend.dto.response.DishResponse;
import com.manka.backend.service.DishService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@Validated
@RequestMapping("/api/v1/dishes")
public class DishController {

    private final DishService service;

    public DishController(DishService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<DishResponse>> findAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) @Min(1) Integer maxPrepMinutes,
            @RequestParam(required = false) Long proteinCategoryId,
            @PageableDefault(size = 20, sort = "name") Pageable pageable
    ) {
        return ResponseEntity.ok(service.search(name, maxPrepMinutes, proteinCategoryId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DishDetailResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<DishDetailResponse> create(@Valid @RequestBody DishCreateRequest request) {
        DishDetailResponse response = service.create(request);
        return ResponseEntity.created(URI.create("/api/v1/dishes/" + response.id())).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishDetailResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody DishUpdateRequest request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
