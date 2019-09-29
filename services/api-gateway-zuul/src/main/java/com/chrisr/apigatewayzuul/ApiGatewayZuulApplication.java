package com.chrisr.apigatewayzuul;

import com.netflix.config.ConfigurationManager;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.cloud.openfeign.EnableFeignClients;

import javax.annotation.PostConstruct;

@EnableZuulProxy
@EnableDiscoveryClient
@EnableFeignClients
@EnableCircuitBreaker
@SpringBootApplication
public class ApiGatewayZuulApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayZuulApplication.class, args);
	}

	@PostConstruct
	void disableHystrix() {

		ConfigurationManager.getConfigInstance().setProperty("hystrix.command.default.circuitBreaker.enabled", false);
		ConfigurationManager.getConfigInstance().setProperty("hystrix.command.default.execution.timeout.enabled", false);
		ConfigurationManager.getConfigInstance().setProperty("hystrix.command.default.execution.isolation.thread.interruptOnTimeout", false);
		ConfigurationManager.getConfigInstance().setProperty("hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds", 120000);
		ConfigurationManager.getConfigInstance().setProperty("ribbon.ReadTimeout", 60000);
		ConfigurationManager.getConfigInstance().setProperty("ribbon.ConnectTimeout", 60000);
	}
}
