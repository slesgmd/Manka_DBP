package com.manka.backend;

import com.manka.backend.controller.RecommendationController;
import com.manka.backend.dto.response.RecommendationResponse;
import com.manka.backend.exception.GlobalExceptionHandler;
import com.manka.backend.security.CustomUserDetailsService;
import com.manka.backend.security.JwtService;
import com.manka.backend.security.RestAuthenticationEntryPoint;
import com.manka.backend.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RecommendationController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class RecommendationControllerWebMvcTests {
    @Autowired private MockMvc mockMvc;
    @MockBean private RecommendationService service;
    @MockBean private JwtService jwtService;
    @MockBean private CustomUserDetailsService userDetailsService;
    @MockBean private RestAuthenticationEntryPoint authenticationEntryPoint;

    @Test
    void returnsRecommendations() throws Exception {
        when(service.recommend(30, 10)).thenReturn(List.of(
                new RecommendationResponse(1L, "Ceviche", 25, 85.0, 100.0, List.of(), List.of())));
        mockMvc.perform(get("/api/v1/recommendations").param("availableMinutes", "30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Ceviche"))
                .andExpect(jsonPath("$[0].score").value(85.0));
    }

    @Test
    void rejectsOutOfRangeMinutesAndLimit() throws Exception {
        mockMvc.perform(get("/api/v1/recommendations")
                        .param("availableMinutes", "0").param("limit", "51"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
