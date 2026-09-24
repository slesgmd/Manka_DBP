package com.manka.backend.controller;

import com.manka.backend.dto.request.CookingHistoryCreateRequest;
import com.manka.backend.dto.response.CookingHistoryResponse;
import com.manka.backend.service.CookingHistoryService;
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
@RequestMapping("/api/v1/cooking-history")
public class CookingHistoryController {

    private final CookingHistoryService service;

    public CookingHistoryController(CookingHistoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CookingHistoryResponse>> findAll() {
        return ResponseEntity.ok(service.findCurrentUserHistory());
    }

    @PostMapping
    public ResponseEntity<CookingHistoryResponse> create(
            @Valid @RequestBody CookingHistoryCreateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
