package com.manka.backend;

import com.manka.backend.model.Dish;
import com.manka.backend.model.DishIngredient;
import com.manka.backend.model.Ingredient;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.dto.request.IngredientUpdateRequest;
import com.manka.backend.exception.InvalidCatalogOperationException;
import com.manka.backend.mapper.CatalogMapper;
import com.manka.backend.repository.DishIngredientRepository;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.IngredientRepository;
import com.manka.backend.repository.ProteinCategoryRepository;
import com.manka.backend.service.impl.IngredientServiceImpl;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@Import({IngredientServiceImpl.class, CatalogMapper.class})
class CatalogPersistenceTests {

    private final ProteinCategoryRepository proteinCategoryRepository;
    private final IngredientRepository ingredientRepository;
    private final DishRepository dishRepository;
    private final DishIngredientRepository dishIngredientRepository;
    private final IngredientServiceImpl ingredientService;
    private final EntityManager entityManager;

    @Autowired
    CatalogPersistenceTests(
            ProteinCategoryRepository proteinCategoryRepository,
            IngredientRepository ingredientRepository,
            DishRepository dishRepository,
            DishIngredientRepository dishIngredientRepository,
            IngredientServiceImpl ingredientService,
            EntityManager entityManager
    ) {
        this.proteinCategoryRepository = proteinCategoryRepository;
        this.ingredientRepository = ingredientRepository;
        this.dishRepository = dishRepository;
        this.dishIngredientRepository = dishIngredientRepository;
        this.ingredientService = ingredientService;
        this.entityManager = entityManager;
    }

    @Test
    void persistsCatalogRelationships() {
        ProteinCategory category = proteinCategoryRepository.save(new ProteinCategory("Pollo"));
        Ingredient ingredient = ingredientRepository.save(new Ingredient("Arroz"));
        Dish dish = dishRepository.save(new Dish("Arroz con pollo", 45, category));

        DishIngredient dishIngredient = dishIngredientRepository.save(new DishIngredient(dish, ingredient));

        assertNotNull(category.getId());
        assertNotNull(ingredient.getId());
        assertNotNull(dish.getId());
        assertNotNull(dishIngredient.getId());
        assertEquals(category.getId(), dishRepository.findById(dish.getId()).orElseThrow().getProteinCategory().getId());
        assertEquals(ingredient.getId(), dishIngredientRepository.findById(dishIngredient.getId()).orElseThrow().getIngredient().getId());
        entityManager.flush();
        entityManager.clear();
        Dish detailed = dishRepository.findDetailById(dish.getId()).orElseThrow();
        assertEquals(1, detailed.getDishIngredients().size());
    }

    @Test
    void rejectsDuplicateIngredientInDish() {
        ProteinCategory category = proteinCategoryRepository.save(new ProteinCategory("Vegetariana"));
        Ingredient ingredient = ingredientRepository.save(new Ingredient("Papa"));
        Dish dish = dishRepository.save(new Dish("Papa dorada", 30, category));

        dishIngredientRepository.saveAndFlush(new DishIngredient(dish, ingredient));

        assertThrows(
                DataIntegrityViolationException.class,
                () -> dishIngredientRepository.saveAndFlush(new DishIngredient(dish, ingredient))
        );
    }

    @Test
    void rejectsIndirectIngredientCycle() {
        Ingredient root = ingredientRepository.save(new Ingredient("Root"));
        Ingredient child = new Ingredient("Child");
        child.setParentIngredient(root);
        child = ingredientRepository.save(child);
        Long childId = child.getId();

        assertThrows(
                InvalidCatalogOperationException.class,
                () -> ingredientService.update(root.getId(), new IngredientUpdateRequest("Root", childId))
        );
    }

    @Test
    void searchesDishesByNameTimeAndCategoryWithPagination() {
        ProteinCategory chicken = proteinCategoryRepository.save(new ProteinCategory("Pollo"));
        ProteinCategory fish = proteinCategoryRepository.save(new ProteinCategory("Pescado"));
        dishRepository.save(new Dish("Arroz con pollo", 45, chicken));
        dishRepository.save(new Dish("Arroz chaufa", 25, chicken));
        dishRepository.save(new Dish("Ceviche", 20, fish));

        var page = dishRepository.search("ARROZ", 30, chicken.getId(),
                PageRequest.of(0, 1, Sort.by("name")));
        assertEquals(1, page.getTotalElements());
        assertEquals("Arroz chaufa", page.getContent().getFirst().getName());
    }

    @Test
    void searchesIngredientsIgnoringCaseAndPaginates() {
        ingredientRepository.save(new Ingredient("Pollo"));
        ingredientRepository.save(new Ingredient("Pechuga de pollo"));
        ingredientRepository.save(new Ingredient("Arroz"));

        var page = ingredientRepository.search("POLLO", PageRequest.of(0, 1, Sort.by("name")));
        assertEquals(2, page.getTotalElements());
        assertEquals(1, page.getContent().size());
    }
}
