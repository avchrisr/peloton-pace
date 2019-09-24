package com.chrisr.pelotonpace.controller.data.peloton.model;

public class Ride {

    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Ride{" +
                "id='" + id + '\'' +
                '}';
    }
}
