package com.chrisr.pelotonpace.repository.enums;

public enum TableName {

    REQUEST_HISTORY("request_history");

    private String name;

    TableName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
