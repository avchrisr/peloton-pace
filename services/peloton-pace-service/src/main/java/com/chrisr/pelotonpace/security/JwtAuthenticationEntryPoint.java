package com.chrisr.pelotonpace.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// This class implements Spring’s AuthenticationEntryPoint class and overrides its method "commence".
// It rejects every unauthenticated request and send error code 401

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

	@Override
	public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException {
		logger.error("Responding with unauthorized exception. Message - {}", e.getMessage());

		// TODO: prettify error response for BadCredentialsException

//		if ("BadCredentialsException".equals(e.getClass().getSimpleName())) {
//			httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found!!!!!");
//			return;
//			throw new UserNotFoundException("User not found!!!!!", e);
//		}

		httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
	}
}
