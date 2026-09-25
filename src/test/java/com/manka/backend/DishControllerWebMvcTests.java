package com.manka.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.manka.backend.controller.DishController;
import com.manka.backend.dto.response.DishDetailResponse;
import com.manka.backend.exception.GlobalExceptionHandler;
import com.manka.backend.exception.DuplicateResourceException;
import com.manka.backend.exception.ResourceNotFoundException;
import com.manka.backend.service.DishService;
import com.manka.backend.security.JwtService;
import com.manka.backend.security.CustomUserDetailsService;
import com.manka.backend.security.RestAuthenticationEntryPoint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(value = DishController.class, excludeAutoConfiguration = org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class DishControllerWebMvcTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DishService service;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @MockBean
    private RestAuthenticationEntryPoint authenticationEntryPoint;

    @Test
    void createsDishAndReturns201() throws Exception {
        DishDetailResponse response = new DishDetailResponse(
                1L, "Arroz con pollo", 45, 2L, "Pollo", java.util.List.of()
        );
        when(service.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/dishes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new com.manka.backend.dto.request.DishCreateRequest("Arroz con pollo", 45, 2L)
                        )))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Arroz con pollo"));
    }

    @Test
    void rejectsInvalidDishRequest() throws Exception {
        mockMvc.perform(post("/api/v1/dishes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"totalTimeMinutes\":0,\"proteinCategoryId\":null}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.path").value("/api/v1/dishes"));
    }

    @Test
    void returns404WhenDishDoesNotExist() throws Exception {
        when(service.findById(99L)).thenThrow(new ResourceNotFoundException("Dish 99 was not found"));

        mockMvc.perform(get("/api/v1/dishes/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"));
    }

    @Test
    void returns409WhenDishIsInUse() throws Exception {
        org.mockito.Mockito.doThrow(new DuplicateResourceException("Dish 1 is used by favorites"))
                .when(service).delete(1L);

        mockMvc.perform(delete("/api/v1/dishes/1"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Dish 1 is used by favorites"));
    }
}
