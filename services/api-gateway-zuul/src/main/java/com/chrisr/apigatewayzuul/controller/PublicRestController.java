package com.chrisr.apigatewayzuul.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequestMapping("/public")
public interface PublicRestController {

    @GetMapping("/health")
    ResponseEntity<String> status();

//    @GetMapping("/rabbit-produce-fanout-exchange")
//    ResponseEntity<String> produceFanoutExchange();
//
//    @GetMapping("/rabbit-produce-topic-exchange")
//    ResponseEntity<String> produceTopicExchange(@RequestParam(required = true) String routingKey);
//
//    @GetMapping("/rabbit-rpc-call")
//    ResponseEntity<String> rpcCall(@RequestParam(required = true) String message);
}
