package com.chrisr.apigatewayzuul.response;

public class JwtAuthResponse {

    private String jwt;

    public JwtAuthResponse(String jwt) {
        this.jwt = jwt;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }
}
