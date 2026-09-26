package com.manka.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Manka API",
                version = "v1",
                description = "API para administrar la despensa y recomendar platos peruanos"
        )
)
public class OpenApiConfig {
}
