package com.chrisr.pelotonpace.controller.data;

import com.chrisr.pelotonpace.controller.data.peloton.model.Ride;

public class PelotonWorkoutDetail {

    private Ride ride;

    public Ride getRide() {
        return ride;
    }

    public void setRide(Ride ride) {
        this.ride = ride;
    }

    @Override
    public String toString() {
        return "PelotonWorkoutDetail{" +
                "ride=" + ride +
                '}';
    }
}
