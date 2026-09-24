package com.manka.backend;

import com.manka.backend.model.CookingHistory;
import com.manka.backend.model.Dish;
import com.manka.backend.model.Favorite;
import com.manka.backend.model.Ingredient;
import com.manka.backend.model.PantryItem;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.model.Role;
import com.manka.backend.model.RoleName;
import com.manka.backend.model.User;
import com.manka.backend.repository.CookingHistoryRepository;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.FavoriteRepository;
import com.manka.backend.repository.IngredientRepository;
import com.manka.backend.repository.PantryItemRepository;
import com.manka.backend.repository.ProteinCategoryRepository;
import com.manka.backend.repository.RoleRepository;
import com.manka.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class DomainPersistenceTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProteinCategoryRepository categoryRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private CookingHistoryRepository historyRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private PantryItemRepository pantryItemRepository;

    @Test
    void persistsUserRolesHistoryFavoritesAndPantry() {
        Role role = roleRepository.save(new Role(RoleName.USER));
        User user = new User("Domain User", "domain.user@manka.test", "encoded-password");
        user.getRoles().add(role);
        user = userRepository.save(user);

        ProteinCategory category = categoryRepository.save(new ProteinCategory("Domain protein"));
        Dish dish = dishRepository.save(new Dish("Domain dish", 25, category));
        Ingredient ingredient = ingredientRepository.save(new Ingredient("Domain ingredient"));

        CookingHistory history = historyRepository.save(new CookingHistory(user, dish, Instant.now()));
        Favorite favorite = favoriteRepository.save(new Favorite(user, dish));
        PantryItem pantryItem = pantryItemRepository.save(new PantryItem(user, ingredient));

        assertThat(historyRepository.findByIdAndUserId(history.getId(), user.getId())).isPresent();
        assertThat(favoriteRepository.findByUserIdAndDishId(user.getId(), dish.getId())).contains(favorite);
        assertThat(pantryItemRepository.findByUserIdAndIngredientId(user.getId(), ingredient.getId()))
                .contains(pantryItem);
        assertThat(userRepository.findWithRolesById(user.getId()).orElseThrow().getRoles())
                .extracting(Role::getName)
                .containsExactly(RoleName.USER);
    }
}
