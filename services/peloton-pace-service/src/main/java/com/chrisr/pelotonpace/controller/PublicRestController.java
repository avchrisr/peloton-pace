package com.chrisr.pelotonpace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequestMapping("/public")
public interface PublicRestController {

    @GetMapping("/health")
    ResponseEntity<String> status();
}
