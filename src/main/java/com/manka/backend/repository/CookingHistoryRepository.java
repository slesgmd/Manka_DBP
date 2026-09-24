package com.manka.backend.repository;

import com.manka.backend.model.CookingHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CookingHistoryRepository extends JpaRepository<CookingHistory, Long> {

    @EntityGraph(attributePaths = "dish")
    List<CookingHistory> findAllByUserIdOrderByCookedAtDesc(Long userId);

    Optional<CookingHistory> findByIdAndUserId(Long id, Long userId);
}
