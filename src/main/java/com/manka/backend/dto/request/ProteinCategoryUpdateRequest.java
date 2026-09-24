package com.manka.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProteinCategoryUpdateRequest(
        @NotBlank @Size(max = 100) String name
) {
}
