package com.chrisr.apigatewayzuul.controller.exception;

import com.chrisr.apigatewayzuul.exception.BadRequestException;
import com.chrisr.apigatewayzuul.exception.UnauthorizedException;
import com.chrisr.apigatewayzuul.exception.UserAlreadyExistsException;
import com.chrisr.apigatewayzuul.exception.UserNotFoundException;
import com.chrisr.apigatewayzuul.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

//@ControllerAdvice(basePackages = "com.chrisr")		// https://www.baeldung.com/exception-handling-for-rest-with-spring
@ControllerAdvice
public class RestExceptionHandler {

    // default fall back catch-all exception handling
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(Exception ex) {
        return new ResponseEntity<>(generateErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

//    @ExceptionHandler
//    public ResponseEntity<ErrorResponse> handleException(AppException ex) {
//        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
//    }
//
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(BadRequestException ex) {
        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(UnauthorizedException ex) {
        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
    }
//
//    @ExceptionHandler
//    public ResponseEntity<ErrorResponse> handleException(IllegalArgumentException ex) {
//        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
//    }
//
//    @ExceptionHandler
//    public ResponseEntity<ErrorResponse> handleException(ResourceAlreadyExistsException ex) {
//        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
//    }
//
//    @ExceptionHandler
//    public ResponseEntity<ErrorResponse> handleException(ResourceNotFoundException ex) {
//        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
//    }
//
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(UserNotFoundException ex) {
        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
    }

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(generateErrorResponse(ex.getHttpStatus(), ex.getMessage()), ex.getHttpStatus());
    }

    private ErrorResponse generateErrorResponse(HttpStatus httpStatus, String message) {
        ErrorResponse error = new ErrorResponse();
        error.setStatus(httpStatus.value());
        error.setMessage(message);
        error.setDatetime(LocalDateTime.now().toString());
        return error;
    }
}
