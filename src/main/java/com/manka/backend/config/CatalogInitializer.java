package com.manka.backend.config;

import com.manka.backend.model.Dish;
import com.manka.backend.model.DishIngredient;
import com.manka.backend.model.Ingredient;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.model.Role;
import com.manka.backend.model.RoleName;
import com.manka.backend.model.User;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.IngredientRepository;
import com.manka.backend.repository.ProteinCategoryRepository;
import com.manka.backend.repository.RoleRepository;
import com.manka.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
@Order(2)
public class CatalogInitializer implements ApplicationRunner {
    private final ProteinCategoryRepository categoryRepository;
    private final IngredientRepository ingredientRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean enabled;
    private final String adminEmail;
    private final String adminPassword;

    public CatalogInitializer(ProteinCategoryRepository categoryRepository, IngredientRepository ingredientRepository,
                              DishRepository dishRepository, UserRepository userRepository, RoleRepository roleRepository,
                              PasswordEncoder passwordEncoder, @Value("${manka.seed.enabled:true}") boolean enabled,
                              @Value("${ADMIN_EMAIL:}") String adminEmail,
                              @Value("${ADMIN_PASSWORD:}") String adminPassword) {
        this.categoryRepository = categoryRepository;
        this.ingredientRepository = ingredientRepository;
        this.dishRepository = dishRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.enabled = enabled;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (enabled && categoryRepository.count() == 0 && ingredientRepository.count() == 0
                && dishRepository.count() == 0) {
            seedCatalog();
        }
        createAdminIfConfigured();
    }

    private void seedCatalog() {
        Map<String, ProteinCategory> categories = new HashMap<>();
        for (String name : new String[]{"Pollo", "Res", "Pescado", "Cerdo", "Vegetariano"}) {
            categories.put(name, categoryRepository.save(new ProteinCategory(name)));
        }
        Map<String, Ingredient> ingredients = seedIngredients();
        addDish(categories, ingredients, "Arroz chaufa de pollo", 25, "Pollo", "arroz", "pechuga de pollo", "huevo", "cebolla", "sillao");
        addDish(categories, ingredients, "Lomo saltado", 35, "Res", "lomo de res", "cebolla roja", "tomate", "papa", "arroz");
        addDish(categories, ingredients, "Ají de gallina", 50, "Pollo", "pechuga de pollo", "ají amarillo", "leche evaporada", "queso fresco", "papa");
        addDish(categories, ingredients, "Arroz con pollo", 45, "Pollo", "pierna de pollo", "arroz", "culantro", "zanahoria", "choclo");
        addDish(categories, ingredients, "Tallarines verdes", 30, "Vegetariano", "fideos", "albahaca", "espinaca", "leche evaporada", "queso fresco");
        addDish(categories, ingredients, "Ceviche", 25, "Pescado", "pescado", "limón", "cebolla roja", "ají amarillo", "choclo");
        addDish(categories, ingredients, "Papa a la huancaína", 30, "Vegetariano", "papa", "ají amarillo", "queso fresco", "leche evaporada", "huevo");
        addDish(categories, ingredients, "Tacu tacu", 35, "Vegetariano", "frejoles", "arroz", "cebolla", "ajo", "ají panca");
        addDish(categories, ingredients, "Seco de res", 75, "Res", "carne de res", "culantro", "ají amarillo", "papa", "arroz");
        addDish(categories, ingredients, "Causa rellena", 40, "Pollo", "papa", "pechuga de pollo", "limón", "ají amarillo", "mayonesa");
        addDish(categories, ingredients, "Estofado de pollo", 55, "Pollo", "pierna de pollo", "papa", "tomate", "zanahoria", "arroz");
        addDish(categories, ingredients, "Tortilla de verduras", 20, "Vegetariano", "huevo", "cebolla", "espinaca", "tomate", "aceite");
    }

    private Map<String, Ingredient> seedIngredients() {
        Map<String, Ingredient> ingredients = new HashMap<>();
        for (String name : new String[]{"arroz", "pollo", "carne de res", "pescado", "limón", "cebolla", "ajo",
                "ají amarillo", "ají panca", "papa", "huevo", "leche evaporada", "queso fresco", "aceite",
                "sal", "pimienta", "culantro", "choclo", "fideos", "albahaca", "espinaca", "frejoles",
                "tomate", "zanahoria", "sillao", "mayonesa", "maíz"}) {
            ingredients.put(name, ingredientRepository.save(new Ingredient(name)));
        }
        addVariant(ingredients, "pechuga de pollo", "pollo");
        addVariant(ingredients, "pierna de pollo", "pollo");
        addVariant(ingredients, "lomo de res", "carne de res");
        addVariant(ingredients, "cebolla roja", "cebolla");
        return ingredients;
    }

    private void addVariant(Map<String, Ingredient> ingredients, String name, String parentName) {
        Ingredient variant = new Ingredient(name);
        variant.setParentIngredient(ingredients.get(parentName));
        ingredients.put(name, ingredientRepository.save(variant));
    }

    private void addDish(Map<String, ProteinCategory> categories, Map<String, Ingredient> ingredients,
                         String name, int minutes, String category, String... required) {
        Dish dish = new Dish(name, minutes, categories.get(category));
        for (String ingredientName : required) {
            dish.getDishIngredients().add(new DishIngredient(dish, ingredients.get(ingredientName)));
        }
        dishRepository.save(dish);
    }

    private void createAdminIfConfigured() {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            return;
        }
        String email = adminEmail.trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }
        Role role = roleRepository.findByName(RoleName.ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ADMIN)));
        User admin = new User("Manka Admin", email, passwordEncoder.encode(adminPassword));
        admin.getRoles().add(role);
        userRepository.save(admin);
    }
}
