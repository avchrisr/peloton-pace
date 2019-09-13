package com.chrisr.pelotonpace.request;

import javax.validation.constraints.NotBlank;

public class PelotonRetrieveWorkoutHistoryRequest {

	@NotBlank
	private String username_or_email;

	@NotBlank
	private String password;

	public String getUsername_or_email() {
		return username_or_email;
	}

	public void setUsername_or_email(String username_or_email) {
		this.username_or_email = username_or_email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "PelotonRetrieveWorkoutHistoryRequest{" +
				"username_or_email='" + username_or_email + '\'' +
				", password='" + password + '\'' +
				'}';
	}
}
