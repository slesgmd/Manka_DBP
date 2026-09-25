package com.manka.backend.dto.response;

public record RecommendationBreakdown(
        String scorer,
        double score,
        double weight,
        String explanation
) {
}
