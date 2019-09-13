package com.chrisr.pelotonpace.controller.data;

public class PelotonWorkoutHistoryItem {

    private String workoutDate;
    private String instructorName;
    private int classDuration;
    private String fitnessType;     // ex) Cycling, Stretching, Medication
    private String classTitle;
    private int caloriesBurned;
    private int avgHeartRate;

    public String getWorkoutDate() {
        return workoutDate;
    }

    public void setWorkoutDate(String workoutDate) {
        this.workoutDate = workoutDate;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public int getClassDuration() {
        return classDuration;
    }

    public void setClassDuration(int classDuration) {
        this.classDuration = classDuration;
    }

    public String getFitnessType() {
        return fitnessType;
    }

    public void setFitnessType(String fitnessType) {
        this.fitnessType = fitnessType;
    }

    public String getClassTitle() {
        return classTitle;
    }

    public void setClassTitle(String classTitle) {
        this.classTitle = classTitle;
    }

    public int getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(int caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public int getAvgHeartRate() {
        return avgHeartRate;
    }

    public void setAvgHeartRate(int avgHeartRate) {
        this.avgHeartRate = avgHeartRate;
    }

    @Override
    public String toString() {
        return "PelotonWorkoutHistoryItem{" +
                "workoutDate='" + workoutDate + '\'' +
                ", instructorName='" + instructorName + '\'' +
                ", classDuration=" + classDuration +
                ", fitnessType='" + fitnessType + '\'' +
                ", classTitle='" + classTitle + '\'' +
                ", caloriesBurned=" + caloriesBurned +
                ", avgHeartRate=" + avgHeartRate +
                '}';
    }
}
