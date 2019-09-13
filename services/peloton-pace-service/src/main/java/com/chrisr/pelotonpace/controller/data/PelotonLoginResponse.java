package com.chrisr.pelotonpace.controller.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PelotonLoginResponse {

	// (note) if you don't specify the @JsonProperty name, it'll use the same name

	@JsonProperty("user_id")
	private String userId;

	@JsonProperty("session_id")
	private String sessionId;


	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	@Override
	public String toString() {
		return "PelotonLoginResponse{" +
				"userId='" + userId + '\'' +
				", sessionId='" + sessionId + '\'' +
				'}';
	}
}
