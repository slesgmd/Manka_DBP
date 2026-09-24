package com.manka.backend.exception;

public class UserAlreadyExistsException extends DuplicateResourceException {

    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
