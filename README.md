# peloton-pace

PelotonPace app is a Peloton Fitness Exercise Health Metrics Tracker and Visualizer

It is designed in Microservices architecture, and consists of following dockerized components:

- peloton-pace-ui (frontend)
- nginx
- config-server
- eureka-server
- api-gateway-zuul-server
- peloton-pace-service
- user-service
- postgres

-----------
**peloton-pace-ui**
- Frontend UI written in React

**nginx**
- single point of entry, which load balances web traffic to "**api-gateway-zuul-server**"
- update "**nginx-conf**" if you wish to change the initial setting of 3 api-gateway-zuul-server instances

**config-server**
- keeps the global config settings shared by all microservices in a centralized location

**eureka-server**
- service registry, which manages all instances of microservices

**api-gateway-zuul-server**
- gateway to underlying microservices such as peloton-pace-service or user-service
- auth-service (JWT) is built into the api-gateway

**peloton-pace-service**
- handles all things related to Peloton data such as querying the external Peloton API

**user-service**
- handles all things related to users such as user profiles data

**postgres**
- Backend datastore. In true ideal microservices, each microservice would have its own datastore, but it is an overkill for PelotonPace app, thus opting for a monolith database shared by all microservices

-----------

### Architecture diagram coming soon...


### Usage

`docker-compose up --build --scale api-gateway-zuul-server=3 --scale peloton-pace-service=3 --scale user-service=3`


### check global config settings
`http://localhost:20001/config-server/config/default`

### check Eureka (Service Registry) on registered microservices
`http://localhost:20002/eureka-server`

### Register User
`POST http://localhost:19999/api/v1/auth/register`
```
{
	"username": "bgreen",
	"password": "roar!",
	"firstname": "Bear",
	"lastname": "Green",
	"email": "bgreen@email.com"
}
```

### Login
`http://localhost:19999/api/v1/auth/login`
```
{
	"username": "bgreen",
	"password": "roar!"
}
```

### Get Users
`http://localhost:19999/api/v1/users/`

`http://localhost:19999/api/v1/users/1`


### Get Peloton Workout History
`http://localhost:19999/api/v1/peloton/get-workout-summary`

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