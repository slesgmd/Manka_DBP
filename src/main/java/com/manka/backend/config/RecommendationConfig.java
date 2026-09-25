package com.manka.backend.config;

import com.manka.backend.recommendation.RecommendationWeights;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RecommendationConfig {
    @Bean
    RecommendationWeights recommendationWeights(
            @Value("${manka.recommendation.weights.coverage}") double coverage,
            @Value("${manka.recommendation.weights.time}") double time,
            @Value("${manka.recommendation.weights.variety}") double variety,
            @Value("${manka.recommendation.weights.repetition}") double repetition,
            @Value("${manka.recommendation.weights.popularity}") double popularity
    ) {
        return new RecommendationWeights(coverage, time, variety, repetition, popularity);
    }
}
