package com.manka.backend.service;

import com.manka.backend.dto.request.CookingHistoryCreateRequest;
import com.manka.backend.dto.response.CookingHistoryResponse;

import java.util.List;

public interface CookingHistoryService {

    List<CookingHistoryResponse> findCurrentUserHistory();

    CookingHistoryResponse create(CookingHistoryCreateRequest request);

    void delete(Long id);
}
