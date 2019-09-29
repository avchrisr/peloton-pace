package com.chrisr.apigatewayzuul.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class PublicRestControllerImpl implements PublicRestController {

//    private final Producer producer;
//
//    private final RpcClient rpcClient;
//
//    @Autowired
//    public PublicRestControllerImpl(Producer producer, RpcClient rpcClient) {
//        this.producer = producer;
//        this.rpcClient = rpcClient;
//    }

    @Override
    public ResponseEntity<String> status() {
        String responseMessage = "Application is up. Current time on server = " + LocalDateTime.now();
        return ResponseEntity.ok().body(responseMessage);
    }

//    @Override
//    public ResponseEntity<String> produceFanoutExchange() {
//        producer.produceFanoutExchange();
//        return ResponseEntity.ok().body("Message Sent to Fanout Exchange!");
//    }
//
//    @Override
//    public ResponseEntity<String> produceTopicExchange(@RequestParam(required = true) String routingKey) {
//        producer.produceTopicExchange(routingKey);
//        return ResponseEntity.ok().body("Message Sent to Topic Exchange!");
//    }
//
//    @Override
//    public ResponseEntity<String> rpcCall(@RequestParam(required = true) String message) {
//        // RPC pattern
//        // Client sends message (with replyQueue and correlationId) to Server
//        // Server sends the response along with the same correlationId to the replyQueue
//
//        String response = rpcClient.sendAndReceive(message);
//        return ResponseEntity.ok().body("Message Sent to RPC and got this respone back = " + response);
//    }
}
