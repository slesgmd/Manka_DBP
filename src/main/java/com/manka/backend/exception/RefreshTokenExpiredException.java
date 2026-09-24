package com.manka.backend.exception;

public class RefreshTokenExpiredException extends InvalidTokenException {

    public RefreshTokenExpiredException(String message) {
        super(message);
    }
}
