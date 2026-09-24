package com.manka.backend.repository;

import com.manka.backend.model.ProteinCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProteinCategoryRepository extends JpaRepository<ProteinCategory, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
