package com.manka.backend.controller;

import com.manka.backend.dto.response.RecommendationResponse;
import com.manka.backend.service.RecommendationService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {
    private final RecommendationService service;

    public RecommendationController(RecommendationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<RecommendationResponse>> recommend(
            @RequestParam @Min(1) @Max(600) int availableMinutes,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int limit
    ) {
        return ResponseEntity.ok(service.recommend(availableMinutes, limit));
    }
}
