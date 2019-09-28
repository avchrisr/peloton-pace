# peloton-pace

PelotonPace app is a Peloton Fitness Exercise Health Metrics Tracker and Visualizer

consists of following dockerized components:

**nginx**

**peloton-pace-ui**  --  FE layer (React)

**peloton-pace-service**  --  BE service layer (Java Spring Boot)
- auth-service (jwt)
- user-service
- peloton-service
 
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
	"lastname": "Green",
	"email": "bgreen@email.com"
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


### Get Peloton Workout History
`http://localhost:3001/api/v1/peloton/get-workout-summary`

* valid Peloton credential required in user profile prior to accessing Peloton API

-----------

## TO DO

* "more" button to fetch more workout histories on the list page
* update the main home page stats and charts to use real data
* react context appears lost upon browser refresh. how to keep it stateful? (localStorage?)
* implement secure password change workflow
* password needs to be encrypted in DB, and should be decrypted before using to make Peloton requests
* add class music playlist
* create a search page with parameters?

-----------