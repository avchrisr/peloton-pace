package com.chrisr.pelotonpace.controller.data;

public class PelotonLoginRequest {

    private String username_or_email;
    private String password;

    public PelotonLoginRequest(String username_or_email, String password) {
        this.username_or_email = username_or_email;
        this.password = password;
    }

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

}
