#!/bin/sh

while ! nc -z config-server-container 20001 ; do
    echo "Waiting for the Config Server"
    sleep 3
done

while ! nc -z eureka-server-container 20002 ; do
    echo "Waiting for the Eureka Server"
    sleep 3
done

java -jar /user-service.jar
