package com.manka.backend.recommendation;

public record RecommendationWeights(
        double coverage,
        double time,
        double variety,
        double repetition,
        double popularity
) {
    public RecommendationWeights {
        double sum = coverage + time + variety + repetition + popularity;
        if (coverage < 0 || time < 0 || variety < 0 || repetition < 0 || popularity < 0
                || Math.abs(sum - 1.0) > 0.000001) {
            throw new IllegalArgumentException("Recommendation weights must be non-negative and sum to 1.0; actual sum: " + sum);
        }
    }

    public double forScorer(String name) {
        return switch (name) {
            case "coverage" -> coverage;
            case "time" -> time;
            case "variety" -> variety;
            case "repetition" -> repetition;
            case "popularity" -> popularity;
            default -> throw new IllegalArgumentException("Unknown scorer: " + name);
        };
    }
}
