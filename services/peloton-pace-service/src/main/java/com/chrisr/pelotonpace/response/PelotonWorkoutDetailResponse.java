package com.chrisr.pelotonpace.response;

public class PelotonWorkoutDetailResponse {

    private String workoutDetail;
    private String workoutMetrics;
    private String rideDetail;

    public PelotonWorkoutDetailResponse(String workoutDetail, String workoutMetrics, String rideDetail) {
        this.workoutDetail = workoutDetail;
        this.workoutMetrics = workoutMetrics;
        this.rideDetail = rideDetail;
    }

    public String getWorkoutDetail() {
        return workoutDetail;
    }

    public void setWorkoutDetail(String workoutDetail) {
        this.workoutDetail = workoutDetail;
    }

    public String getWorkoutMetrics() {
        return workoutMetrics;
    }

    public void setWorkoutMetrics(String workoutMetrics) {
        this.workoutMetrics = workoutMetrics;
    }

    public String getRideDetail() {
        return rideDetail;
    }

    public void setRideDetail(String rideDetail) {
        this.rideDetail = rideDetail;
    }

    @Override
    public String toString() {
        return "PelotonWorkoutDetailResponse{" +
                "workoutDetail='" + workoutDetail + '\'' +
                ", workoutMetrics='" + workoutMetrics + '\'' +
                ", rideDetail='" + rideDetail + '\'' +
                '}';
    }
}
