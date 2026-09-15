package com.manka.backend.service;

import org.springframework.stereotype.Service;

@Service
public class StatusService {

    public String getStatus() {
        return "UP";
    }
}
