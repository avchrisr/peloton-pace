# peloton-pace

Peloton Pace is a Peloton Fitness Exercise Tracker Application

consists of following dockerized components:

**nginx**

**peloton-pace-ui**  --  FE layer (React)

**peloton-pace-service**  --  BE service layer (Java Spring Boot)

**postgres**

-----------

### Usage

`docker-compose up --build --scale peloton-pace-service=3`

`docker-compose down`

`docker image prune`


### Register User
`POST http://localhost:3001/api/v1/auth/register`
```
{
	"username": "user1",
	"password": "pass1",
	"firstname": "Bear",
	"lastname": "Claw",
	"email": "bclaw@email.com"
}
```

### Login
`http://localhost:3001/api/v1/auth/login`
```
{
	"username": "user1",
	"password": "pass1"
}
```

### Get Users
`http://localhost:3001/api/v1/users/`

`http://localhost:3001/api/v1/users/1`


### Retrieve Peloton Workout History
`http://localhost:3001/api/v1/peloton/retrieve-workout-history`

-----------

## TO DO

* implement a way to store Peloton Username / Password. for now, hard code it in BE ?
* password needs to be encrypted in DB, and should be decrypted before using to make Peloton requests

-----------