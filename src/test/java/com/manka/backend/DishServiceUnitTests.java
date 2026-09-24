package com.manka.backend;

import com.manka.backend.dto.request.DishCreateRequest;
import com.manka.backend.dto.response.DishDetailResponse;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.mapper.CatalogMapper;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.ProteinCategoryRepository;
import com.manka.backend.service.impl.DishServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DishServiceUnitTests {

    @Mock
    private DishRepository dishRepository;

    @Mock
    private ProteinCategoryRepository categoryRepository;

    @Mock
    private CatalogMapper mapper;

    @InjectMocks
    private DishServiceImpl service;

    @Test
    void createsDishUsingExistingCategory() {
        ProteinCategory category = new ProteinCategory("Pollo");
        category.setId(1L);
        when(dishRepository.existsByNameIgnoreCase("Ají de gallina")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(java.util.Optional.of(category));
        when(mapper.toDetailResponse(ArgumentMatchers.any())).thenReturn(
                new DishDetailResponse(10L, "Ají de gallina", 50, 1L, "Pollo", java.util.List.of())
        );
        when(dishRepository.save(ArgumentMatchers.any())).thenAnswer(invocation -> {
            var dish = invocation.getArgument(0, com.manka.backend.model.Dish.class);
            dish.setId(10L);
            return dish;
        });

        DishDetailResponse response = service.create(
                new DishCreateRequest("Ají de gallina", 50, 1L)
        );

        assertEquals(10L, response.id());
        assertEquals("Ají de gallina", response.name());
        verify(categoryRepository).findById(1L);
    }

    @Test
    void rejectsDuplicateDishName() {
        when(dishRepository.existsByNameIgnoreCase("Lomo saltado")).thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> service.create(new DishCreateRequest("Lomo saltado", 35, 1L))
        );
    }
}
