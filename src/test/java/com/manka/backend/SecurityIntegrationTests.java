package com.manka.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.manka.backend.model.User;
import com.manka.backend.model.Dish;
import com.manka.backend.model.Ingredient;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.repository.DishRepository;
import com.manka.backend.repository.IngredientRepository;
import com.manka.backend.repository.ProteinCategoryRepository;
import com.manka.backend.repository.UserRepository;
import com.manka.backend.security.AuthenticatedUser;
import com.manka.backend.security.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Autowired
    private ProteinCategoryRepository categoryRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Test
    void exposesOpenApiDocumentationWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.info.title").value("Manka API"));
    }

    @Test
    void registersUserStoresPasswordHashAndAllowsAuthenticatedProfile() throws Exception {
        String email = "security.profile@manka.test";
        String password = "SecurePass1";

        MvcResult result = register("Security Profile", email, password)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value(email))
                .andExpect(jsonPath("$.user.roles[0]").value("USER"))
                .andReturn();

        JsonNode response = objectMapper.readTree(result.getResponse().getContentAsString());
        String accessToken = response.get("accessToken").asText();

        User stored = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        assertThat(stored.getPasswordHash()).isNotEqualTo(password);
        assertThat(passwordEncoder.matches(password, stored.getPasswordHash())).isTrue();
        User replacement = new User("Other User", email, stored.getPasswordHash());
        replacement.setId(stored.getId() + 1000);
        assertThat(jwtService.isValid(accessToken, AuthenticatedUser.from(replacement))).isFalse();

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    void exposesPublicHealthCheck() throws Exception {
        mockMvc.perform(get("/actuator/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void rejectsUnauthenticatedAndUnauthorizedRequests() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));

        mockMvc.perform(get("/api/v1/recommendations").param("availableMinutes", "30"))
                .andExpect(status().isUnauthorized());

        MvcResult result = register("Regular User", "regular.user@manka.test", "SecurePass2")
                .andExpect(status().isCreated())
                .andReturn();
        String accessToken = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("accessToken").asText();

        mockMvc.perform(post("/api/v1/protein-categories")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Unauthorized category\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    void rotatesRefreshTokenAndRejectsThePreviousToken() throws Exception {
        MvcResult registration = register("Refresh User", "refresh.user@manka.test", "SecurePass3")
                .andExpect(status().isCreated())
                .andReturn();
        String firstRefreshToken = objectMapper.readTree(registration.getResponse().getContentAsString())
                .get("refreshToken").asText();

        MvcResult refresh = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new TokenBody(firstRefreshToken))))
                .andExpect(status().isOk())
                .andReturn();
        String secondRefreshToken = objectMapper.readTree(refresh.getResponse().getContentAsString())
                .get("refreshToken").asText();

        assertThat(secondRefreshToken).isNotEqualTo(firstRefreshToken);

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new TokenBody(firstRefreshToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void rejectsRefreshForDisabledUser() throws Exception {
        String email = "disabled.refresh@manka.test";
        MvcResult registration = register("Disabled User", email, "SecurePass8")
                .andExpect(status().isCreated())
                .andReturn();
        String refreshToken = objectMapper.readTree(registration.getResponse().getContentAsString())
                .get("refreshToken").asText();
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        user.setEnabled(false);
        userRepository.saveAndFlush(user);

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new TokenBody(refreshToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void rejectsSignedAccessTokenWithoutExpiration() throws Exception {
        String email = "missing.expiration@manka.test";
        register("Missing Expiration", email, "SecurePass9")
                .andExpect(status().isCreated());
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        String token = Jwts.builder()
                .subject(email)
                .claim("email", email)
                .claim("userId", user.getId())
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .compact();

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsSignedAccessTokenWithWrongRoles() throws Exception {
        String email = "wrong.roles@manka.test";
        register("Wrong Roles", email, "SecurePass6")
                .andExpect(status().isCreated());
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        String token = Jwts.builder()
                .subject(email)
                .claim("email", email)
                .claim("userId", user.getId())
                .claim("roles", List.of("ADMIN"))
                .expiration(Date.from(Instant.now().plusSeconds(900)))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .compact();

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rejectsDuplicateRegistrationAndInvalidLogin() throws Exception {
        String email = "duplicate.user@manka.test";
        register("Duplicate User", email, "SecurePass4")
                .andExpect(status().isCreated());

        register("Duplicate User", email, "SecurePass4")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"WrongPass9\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void managesFavoritesPantryAndCookingHistoryForAuthenticatedUser() throws Exception {
        ProteinCategory category = categoryRepository.save(new ProteinCategory("Personal API protein"));
        Dish dish = dishRepository.save(new Dish("Personal API dish", 30, category));
        Ingredient ingredient = ingredientRepository.save(new Ingredient("Personal API ingredient"));

        MvcResult registration = register("Personal API User", "personal.api@manka.test", "SecurePass5")
                .andExpect(status().isCreated())
                .andReturn();
        String accessToken = objectMapper.readTree(registration.getResponse().getContentAsString())
                .get("accessToken").asText();

        mockMvc.perform(post("/api/v1/favorites")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dishId\":" + dish.getId() + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dishName").value("Personal API dish"));

        mockMvc.perform(post("/api/v1/pantry-items")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"ingredientId\":" + ingredient.getId() + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ingredientName").value("Personal API ingredient"));

        mockMvc.perform(post("/api/v1/cooking-history")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"dishId\":" + dish.getId() + "}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.dishName").value("Personal API dish"));

        mockMvc.perform(get("/api/v1/favorites")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dishId").value(dish.getId()));

        mockMvc.perform(get("/api/v1/pantry-items")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ingredientId").value(ingredient.getId()));

        mockMvc.perform(get("/api/v1/cooking-history")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].dishId").value(dish.getId()));
    }

    private org.springframework.test.web.servlet.ResultActions register(
            String name,
            String email,
            String password
    ) throws Exception {
        return mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new RegistrationBody(name, email, password))));
    }

    private record RegistrationBody(String name, String email, String password) {
    }

    private record TokenBody(String refreshToken) {
    }
}
