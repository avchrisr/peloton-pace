package com.chrisr.pelotonpace.repository.entity;

public class User {

    private long id;
    private String username;
    private String password;
    private String firstname;
    private String lastname;
    private String dob;         // yyyy-MM-dd
    private String email;
    private String pelotonUsername;
    private String pelotonPassword;

    // *** IMPORTANT ***  empty constructor is necessary ONLY IF other constructors with arguments exist
    // or it will cause "com.fasterxml.jackson.databind.exc.InvalidDefinitionException: Cannot construct instance of ..."
//    public User() {}

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPelotonUsername() {
        return pelotonUsername;
    }

    public void setPelotonUsername(String pelotonUsername) {
        this.pelotonUsername = pelotonUsername;
    }

    public String getPelotonPassword() {
        return pelotonPassword;
    }

    public void setPelotonPassword(String pelotonPassword) {
        this.pelotonPassword = pelotonPassword;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", dob='" + dob + '\'' +
                ", email='" + email + '\'' +
                ", pelotonUsername='" + pelotonUsername + '\'' +
                ", pelotonPassword='" + pelotonPassword + '\'' +
                '}';
    }
}
