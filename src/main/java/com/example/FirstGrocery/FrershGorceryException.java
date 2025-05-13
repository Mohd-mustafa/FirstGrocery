package com.example.FirstGrocery;

public class FrershGorceryException extends RuntimeException {
    public FrershGorceryException(String message) {
        super(message);
    }

    public FrershGorceryException(String message, Exception exception) {
        super(message, exception);
    }
}
