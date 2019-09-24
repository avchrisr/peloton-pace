package com.chrisr.pelotonpace.repository.entity;

public class PelotonUserSession {

    private long id;
    private String username;
    private String userId;
    private String sessionId;
    private String pelotonPaceUsername;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

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

    public String getPelotonPaceUsername() {
        return pelotonPaceUsername;
    }

    public void setPelotonPaceUsername(String pelotonPaceUsername) {
        this.pelotonPaceUsername = pelotonPaceUsername;
    }

    @Override
    public String toString() {
        return "PelotonUserSession{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", userId='" + userId + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", pelotonPaceUsername='" + pelotonPaceUsername + '\'' +
                '}';
    }
}
