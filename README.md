# peloton-pace

PelotonPace is a Peloton Fitness Exercise Health Metrics Tracker and Visualizer app

## screenshots

### main page upon successful login

![Peloton-Pace-01-main-page.png](https://i.postimg.cc/0NfhXpGr/Peloton-Pace-01-main-page.png)

-----

### user profile page

![Peloton-Pace-02-User-Profile-Page.png](https://i.postimg.cc/vB5xdZB1/Peloton-Pace-02-User-Profile-Page.png)

-----

### workouts history page

![Peloton-Pace-03-Workout-List-Page.png](https://i.postimg.cc/CLcB0tF4/Peloton-Pace-03-Workout-List-Page.png)

-----

### workout details page with metrics

![Peloton-Pace-04-Workout-Details-Page.png](https://i.postimg.cc/90JMWRjf/Peloton-Pace-04-Workout-Details-Page.png)

-----

* UI design still under development and is subject to change

-----------

## System Architecture

PelotonPace is designed in Microservices architecture, and consists of following dockerized components:

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
- acting as a reverse proxy, it's the single point of entry into Backend, which load balances web traffic to "**api-gateway-zuul-server**"
- update "**nginx-conf**" if you wish to change the initial setting of 3 api-gateway-zuul-server instances

**config-server**
- keeps the global config settings shared by all microservices in a centralized location

**eureka-server**
- service registry, which manages all instances of microservices

**api-gateway-zuul-server**
- gateway to underlying microservices such as peloton-pace-service or user-service
- auth-service (JWT) is built into the api-gateway

**peloton-pace-service**
- handles all things related to Peloton data such as querying the external Peloton API and aggregating Peloton workout history and metrics

**user-service**
- handles all things related to users such as user profiles data

**postgres**
- Backend datastore. In true ideal microservices architecture, each microservice would have its own datastore; however, it is an overkill for PelotonPace app, thus opting for a monolith database shared by all microservices

-----------

## Architecture diagram

![Peloton-Pace-Architecture-Diagram.png](https://i.postimg.cc/NGKDnWRR/Peloton-Pace-Architecture-Diagram.png)

## usage

### build

`docker-compose up --build --scale api-gateway-zuul-server=3 --scale peloton-pace-service=3 --scale user-service=3`

### UI access on local browsers

`http://localhost:19999`

### check global config settings
`http://localhost:20001/config-server/config/default`

### check Eureka (Service Registry) on registered microservices
`http://localhost:20002/eureka-server`

### register user
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

### login
`http://localhost:19999/api/v1/auth/login`
```
{
	"username": "bgreen",
	"password": "roar!"
}
```

### get users
`http://localhost:19999/api/v1/user-dashboard/user-service/users`

`http://localhost:19999/api/v1/user-dashboard/user-service/users/1`


### get peloton workout history
`http://localhost:19999/api/v1/peloton-dashboard/peloton-pace-service/peloton/get-workout-summary`

* valid Peloton credential required in user profile prior to accessing Peloton API

-----------

## Lesson Learned

- CORS should only be enabled on the front door (API-Gateway). If underlying services have CORS enabled, it will cause conflicts and browser requests will throw CORS error
- Similarly, JWT Auth should only be done on the front door (API-Gateway / Auth-Service)
- Feign CANNOT propagate errors from underlying microservices to the surface level if the microservice returns an error response. Feign can only catch the status code, but not the message. AND you must implement Custom Feign Error Decoder to handle it properly.
- Do not create ambiguous endpoints with the same number of path variables
    - "GET users/{id}" and "GET users/{username}" will compile and server will start, but you'll get a runtime error if you send a request to either endpoint
- periodically clean up unused docker volumes to avoid seemingly random build failures!
    - "docker volume prune"

## TO DO

* "more" button to fetch more workout histories on the list page
* update the main home page stats and charts to use real data
* react context appears lost upon browser refresh. implement caching (localStorage?)
* implement secure password change workflow
* password needs to be encrypted in DB, and should be decrypted before using to make Peloton requests
* add class music playlist
* improve UI design layout
* create a search page with parameters?

-----------