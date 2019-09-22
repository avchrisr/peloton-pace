
import React, { useContext, useEffect, useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid,
    Icon, LinearProgress, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography
} from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

import { navigate } from 'hookrouter';

import { Bar, VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme, VictoryVoronoiContainer } from 'victory';
import _ from 'lodash';


const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '3001';
const REACT_APP_API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const useStyles = makeStyles(theme => ({
    root: {
        width: '1000px',
        // flexGrow: 1,
        margin: '2rem auto',


        //   border: '1px solid blue'
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        // margin: '0 auto',
        width: 90,
        height: 90,

        '&:hover': {
            cursor: 'pointer'
        }
    },
    purpleAvatar: {
        margin: '0 auto',
        width: 60,
        height: 60,
        color: '#fff',
        backgroundColor: deepPurple[400],
    },

    listItem: {
        display: 'block',

        // '&:hover': {
        //     cursor: 'pointer'
        // }
    },
    paper: {

        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,

        borderBottom: '1px solid blue',

        // border: 0,
        // outline: 0,

        '&:hover': {
            // cursor: 'pointer'
        }

    },
}));

const PelotonWorkoutDetail = (props) => {

    console.log(`------   PelotonWorkoutDetail  props   ------`);
    console.log(props);

    // {workoutId: "d4b2edd19b1041ec81ad7cf297573ede"}      rideId

    const classes = useStyles();

    const workoutDetail = JSON.parse(window.localStorage.getItem(`workoutDetail_${props.workoutId}`));

    const initialStateData = {
        workoutDetail,
        workoutMetrics: {},
        rideDetail: {},
        isLoading: true,
        errorMessages: []
    };
    const [data, setData] = useState(initialStateData);

    const [workoutId, setWorkoutId] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [explicitClass, setExplicitClass] = useState('');
    const [cadenceMetrics, setCadenceMetrics] = useState({});
    const [heartRateMetrics, setHeartRateMetrics] = useState({});
    const [caloriesSummary, setCaloriesSummary] = useState({});
    const [cadenceMetricsData, setCadenceMetricsData] = useState({});
    const [heartRateMetricsData, setHeartRateMetricsData] = useState({});



    const workoutStartDate = new Date(workoutDetail.start_time * 1000);
    const workoutStartDateString = `${workoutStartDate.toDateString()} @ ${workoutStartDate.toLocaleTimeString()}`;


    // const rideDetail = JSON.parse(window.localStorage.getItem(`rideDetail_${props.workoutId}`));
    // const workoutMetrics = JSON.parse(window.localStorage.getItem(`workoutMetrics_${props.workoutId}`));

    const fetchPelotonWorkoutMetricsData = async () => {

        // const pelotonUserId = 'a5a7e230614842e98b6205b80fb79fa6';
        // const pelotonSessionId = '176b1e04d8054c70820d8981b613b0e1';
        //
        // // call to retrieve the user info
        // // const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/${userId}`;
        // const url = `https://api.pelotoncycle.com/api/user/${pelotonUserId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created`;
        // // TODO: use BE API to fetch peloton data as browser request to Peloton directly is blocked by CORS policy
        //
        // // ex) https://api.pelotoncycle.com/api/user/{userId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created
        //
        // const options = {
        //     url,
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // 'Authorization': 'Bearer ' + jwt
        //         'Cookie': `peloton_session_id=${pelotonSessionId}`
        //     },
        //     // data: requestBody,
        //     timeout: 5000,
        //     // auth: {
        //     //     username: environment.username,
        //     //     password: environment.password
        //     // }
        // };
        //
        // console.log(`URL = ${url}`);
        //
        // const res = await axios(options).catch((err) => {
        //     console.log(`-------------  AXIOS ERROR  ---------------`);
        //     console.log(err);
        //     console.log(JSON.stringify(err, null, 4));
        //     console.log(`-------------  ERROR RESPONSE  ---------------`);
        //     console.log(err.response);
        //
        //     const errorMessage = _.get(err, 'response.data.message') || _.get(err, 'message');
        //
        //     console.log('--------   Peloton Workout Fetch - Error Message   ----------');
        //     console.log(errorMessage);
        //
        //     setErrorMessages([errorMessage]);
        // });
        //
        // if (res) {
        //     console.log(`-------------  Peloton Workout Fetch - res.data  ---------------`);
        //     console.log(JSON.stringify(res.data, null, 4));
        //
        // }


        // TODO: set it to the actual response
        setData({
            ...data,
            workoutMetrics: fetchedWorkoutMetrics
        });
    };

    const fetchPelotonRideDetailData = async () => {

        // const pelotonUserId = 'a5a7e230614842e98b6205b80fb79fa6';
        // const pelotonSessionId = '176b1e04d8054c70820d8981b613b0e1';
        //
        // // call to retrieve the user info
        // // const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/${userId}`;
        // const url = `https://api.pelotoncycle.com/api/user/${pelotonUserId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created`;
        // // TODO: use BE API to fetch peloton data as browser request to Peloton directly is blocked by CORS policy
        //
        // // ex) https://api.pelotoncycle.com/api/user/{userId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created
        //
        // const options = {
        //     url,
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // 'Authorization': 'Bearer ' + jwt
        //         'Cookie': `peloton_session_id=${pelotonSessionId}`
        //     },
        //     // data: requestBody,
        //     timeout: 5000,
        //     // auth: {
        //     //     username: environment.username,
        //     //     password: environment.password
        //     // }
        // };
        //
        // console.log(`URL = ${url}`);
        //
        // const res = await axios(options).catch((err) => {
        //     console.log(`-------------  AXIOS ERROR  ---------------`);
        //     console.log(err);
        //     console.log(JSON.stringify(err, null, 4));
        //     console.log(`-------------  ERROR RESPONSE  ---------------`);
        //     console.log(err.response);
        //
        //     const errorMessage = _.get(err, 'response.data.message') || _.get(err, 'message');
        //
        //     console.log('--------   Peloton Workout Fetch - Error Message   ----------');
        //     console.log(errorMessage);
        //
        //     setErrorMessages([errorMessage]);
        // });
        //
        // if (res) {
        //     console.log(`-------------  Peloton Workout Fetch - res.data  ---------------`);
        //     console.log(JSON.stringify(res.data, null, 4));
        //
        // }


        // TODO: set it to the actual response
        setData({
            ...data,
            rideDetail: fetchedRideDetail
        });

        // window.localStorage.setItem('pelotonWorkoutOverviewData', JSON.stringify(initialPelotonWorkoutOverviewData));

    };

    useEffect(() => {

        // fetch data
        // - workoutDetail
        // - workoutMetrics
        // - rideDetail


        setWorkoutId(workoutDetail.id);
        setInstructorName(fetchedRideDetail.ride.instructor.name);
        setExplicitClass(fetchedRideDetail.ride.is_explicit ? '(explicit)' : '');

        // const workoutId = workout.id;
        // const instructorName = workout.ride.instructor.name;
        // const explicitClass = workout.ride.is_explicit ? '(explicit)' : '';



        const cadenceMetrics = _.find(fetchedWorkoutMetrics.metrics, (category) => category.slug === 'cadence');
        const heartRateMetrics = _.find(fetchedWorkoutMetrics.metrics, (category) => category.slug === 'heart_rate');
        const caloriesSummary = _.find(fetchedWorkoutMetrics.summaries, (category) => category.slug === 'calories');

        const cadenceMetricsData = cadenceMetrics.values.map((value, index) => {
            return {x: index * 5, y: value};
        });

        const heartRateMetricsData = heartRateMetrics.values.map((value, index) => {
            return {x: index * 5, y: value};
        });



        setCadenceMetrics(cadenceMetrics);
        setHeartRateMetrics(heartRateMetrics);
        setCaloriesSummary(caloriesSummary);
        setCadenceMetricsData(cadenceMetricsData);
        setHeartRateMetricsData(heartRateMetricsData);


        console.log(cadenceMetricsData);
        console.log(JSON.stringify(cadenceMetricsData));
        console.log(JSON.stringify(heartRateMetricsData));


        setTimeout(() => {
            setData({
                ...data,
                workoutMetrics: fetchedWorkoutMetrics,
                rideDetail: fetchedRideDetail,
                isLoading: false
            });
        }, 1000);




        // TODO: should FE call Peloton directly, or should BE do that?
        // - ideally it should be OAuth to Peloton, but I don't think Peloton supports OAuth
        // - store Peloton user session id in FE?  --  NO

        // - store Peloton username / password in BE user profile securely, and BE knows to use it and FE doesn't have to send them
        //   along with every request
        //   - peloton_user_profile (/users/{id})
        //     - id, pelotonPaceUserId, username, email, password (encrypted - but need to be able to decrypted to be sent to Peloton), pelotonSessionId
        //
        // - create a user profile page
        //   - username / password / email updates
        //   - peloton credential updates


        // BE:  GET /peloton/workout/{id}/performance-metrics

        // https://api.onepeloton.com/api/workout/d4b2edd19b1041ec81ad7cf297573ede/performance_graph?every_n=5



        // TODO: add class music playlist


        // TODO: make API calls to BE to get the metrics
        // ex) https://api.pelotoncycle.com/api/user/{userId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created

        // const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/peloton/retrieve-workout-history`;

        // TODO: update BE to accept parameters such as limit ?


        // TODO: create a search page with parameters ?


        // componentWillUnmount equivalent
        return () => {
            // clean up
        }
    }, []);     // empty array [] makes it called only once


    const [open, setOpen] = useState(false);

    const [chartStyleAvgHeartRate, setChartStyleAvgHeartRate] = useState({
        data: {
            fill: 'tomato',
            // fillOpacity: 0.7,
            stroke: 'black',
            strokeWidth: 0.5
        }
    });

    const pelotonWorkoutHistoryDataAvgHeartRate = [
        {
            x: '6/28',
            y: 117
        },
        {
            x: '6/29',
            y: 151
        },
        {
            x: '6/30',
            y: 137
        },
        {
            x: '7/1',
            y: 150
        },
        {
            x: '7/2',
            y: 148
        },
        {
            x: '7/5',
            y: 134
        },
        {
            x: '7/6',
            y: 158
        },
        {
            x: '7/8',
            y: 160
        },
        {
            x: '7/9',
            y: 151
        },
        {
            x: '7/10',
            y: 155
        },
        {
            x: '7/11',
            y: 153
        },
        {
            x: '7/13',
            y: 147
        }
    ];


    const handleClickInstructor = () => {
        setOpen(true);
        // openDialog({
        //     name: 'instructor name'
        // });
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = (event) => {
        navigate('/peloton-workout-detail');
    };

    const openDialog = (props) => {

        console.log(props);
        console.log(open);

        return (
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {props.name}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
                        in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                    </Typography>
                    <Typography gutterBottom>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                        lacus vel augue laoreet rutrum faucibus dolor auctor.
                    </Typography>
                    <Typography gutterBottom>
                        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
                        scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
                        auctor fringilla.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };


    // const cartesianInterpolations = [
    //     "basis",
    //     "bundle",
    //     "cardinal",
    //     "catmullRom",
    //     "linear",
    //     "monotoneX",
    //     "monotoneY",
    //     "natural",
    //     "step",
    //     "stepAfter",
    //     "stepBefore"
    //   ];

    return (
        data.isLoading ? <LinearProgress /> :
        <div className={classes.root}>
            <div style={{fontSize: '1.5rem', backgroundColor: 'whitesmoke', padding: '0.8rem 1rem'}}>{`${instructorName} - ${data.rideDetail.ride.title} ${explicitClass}`}</div>
            <List>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar style={{margin: '1rem'}}>
                        <span>
                            <Avatar onClick={handleClickInstructor} className={classes.bigAvatar} alt={instructorName} src={data.rideDetail.ride.instructor.image_url} />
                            <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>{caloriesSummary.value} {caloriesSummary.display_unit}</div>
                            <div>{`(${(caloriesSummary.value / (data.rideDetail.ride.duration / 60)).toPrecision(3)} kcal / min)`}</div>
                        </span>
                    </ListItemAvatar>
                    <ListItemText style={{margin: '1rem'}}
                                  secondary={
                                      <React.Fragment>
                                          <Typography
                                              component="span"
                                              variant="h6"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              {workoutStartDateString}
                                              {/* Wednesday, July 24, 2019 @ 6:40 PM */}
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              <b>{`${workoutDetail.name} - ${workoutDetail.status}`}</b>
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              <b>Live Class Location: </b>{`${data.rideDetail.ride.location.toUpperCase()}`}
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              <b>Difficulty Rating: </b>{`${data.rideDetail.ride.difficulty_rating_avg.toPrecision(2)} based on ${data.rideDetail.ride.difficulty_rating_count} votes`}
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              {`${data.rideDetail.ride.description}`}
                                          </Typography>
                                          <span style={{display: 'flex', margin: '1rem 0 auto', justifyContent: 'space-around'}}>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{data.rideDetail.ride.duration / 60}</Avatar>
                                        <span>Duration</span>
                                    </span>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{caloriesSummary.value}</Avatar>
                                        <span>Calories</span>
                                    </span>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{heartRateMetrics.average_value}</Avatar>
                                        <span>Avg. Heart Rate</span>
                                    </span>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{heartRateMetrics.max_value}</Avatar>
                                        <span>Max Heart Rate</span>
                                    </span>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{cadenceMetrics.average_value}</Avatar>
                                        <span>Avg. Cadence</span>
                                    </span>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{cadenceMetrics.max_value}</Avatar>
                                        <span>Max Cadence</span>
                                    </span>
                                </span>
                                      </React.Fragment>
                                  }
                    />
                </ListItem>
                <Divider variant="middle" component="li" />
            </List>




            {/* TODO: Add class music playlist  */}




            <div style={{margin: '1rem auto'}}>
                <VictoryChart
                    // theme={VictoryTheme.material}
                    width={900} height={300}
                    minDomain={{ y: 0 }}
                    // maxDomain={{ y: 105 }}
                    domainPadding={{ x: 0, y: [0, 40] }}
                    // scale={{ x: "linear" }}
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 1000 }
                    }}
                    // style={{
                    //     data: {
                    //       stroke: '#c43a31'
                    //     }
                    //   }}
                    containerComponent={
                        <VictoryVoronoiContainer labels={d => d.y} />
                    }
                >
                    {/* Y axis */}
                    <VictoryAxis
                        dependentAxis
                        // offsetX={55}
                        // padding={{ top: 200, bottom: 60 }}
                        // padding={{ left: 2000 }}
                        tickFormat={t => `${t} rpm`}
                        style={{
                            // axis: {
                            //     stroke: 'transparent'
                            // },
                            // ticks: {
                            //     stroke: 'transparent'
                            // },
                            tickLabels: {
                                // color: 'black',
                                // fill: 'blue',
                                // fontSize: 10,
                                padding: 5,
                            }
                        }}
                        standalone={false}
                        // label="rpm"
                    />
                    {/* X Axis */}
                    <VictoryAxis
                        standalone={false}
                        tickFormat={t => `${Math.round(t / 60)} min`}
                        // style={{
                        // axis: {
                        //     stroke: 'transparent'
                        // },
                        // ticks: {
                        //     stroke: 'transparent'
                        // }
                        // }}
                    />

                    {/* <VictoryGroup>
                        <VictoryLine
                            interpolation="basis" data={heartRateMetricsData}
                            style={{ data: { stroke: "black" } }}
                        />
                        <VictoryLine
                            interpolation="basis" data={cadenceMetricsData}
                            style={{ data: { stroke: "#c43a31" } }}
                        />
                    </VictoryGroup> */}

                    <VictoryLabel style={{fontSize: '20'}} text="Cadence (rpm)" x={450} y={10} textAnchor="middle"/>
                    <VictoryLine
                        interpolation="basis" data={cadenceMetricsData}
                        style={{ data: { stroke: "#16a085" } }}
                    />

                    {/* <VictoryScatter data={cadenceMetricsData}
                        size={0}
                        style={{ data: { fill: "#c43a31" } }}
                    /> */}
                </VictoryChart>
            </div>
            <Divider variant="middle" light component="hr" />
            <div style={{margin: '1.5rem auto'}}>
                <VictoryChart
                    // theme={VictoryTheme.material}
                    width={900} height={300}
                    minDomain={{ y: 0 }}
                    // maxDomain={{ y: 105 }}
                    domainPadding={{ x: 0, y: [0, 40] }}
                    // scale={{ x: "linear" }}
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 1000 }
                    }}
                    // style={{
                    //     data: {
                    //       stroke: '#c43a31'
                    //     }
                    //   }}
                    containerComponent={
                        <VictoryVoronoiContainer labels={d => d.y} />
                    }
                >
                    {/* Y axis */}
                    <VictoryAxis
                        dependentAxis
                        // offsetX={55}
                        // padding={{ top: 200, bottom: 60 }}
                        // padding={{ left: 2000 }}
                        tickFormat={t => `${t} bpm`}
                        style={{
                            // axis: {
                            //     stroke: 'transparent'
                            // },
                            // ticks: {
                            //     stroke: 'transparent'
                            // },
                            tickLabels: {
                                // color: 'black',
                                // fill: 'blue',
                                fontSize: 13,
                                padding: 3,
                            }
                        }}
                        standalone={false}
                        // label="bpm"
                    />
                    {/* X Axis */}
                    <VictoryAxis
                        standalone={false}
                        tickFormat={t => `${Math.round(t / 60)} min`}
                        // style={{
                        // axis: {
                        //     stroke: 'transparent'
                        // },
                        // ticks: {
                        //     stroke: 'transparent'
                        // }
                        // }}
                    />

                    {/* <VictoryGroup>
                        <VictoryLine
                            interpolation="basis" data={heartRateMetricsData}
                            style={{ data: { stroke: "black" } }}
                        />
                        <VictoryLine
                            interpolation="basis" data={cadenceMetricsData}
                            style={{ data: { stroke: "#c43a31" } }}
                        />
                    </VictoryGroup> */}

                    <VictoryLabel style={{fontSize: '20'}} text="Heart Rate (bpm)" x={450} y={10} textAnchor="middle"/>
                    <VictoryLine
                        interpolation="basis" data={heartRateMetricsData}
                        style={{ data: { stroke: "#c43a31" } }}
                    />

                    {/* <VictoryScatter data={heartRateMetricsData}
                        size={0}
                        style={{ data: { fill: "#c43a31" } }}
                    /> */}
                </VictoryChart>
            </div>
            <Dialog maxWidth="md" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle style={{backgroundColor: 'whitesmoke'}} id="customized-dialog-title" onClose={handleClose}>
                    {instructorName}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="h6" gutterBottom>
                        {data.rideDetail.ride.instructor.short_bio}
                    </Typography>
                    {/* <Divider variant="fullWidth" component="hr" /> */}
                    <Typography variant="body1" gutterBottom>
                        {data.rideDetail.ride.instructor.bio}
                    </Typography>
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={handleClose} color="primary">
                    Save changes
                    </Button>
                </DialogActions> */}
            </Dialog>
        </div>
    );
};

export default PelotonWorkoutDetail;



const fetchedWorkoutMetrics = {
    "is_class_plan_shown": true,
    "splits_data": [],
    "location_data": [],
    "average_summaries": [
        {
            "display_name": "Avg Cadence",
            "slug": "avg_cadence",
            "value": 57,
            "display_unit": "rpm"
        }
    ],
    "metrics": [
        {
            "display_name": "Cadence",
            "max_value": 77,
            "average_value": 57,
            "display_unit": "rpm",
            "values": [60, 62, 62, 65, 65, 69, 69, 69, 66, 69, 69, 73, 72, 71, 72, 72, 72, 66, 77, 77, 75, 73, 75, 75, 76, 76, 74, 75, 74, 71, 70, 73, 73, 76, 74, 69, 69, 65, 66, 67, 67, 69, 71, 70, 71, 68, 69, 69, 66, 65, 70, 76, 76, 75, 74, 70, 61, 64, 66, 65, 68, 70, 71, 67, 72, 64, 68, 69, 66, 66, 66, 67, 65, 64, 60, 57, 56, 60, 61, 62, 61, 57, 60, 60, 57, 57, 56, 59, 60, 60, 61, 61, 64, 64, 66, 66, 67, 61, 61, 63, 63, 63, 63, 63, 56, 57, 62, 63, 61, 59, 59, 61, 63, 63, 61, 60, 58, 59, 61, 62, 63, 55, 49, 45, 53, 53, 54, 55, 54, 55, 56, 56, 62, 62, 62, 61, 60, 60, 59, 54, 54, 54, 60, 61, 61, 61, 62, 58, 55, 55, 58, 60, 60, 59, 59, 58, 42, 47, 52, 50, 51, 52, 53, 54, 53, 53, 54, 58, 61, 58, 56, 56, 63, 61, 58, 58, 56, 54, 55, 55, 57, 58, 59, 60, 61, 56, 63, 63, 62, 62, 62, 60, 60, 61, 64, 65, 65, 61, 59, 58, 59, 58, 55, 58, 59, 63, 65, 62, 63, 63, 60, 59, 60, 59, 53, 49, 48, 53, 53, 53, 54, 58, 60, 60, 60, 58, 58, 46, 51, 55, 55, 55, 61, 61, 60, 59, 57, 59, 59, 45, 44, 47, 53, 52, 57, 60, 58, 58, 58, 58, 46, 44, 43, 41, 46, 51, 51, 51, 52, 52, 53, 53, 55, 56, 56, 54, 55, 55, 57, 59, 60, 58, 54, 52, 49, 49, 50, 52, 52, 51, 51, 55, 55, 54, 54, 53, 56, 57, 56, 56, 56, 56, 56, 53, 53, 55, 56, 56, 56, 55, 55, 51, 45, 46, 46, 48, 48, 47, 46, 46, 46, 48, 46, 51, 53, 52, 53, 54, 56, 55, 56, 55, 54, 54, 53, 46, 41, 44, 56, 54, 53, 50, 52, 53, 55, 55, 54, 52, 53, 54, 54, 55, 55, 55, 54, 53, 53, 47, 41, 40, 54, 56, 56, 54, 53, 54, 50, 47, 42, 45, 45],
            "slug": "cadence"
        },
        {
            "display_name": "Heart Rate",
            "max_value": 162,
            "missing_data_duration": 0,
            "average_value": 142,
            "display_unit": "bpm",
            "zones": [
                {
                    "display_name": "Zone 1",
                    "max_value": 117,
                    "min_value": 0,
                    "range": "<118 bpm",
                    "duration": 65,
                    "slug": "zone1"
                },
                {
                    "display_name": "Zone 2",
                    "max_value": 135,
                    "min_value": 118,
                    "range": "118-135 bpm",
                    "duration": 352,
                    "slug": "zone2"
                },
                {
                    "display_name": "Zone 3",
                    "max_value": 153,
                    "min_value": 136,
                    "range": "136-153 bpm",
                    "duration": 1132,
                    "slug": "zone3"
                },
                {
                    "display_name": "Zone 4",
                    "max_value": 171,
                    "min_value": 154,
                    "range": "154-171 bpm",
                    "duration": 251,
                    "slug": "zone4"
                },
                {
                    "display_name": "Zone 5",
                    "max_value": 182,
                    "min_value": 172,
                    "range": ">172 bpm",
                    "duration": 0,
                    "slug": "zone5"
                }
            ],
            "values": [97, 98, 99, 100, 100, 99, 95, 98, 106, 107, 111, 115, 118, 120, 121, 120, 120, 123, 124, 124, 124, 127, 127, 126, 127, 128, 128, 128, 127, 126, 127, 126, 128, 132, 136, 138, 139, 139, 138, 137, 137, 137, 135, 134, 133, 131, 127, 121, 127, 136, 138, 138, 139, 141, 144, 145, 146, 145, 143, 141, 143, 142, 140, 140, 139, 140, 142, 143, 145, 146, 144, 146, 149, 150, 150, 151, 151, 149, 149, 146, 144, 143, 140, 139, 138, 137, 138, 141, 141, 137, 135, 132, 134, 138, 139, 139, 144, 148, 149, 151, 153, 154, 156, 157, 158, 159, 159, 159, 160, 161, 161, 161, 159, 159, 160, 161, 162, 162, 162, 162, 162, 162, 162, 159, 159, 158, 155, 153, 151, 149, 145, 143, 143, 141, 141, 143, 147, 152, 154, 156, 156, 156, 153, 149, 149, 151, 153, 154, 154, 154, 154, 157, 158, 159, 161, 162, 161, 158, 158, 156, 148, 144, 140, 138, 139, 139, 138, 136, 136, 135, 134, 133, 131, 132, 133, 135, 136, 136, 140, 140, 141, 142, 140, 139, 138, 138, 137, 137, 138, 138, 138, 139, 140, 140, 140, 142, 143, 144, 146, 146, 144, 144, 145, 147, 147, 146, 144, 145, 145, 144, 140, 141, 145, 148, 150, 150, 149, 149, 148, 145, 144, 144, 143, 142, 145, 148, 150, 150, 152, 152, 151, 149, 148, 148, 146, 150, 153, 155, 155, 154, 154, 155, 154, 149, 145, 143, 143, 144, 147, 149, 150, 150, 149, 149, 149, 151, 151, 149, 147, 145, 140, 136, 134, 134, 134, 132, 132, 132, 132, 133, 132, 136, 137, 138, 138, 140, 141, 140, 139, 139, 140, 141, 143, 143, 142, 139, 138, 138, 139, 140, 139, 139, 143, 147, 150, 151, 153, 154, 156, 158, 158, 158, 157, 155, 155, 151, 151, 152, 149, 145, 141, 136, 133, 131, 131, 133, 136, 140, 143, 145, 149, 153, 155, 157, 158, 158, 160, 160, 158, 153, 150, 149, 147, 147, 146, 144, 145, 146, 147, 148, 148, 149, 150, 150, 150, 150, 153, 155, 155, 154, 153, 150, 147, 144, 141, 138, 134, 131, 134, 137, 137],
            "slug": "heart_rate"
        }
    ],
    "segment_list": [
        {
            "intensity_in_mets": 3.5,
            "name": "Warmup",
            "start_time_offset": 0,
            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/segment-icons/warmup.png",
            "icon_name": "warmup",
            "icon_slug": "warmup",
            "length": 210,
            "metrics_type": "cycling",
            "id": "14520b722a44434bb070a2980eeef678"
        },
        {
            "intensity_in_mets": 6.0,
            "name": "Cycling",
            "start_time_offset": 210,
            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/segment-icons/cycling.png",
            "icon_name": "cycling",
            "icon_slug": "cycling",
            "length": 1533,
            "metrics_type": "cycling",
            "id": "b9d9b5303b73459c8ea49661b1662224"
        },
        {
            "intensity_in_mets": 3.5,
            "name": "Cool Down",
            "start_time_offset": 1743,
            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/segment-icons/cooldown.png",
            "icon_name": "cooldown",
            "icon_slug": "cooldown",
            "length": 57,
            "metrics_type": "cycling",
            "id": "67608af67592475ab25056d83adf312a"
        }
    ],
    "duration": 1800,
    "is_location_data_accurate": null,
    "has_apple_watch_metrics": false,
    "summaries": [
        {
            "display_name": "Calories",
            "slug": "calories",
            "value": 373,
            "display_unit": "kcal"
        }
    ],
    "seconds_since_pedaling_start": [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91, 96, 101, 106, 111, 116, 121, 126, 131, 136, 141, 146, 151, 156, 161, 166, 171, 176, 181, 186, 191, 196, 201, 206, 211, 216, 221, 226, 231, 236, 241, 246, 251, 256, 261, 266, 271, 276, 281, 286, 291, 296, 301, 306, 311, 316, 321, 326, 331, 336, 341, 346, 351, 356, 361, 366, 371, 376, 381, 386, 391, 396, 401, 406, 411, 416, 421, 426, 431, 436, 441, 446, 451, 456, 461, 466, 471, 476, 481, 486, 491, 496, 501, 506, 511, 516, 521, 526, 531, 536, 541, 546, 551, 556, 561, 566, 571, 576, 581, 586, 591, 596, 601, 606, 611, 616, 621, 626, 631, 636, 641, 646, 651, 656, 661, 666, 671, 676, 681, 686, 691, 696, 701, 706, 711, 716, 721, 726, 731, 736, 741, 746, 751, 756, 761, 766, 771, 776, 781, 786, 791, 796, 801, 806, 811, 816, 821, 826, 831, 836, 841, 846, 851, 856, 861, 866, 871, 876, 881, 886, 891, 896, 901, 906, 911, 916, 921, 926, 931, 936, 941, 946, 951, 956, 961, 966, 971, 976, 981, 986, 991, 996, 1001, 1006, 1011, 1016, 1021, 1026, 1031, 1036, 1041, 1046, 1051, 1056, 1061, 1066, 1071, 1076, 1081, 1086, 1091, 1096, 1101, 1106, 1111, 1116, 1121, 1126, 1131, 1136, 1141, 1146, 1151, 1156, 1161, 1166, 1171, 1176, 1181, 1186, 1191, 1196, 1201, 1206, 1211, 1216, 1221, 1226, 1231, 1236, 1241, 1246, 1251, 1256, 1261, 1266, 1271, 1276, 1281, 1286, 1291, 1296, 1301, 1306, 1311, 1316, 1321, 1326, 1331, 1336, 1341, 1346, 1351, 1356, 1361, 1366, 1371, 1376, 1381, 1386, 1391, 1396, 1401, 1406, 1411, 1416, 1421, 1426, 1431, 1436, 1441, 1446, 1451, 1456, 1461, 1466, 1471, 1476, 1481, 1486, 1491, 1496, 1501, 1506, 1511, 1516, 1521, 1526, 1531, 1536, 1541, 1546, 1551, 1556, 1561, 1566, 1571, 1576, 1581, 1586, 1591, 1596, 1601, 1606, 1611, 1616, 1621, 1626, 1631, 1636, 1641, 1646, 1651, 1656, 1661, 1666, 1671, 1676, 1681, 1686, 1691, 1696, 1701, 1706, 1711, 1716, 1721, 1726, 1731, 1736, 1741, 1746, 1751, 1756, 1761, 1766, 1771, 1776, 1781, 1786, 1791, 1796, 1800]
};

const fetchedRideDetail = {
    "excluded_platforms": [],
    "playlist": {
        "ride_id": "157bc6faa9ad4ea191e0c905ab9ce6fe",
        "top_artists": [
            {
                "artist_id": "f492913e5ee24997ac692c6b0b620e8a",
                "artist_name": "Calvin Harris"
            },
            {
                "artist_id": "e1e4d9efec4f490bbbf8bbeef74ddea8",
                "artist_name": "Avicii"
            },
            {
                "artist_id": "5c69c9d3eb2546c69214a704157d480b",
                "artist_name": "Halsey"
            },
            {
                "artist_id": "c0275845c8814498bb370f5dabe6d60d",
                "artist_name": "Tiësto"
            }
        ],
        "is_playlist_shown": true,
        "is_top_artists_shown": true,
        "is_in_class_music_shown": true,
        "id": "2a57f0ba61aa45ec88a101f3696f1c2e",
        "songs": [
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/592057c7-3198-489d-b364-1007212901b6/Big_00724381152454_T-1364_Image.jpg",
                    "id": "4efe24db0bcd4f41937158e144f7429d",
                    "name": "In Search Of..."
                },
                "liked": false,
                "start_time_offset": 60,
                "title": "Lapdance - Feat. Lee Harvey & Vita",
                "cue_time_offset": 60,
                "artists": [
                    {
                        "artist_id": "4fc9b574b5c645f99d0ea8388b4b5986",
                        "artist_name": "Lee Harvey"
                    },
                    {
                        "artist_id": "5c3c92b85c6b4205942ee8a7d7b12c6e",
                        "artist_name": "Vita"
                    },
                    {
                        "artist_id": "931c57e8ce984f328d75d7b591b11c30",
                        "artist_name": "N.E.R.D"
                    }
                ],
                "id": "fa50a912ed64450a8bc5e9e9a2dadb1f"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/42dc14df-7bc5-411a-9a9a-7f3c32ad0a36/Big_UMG_cvrart_00602498611265_01_RGB300_1422x1411_06UMGIM20295.jpg",
                    "id": "b412ee2af7264201b863c5ea04f57246",
                    "name": "The Singles Collection"
                },
                "liked": false,
                "start_time_offset": 266,
                "title": "Hey Baby (Album Version) (feat. Bounty Killer)",
                "cue_time_offset": 266,
                "artists": [
                    {
                        "artist_id": "70b1d9dd6aee4706ba7205d6b1ec6ad4",
                        "artist_name": "Bounty Killer"
                    },
                    {
                        "artist_id": "f100a80c8fd1412a8f1ec943fbcfe380",
                        "artist_name": "No Doubt"
                    }
                ],
                "id": "f5d1a4d9d9ef41c8b729ae8ceb14b150"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/cdc9584a-c8c7-43db-b1c9-bb5bd7f34eff/big_UMG_cvrart_00602547749048_01_RGB300_1500x1500_15UMGIM77357.jpg",
                    "id": "c19c47bc75b9488ca846e275cab85597",
                    "name": "The Right Song"
                },
                "liked": false,
                "start_time_offset": 465,
                "title": "The Right Song",
                "cue_time_offset": 465,
                "artists": [
                    {
                        "artist_id": "2b43a9d9f0294ea886aa9d763906fc6b",
                        "artist_name": "Oliver Heldens"
                    },
                    {
                        "artist_id": "c0275845c8814498bb370f5dabe6d60d",
                        "artist_name": "Tiësto"
                    },
                    {
                        "artist_id": "e26008c041aa485aaffa25181e25ebe1",
                        "artist_name": "Natalie La Rose"
                    }
                ],
                "id": "af5bb81fcd8b4800a2de16c393d131d3"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/cea40100-e625-4926-b89d-4fb2bbf77647/Big_UMG_cvrart_00602547250407_01_RGB300_1500x1500_15UMGIM08539.jpg",
                    "id": "255483d516b74d5497a3adfb2421991b",
                    "name": "Room 93: The Remixes"
                },
                "liked": false,
                "start_time_offset": 662,
                "title": "Trouble (Sander Kleinenberg Remix)",
                "cue_time_offset": 662,
                "artists": [
                    {
                        "artist_id": "5c69c9d3eb2546c69214a704157d480b",
                        "artist_name": "Halsey"
                    }
                ],
                "id": "ed3e22ca8cda4a9abf9485531001b738"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/17e29ca9-5a3b-4554-8747-33167e79b65b/big_00602577537370_T1_cvrart.jpg",
                    "id": "4bd660689719418a89ecb844bca88dbe",
                    "name": "Crashing (Remixes)"
                },
                "liked": false,
                "start_time_offset": 840,
                "title": "Crashing (KLOUD Remix) (feat. Bahari)",
                "cue_time_offset": 840,
                "artists": [
                    {
                        "artist_id": "072cc07de84546a08e7e9bae218027cc",
                        "artist_name": "ILLENIUM"
                    },
                    {
                        "artist_id": "782175ffe89746cdb2c8df2685e3371a",
                        "artist_name": "Bahari"
                    }
                ],
                "id": "b3fa3a1db72346579a6e7278ffd59180"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/1a3908d2-7295-4613-9092-679b5162962c/Product/2ace8151-0488-490a-ba90-e6c60738d2c4/Big_5099902759753.jpg",
                    "id": "e6fb8c93113b490fbc671781ccd20d81",
                    "name": "Disc-Overy"
                },
                "liked": false,
                "start_time_offset": 1079,
                "title": "Written In The Stars (feat. Eric Turner)",
                "cue_time_offset": 1079,
                "artists": [
                    {
                        "artist_id": "c7766c8b689c41779c4c764cdb1c45a3",
                        "artist_name": "Tinie Tempah"
                    },
                    {
                        "artist_id": "fd7c74cc32c341f6a3941437a971712f",
                        "artist_name": "Eric Turner"
                    }
                ],
                "id": "875e32bf6edf4754ba4e6b7695dc5a89"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/e6691a61-68f0-428c-873e-bf667dcd863b/Product/3f1e4fba-5f08-4a9e-b3bf-3166f47c1a87/Big_A10301A00036313137_T-109339708170_Image.jpg",
                    "id": "9cdb12f118ed406b96acbc121331827a",
                    "name": "My Way (offaiah Remixes)"
                },
                "liked": false,
                "start_time_offset": 1291,
                "title": "My Way (offaiah Remix [Extended Mix])",
                "cue_time_offset": 1291,
                "artists": [
                    {
                        "artist_id": "f492913e5ee24997ac692c6b0b620e8a",
                        "artist_name": "Calvin Harris"
                    }
                ],
                "id": "ee4ec141327947119c8631be0fd91df9"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/5f1647b5-b522-4262-8572-06b9e21e3948/Big_UMG_cvrart_00602537039371_01_RGB300_1500x1500_12UMGIM18403.jpg",
                    "id": "3a4739baebf74c1986ecb40c86a29322",
                    "name": "Silhouettes"
                },
                "liked": false,
                "start_time_offset": 1599,
                "title": "Silhouettes - Original Radio Edit",
                "cue_time_offset": 1599,
                "artists": [
                    {
                        "artist_id": "e1e4d9efec4f490bbbf8bbeef74ddea8",
                        "artist_name": "Avicii"
                    }
                ],
                "id": "fb8a48d054b8412abec337987c7f2e8f"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/e513ba1f-2063-4e93-9f2a-03bdb60bcfce/Big_UMG_cvrart_00602547880567_01_RGB300_1500x1500_16UMGIM13738.jpg",
                    "id": "1c65939fa6454e15b989f9e26d373c1e",
                    "name": "At Night, Alone."
                },
                "liked": false,
                "start_time_offset": 1803,
                "title": "I Took A Pill In Ibiza (Seeb Remix)",
                "cue_time_offset": 1803,
                "artists": [
                    {
                        "artist_id": "a509bb6b34564d77a82a090a17cb18bf",
                        "artist_name": "Mike Posner"
                    }
                ],
                "id": "8fb74fa9065e4ed2aedf469f2ce2e7ab"
            },
            {
                "album": {
                    "image_url": "https://neurotic.azureedge.net/RR/AlbumImages/Catalog/30c482cf-6693-4acd-8619-878f3cfb8862/Product/6443f2d3-7d0b-4948-b41b-c8b486e68dc7/Big_UMG_cvrart_00602537778522_01_RGB300_1500x1500_14UMGIM06854.jpg",
                    "id": "b57f23d02d2e4c988fac01d8e700a923",
                    "name": "True: Avicii By Avicii"
                },
                "liked": false,
                "start_time_offset": 1993,
                "title": "Wake Me Up - Avicii By Avicii",
                "cue_time_offset": 1993,
                "artists": [
                    {
                        "artist_id": "d362ac3bea4141189086bbe232679b65",
                        "artist_name": "Tim Bergling"
                    },
                    {
                        "artist_id": "e1e4d9efec4f490bbbf8bbeef74ddea8",
                        "artist_name": "Avicii"
                    }
                ],
                "id": "fff3fcc30b6746c18c74083002a6a450"
            }
        ]
    },
    "instructor_cues": [
        {
            "resistance_range": {
                "upper": 30,
                "lower": 20
            },
            "cadence_range": {
                "upper": 100,
                "lower": 80
            },
            "offsets": {
                "start": 60,
                "end": 59
            }
        },
        {
            "resistance_range": {
                "upper": 30,
                "lower": 20
            },
            "cadence_range": {
                "upper": 100,
                "lower": 80
            },
            "offsets": {
                "start": 60,
                "end": 98
            }
        },
        {
            "resistance_range": {
                "upper": 33,
                "lower": 21
            },
            "cadence_range": {
                "upper": 100,
                "lower": 80
            },
            "offsets": {
                "start": 99,
                "end": 117
            }
        },
        {
            "resistance_range": {
                "upper": 38,
                "lower": 23
            },
            "cadence_range": {
                "upper": 100,
                "lower": 80
            },
            "offsets": {
                "start": 118,
                "end": 154
            }
        },
        {
            "resistance_range": {
                "upper": 41,
                "lower": 24
            },
            "cadence_range": {
                "upper": 100,
                "lower": 80
            },
            "offsets": {
                "start": 155,
                "end": 173
            }
        },
        {
            "resistance_range": {
                "upper": 46,
                "lower": 26
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 174,
                "end": 211
            }
        },
        {
            "resistance_range": {
                "upper": 49,
                "lower": 27
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 212,
                "end": 229
            }
        },
        {
            "resistance_range": {
                "upper": 54,
                "lower": 30
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 230,
                "end": 242
            }
        },
        {
            "resistance_range": {
                "upper": 54,
                "lower": 30
            },
            "cadence_range": {
                "upper": 120,
                "lower": 110
            },
            "offsets": {
                "start": 243,
                "end": 266
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 267,
                "end": 307
            }
        },
        {
            "resistance_range": {
                "upper": 40,
                "lower": 35
            },
            "cadence_range": {
                "upper": 110,
                "lower": 100
            },
            "offsets": {
                "start": 308,
                "end": 340
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 341,
                "end": 369
            }
        },
        {
            "resistance_range": {
                "upper": 45,
                "lower": 35
            },
            "cadence_range": {
                "upper": 110,
                "lower": 100
            },
            "offsets": {
                "start": 370,
                "end": 397
            }
        },
        {
            "resistance_range": {
                "upper": 55,
                "lower": 40
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 398,
                "end": 410
            }
        },
        {
            "resistance_range": {
                "upper": 60,
                "lower": 45
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 411,
                "end": 426
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 110,
                "lower": 100
            },
            "offsets": {
                "start": 427,
                "end": 446
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 115,
                "lower": 105
            },
            "offsets": {
                "start": 447,
                "end": 459
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 460,
                "end": 474
            }
        },
        {
            "resistance_range": {
                "upper": 60,
                "lower": 45
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 475,
                "end": 523
            }
        },
        {
            "resistance_range": {
                "upper": 65,
                "lower": 45
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 524,
                "end": 543
            }
        },
        {
            "resistance_range": {
                "upper": 65,
                "lower": 45
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 544,
                "end": 545
            }
        },
        {
            "resistance_range": {
                "upper": 66,
                "lower": 46
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 546,
                "end": 554
            }
        },
        {
            "resistance_range": {
                "upper": 66,
                "lower": 46
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 555,
                "end": 577
            }
        },
        {
            "resistance_range": {
                "upper": 67,
                "lower": 47
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 578,
                "end": 587
            }
        },
        {
            "resistance_range": {
                "upper": 67,
                "lower": 47
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 588,
                "end": 607
            }
        },
        {
            "resistance_range": {
                "upper": 67,
                "lower": 47
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 608,
                "end": 616
            }
        },
        {
            "resistance_range": {
                "upper": 68,
                "lower": 48
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 617,
                "end": 633
            }
        },
        {
            "resistance_range": {
                "upper": 68,
                "lower": 48
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 634,
                "end": 636
            }
        },
        {
            "resistance_range": {
                "upper": 69,
                "lower": 49
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 637,
                "end": 644
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 645,
                "end": 662
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 663,
                "end": 720
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 721,
                "end": 751
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 752,
                "end": 758
            }
        },
        {
            "resistance_range": {
                "upper": 72,
                "lower": 51
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 759,
                "end": 766
            }
        },
        {
            "resistance_range": {
                "upper": 72,
                "lower": 51
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 767,
                "end": 791
            }
        },
        {
            "resistance_range": {
                "upper": 72,
                "lower": 51
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 792,
                "end": 797
            }
        },
        {
            "resistance_range": {
                "upper": 74,
                "lower": 52
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 798,
                "end": 811
            }
        },
        {
            "resistance_range": {
                "upper": 74,
                "lower": 52
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 812,
                "end": 834
            }
        },
        {
            "resistance_range": {
                "upper": 74,
                "lower": 52
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 835,
                "end": 841
            }
        },
        {
            "resistance_range": {
                "upper": 40,
                "lower": 30
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 842,
                "end": 912
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 35
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 913,
                "end": 932
            }
        },
        {
            "resistance_range": {
                "upper": 52,
                "lower": 36
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 933,
                "end": 941
            }
        },
        {
            "resistance_range": {
                "upper": 40,
                "lower": 30
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 942,
                "end": 973
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 36
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 974,
                "end": 994
            }
        },
        {
            "resistance_range": {
                "upper": 52,
                "lower": 37
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 995,
                "end": 1001
            }
        },
        {
            "resistance_range": {
                "upper": 40,
                "lower": 30
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 1002,
                "end": 1030
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 37
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 1031,
                "end": 1049
            }
        },
        {
            "resistance_range": {
                "upper": 52,
                "lower": 38
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 1050,
                "end": 1067
            }
        },
        {
            "resistance_range": {
                "upper": 40,
                "lower": 30
            },
            "cadence_range": {
                "upper": 100,
                "lower": 90
            },
            "offsets": {
                "start": 1068,
                "end": 1083
            }
        },
        {
            "resistance_range": {
                "upper": 40,
                "lower": 30
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1084,
                "end": 1090
            }
        },
        {
            "resistance_range": {
                "upper": 65,
                "lower": 45
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1091,
                "end": 1099
            }
        },
        {
            "resistance_range": {
                "upper": 75,
                "lower": 52
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1100,
                "end": 1121
            }
        },
        {
            "resistance_range": {
                "upper": 77,
                "lower": 53
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1122,
                "end": 1130
            }
        },
        {
            "resistance_range": {
                "upper": 55,
                "lower": 45
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1131,
                "end": 1161
            }
        },
        {
            "resistance_range": {
                "upper": 65,
                "lower": 52
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1162,
                "end": 1189
            }
        },
        {
            "resistance_range": {
                "upper": 55,
                "lower": 45
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1190,
                "end": 1197
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1198,
                "end": 1218
            }
        },
        {
            "resistance_range": {
                "upper": 60,
                "lower": 48
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1219,
                "end": 1241
            }
        },
        {
            "resistance_range": {
                "upper": 62,
                "lower": 49
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1242,
                "end": 1250
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1251,
                "end": 1278
            }
        },
        {
            "resistance_range": {
                "upper": 55,
                "lower": 45
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1279,
                "end": 1305
            }
        },
        {
            "resistance_range": {
                "upper": 50,
                "lower": 40
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1306,
                "end": 1322
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1323,
                "end": 1351
            }
        },
        {
            "resistance_range": {
                "upper": 55,
                "lower": 45
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1352,
                "end": 1380
            }
        },
        {
            "resistance_range": {
                "upper": 55,
                "lower": 45
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1381,
                "end": 1395
            }
        },
        {
            "resistance_range": {
                "upper": 55,
                "lower": 45
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1396,
                "end": 1403
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1404,
                "end": 1425
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1426,
                "end": 1440
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1441,
                "end": 1460
            }
        },
        {
            "resistance_range": {
                "upper": 72,
                "lower": 51
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1461,
                "end": 1472
            }
        },
        {
            "resistance_range": {
                "upper": 72,
                "lower": 51
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1473,
                "end": 1479
            }
        },
        {
            "resistance_range": {
                "upper": 75,
                "lower": 52
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1480,
                "end": 1487
            }
        },
        {
            "resistance_range": {
                "upper": 75,
                "lower": 52
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1488,
                "end": 1520
            }
        },
        {
            "resistance_range": {
                "upper": 75,
                "lower": 52
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1521,
                "end": 1534
            }
        },
        {
            "resistance_range": {
                "upper": 77,
                "lower": 53
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1535,
                "end": 1565
            }
        },
        {
            "resistance_range": {
                "upper": 77,
                "lower": 53
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1566,
                "end": 1621
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1622,
                "end": 1648
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 60
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1649,
                "end": 1679
            }
        },
        {
            "resistance_range": {
                "upper": 70,
                "lower": 50
            },
            "cadence_range": {
                "upper": 70,
                "lower": 60
            },
            "offsets": {
                "start": 1680,
                "end": 1753
            }
        },
        {
            "resistance_range": {
                "upper": 75,
                "lower": 65
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1754,
                "end": 1773
            }
        },
        {
            "resistance_range": {
                "upper": 77,
                "lower": 66
            },
            "cadence_range": {
                "upper": 90,
                "lower": 80
            },
            "offsets": {
                "start": 1774,
                "end": 1799
            }
        },
        {
            "resistance_range": {
                "upper": 30,
                "lower": 20
            },
            "cadence_range": {
                "upper": 100,
                "lower": 80
            },
            "offsets": {
                "start": 1800,
                "end": 1860
            }
        }
    ],
    "default_album_images": {
        "default_class_detail_image_url": "https://s3.amazonaws.com/peloton-ride-images/DEFAULT_ALBUM_ART_CLASS_DETAIL.svg",
        "default_in_class_image_url": "https://s3.amazonaws.com/peloton-ride-images/DEFAULT_ALBUM_ART_IN_CLASS.svg"
    },
    "is_ftp_test": false,
    "ride": {
        "scheduled_start_time": 1568043000,
        "rating": 0,
        "difficulty_rating_avg": 8.7939,
        "equipment_tags": [],
        "is_favorite": true,
        "difficulty_rating_count": 3658,
        "captions": [
            "en-US"
        ],
        "title": "30 min HIIT Ride",
        "is_explicit": true,
        "live_stream_id": "157bc6faa9ad4ea191e0c905ab9ce6fe-live",
        "origin_locale": "en-US",
        "difficulty_estimate": 8.769981,
        "content_format": "video",
        "location": "nyc",
        "original_air_time": 1568042340,
        "has_closed_captions": true,
        "pedaling_duration": 1800,
        "sample_vod_stream_url": null,
        "extra_images": [],
        "series_id": "3eeb7b9e3a3d4e01b6348da56790bdd2",
        "studio_peloton_id": "ec338e1ac41d4e878bc4358e9583ff0a",
        "total_following_workouts": 0,
        "is_closed_caption_shown": true,
        "vod_stream_url": "http://secure-vh.akamaihd.net/i/vod/bike/09-2019/09092019-olivia-1130am-bb/09092019-olivia-1130am-bb_,2,4,6,8,13,20,30,60,00k.mp4.csmil/master.m3u8",
        "instructor": {
            "is_visible": true,
            "last_name": "Amato",
            "featured_profile": true,
            "list_order": 27,
            "music_bio": "",
            "id": "05735e106f0747d2a112d32678be8afd",
            "first_name": "Olivia",
            "user_id": "9ac4103069284724b054ca26f066e9f0",
            "instagram_profile": "",
            "jumbotron_url_dark": null,
            "jumbotron_url": "https://workout-metric-images-prod.s3.amazonaws.com/ec510252b9f74c0a85e97ef5349d36a4",
            "spotify_playlist_uri": "spotify:user:onepeloton:playlist:6eHoh1Sp7T9nc5lFSA5rW1?si=0Gwb9YlCQA-reLgA4cwinA",
            "web_instructor_list_gif_image_url": null,
            "strava_profile": "",
            "life_style_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/3a3cbbff116d4dd8988cea0888b23e6a",
            "instructor_hero_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/d16abc90e92a477eb4d4201395986bc5",
            "username": "liv_amato",
            "bio": "Born and raised in New York, Olivia grew up playing and excelling at team sports, including lacrosse, field hockey, cheerleading and track. With a professional background in finance, as well as boxing and cycling, she brings a we-first, cheerleader approach to every class, inspiring you to leave each workout walking taller and feeling stronger. ",
            "quote": "“Decide what you want to accomplish, and I will help you conquer it.”",
            "twitter_profile": "",
            "jumbotron_url_ios": "https://workout-metric-images-prod.s3.amazonaws.com/cc7a8c12d0644d8fb994d1b36af0aca8",
            "background": "We’re gonna work, and we’re gonna work hard. Know that I’m in this with you every step of the way. I’m a natural cheerleader, and when we workout together, we’re a team. I will always have your back, no matter how challenging things get! ",
            "film_link": "",
            "web_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/bda95ac755904ce280ee73232322276e",
            "facebook_fan_page": "https://www.facebook.com/OliviaAmatoPeloton/",
            "name": "Olivia Amato",
            "ios_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/5040f6345226437a99e92c310bdbabbd",
            "bike_instructor_list_display_image_url": null,
            "is_filterable": true,
            "about_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/03d8e11f5c4d40d9b01d003e46ff2e77",
            "fitness_disciplines": [
                "running",
                "cycling",
                "circuit"
            ],
            "short_bio": "“Decide what you want to accomplish, and I will help you conquer it.”",
            "ordered_q_and_as": [
                [
                    "How Do You Motivate?",
                    "I like to lead by example. By staying with you throughout class, I can show you that sometimes, all it takes is getting out of your own way to accomplish your goals. You’re going to love the way you feel when we’re done!"
                ],
                [
                    "Outside of Peloton",
                    "My first word was doggy, so you can imagine what my favorite animal is! I also love fashion, family, skincare, being outdoors, and being a crazy plant lady. "
                ],
                [
                    "",
                    ""
                ]
            ],
            "image_url": "https://workout-metric-images-prod.s3.amazonaws.com/d6278b76c3e34c68b4b009d621070daf",
            "coach_type": "peloton_coach"
        },
        "home_peloton_id": "683f37dfa0604791ad71388d4635c464",
        "overall_rating_avg": 0.9736,
        "total_workouts": 8527,
        "image_url": "https://s3.amazonaws.com/peloton-ride-images/d69cf53151911826fcfaee5d652d3302895fe08a/img_1568045256_811ca4fa1f3145a1a8f77572e26f6a51.png",
        "class_type_ids": [
            "7579b9edbdf9464fa19eb58193897a73"
        ],
        "has_free_mode": false,
        "is_live_in_studio_only": false,
        "content_provider": "peloton",
        "is_archived": true,
        "pedaling_end_offset": 1860,
        "live_stream_url": null,
        "sold_out": false,
        "duration": 1800,
        "overall_estimate": 0.977104,
        "has_pedaling_metrics": true,
        "total_ratings": 0,
        "total_user_workouts": 1,
        "ride_type_id": "7579b9edbdf9464fa19eb58193897a73",
        "venues_location_dict": {},
        "instructor_id": "05735e106f0747d2a112d32678be8afd",
        "id": "157bc6faa9ad4ea191e0c905ab9ce6fe",
        "fitness_discipline": "cycling",
        "description": "Efficient and effective, this intervals-driven class boosts metabolism and gives you a heart-healthy workout leaving you full of energy and confidence.  ",
        "ride_type_ids": [
            "7579b9edbdf9464fa19eb58193897a73"
        ],
        "metrics": [
            "heart_rate",
            "cadence",
            "calories"
        ],
        "total_in_progress_workouts": 3,
        "overall_rating_count": 4316,
        "pedaling_start_offset": 60,
        "language": "english",
        "difficulty_level": null,
        "length": 1917,
        "vod_stream_id": "157bc6faa9ad4ea191e0c905ab9ce6fe-vod",
        "equipment_ids": [],
        "fitness_discipline_display_name": "Cycling"
    },
    "averages": {
        "average_avg_resistance": 47,
        "average_distance": 8.67,
        "average_total_work": 259,
        "average_avg_speed": 18.1,
        "average_avg_power": 148,
        "average_calories": 352,
        "average_avg_cadence": 73
    },
    "segments": {
        "segment_body_focus_distribution": {
            "cardio": "1.0"
        },
        "segment_category_distribution": {
            "Cycling Warmup": "0.116666666667",
            "cycling": "0.851666666667",
            "Cycling Cool Down": "0.0316666666667"
        },
        "segment_list": [
            {
                "intensity_in_mets": 3.5,
                "name": "Warmup",
                "start_time_offset": 0,
                "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/segment-icons/warmup.png",
                "icon_name": "warmup",
                "icon_slug": "warmup",
                "length": 210,
                "metrics_type": "cycling",
                "id": "14520b722a44434bb070a2980eeef678"
            },
            {
                "intensity_in_mets": 6.0,
                "name": "Cycling",
                "start_time_offset": 210,
                "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/segment-icons/cycling.png",
                "icon_name": "cycling",
                "icon_slug": "cycling",
                "length": 1533,
                "metrics_type": "cycling",
                "id": "b9d9b5303b73459c8ea49661b1662224"
            },
            {
                "intensity_in_mets": 3.5,
                "name": "Cool Down",
                "start_time_offset": 1743,
                "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/segment-icons/cooldown.png",
                "icon_name": "cooldown",
                "icon_slug": "cooldown",
                "length": 57,
                "metrics_type": "cycling",
                "id": "67608af67592475ab25056d83adf312a"
            }
        ]
    },
    "target_class_metrics": {
        "total_expected_output": {
            "expected_upper_output": 589,
            "expected_lower_output": 231
        },
        "target_graph_metrics": [
            {
                "graph_data": {
                    "upper": [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 120, 120, 120, 120, 120, 90, 90, 90, 90, 90, 90, 90, 90, 110, 110, 110, 110, 110, 110, 110, 90, 90, 90, 90, 90, 110, 110, 110, 110, 110, 110, 90, 90, 90, 90, 90, 90, 110, 110, 110, 110, 115, 115, 90, 90, 90, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 100, 100, 100, 100, 70, 70, 90, 90, 90, 90, 90, 70, 70, 90, 90, 90, 90, 70, 70, 90, 90, 90, 70, 70, 90, 90, 90, 90, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 90, 90, 90, 90, 90, 90, 70, 70, 70, 90, 90, 90, 90, 90, 70, 70, 70, 70, 90, 90, 90, 90, 70, 70, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 70, 70, 70, 70, 70, 70, 90, 90, 90, 90, 90, 90, 70, 70, 70, 90, 90, 90, 90, 90, 90, 70, 70, 70, 90, 90, 90, 90, 90, 90, 70, 70, 70, 90, 90, 90, 90, 90, 90, 90, 70, 70, 90, 90, 90, 90, 90, 90, 90, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 90, 90, 90, 90, 90, 90, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 90, 90, 90, 90, 90, 90, 90, 90, 90, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
                    "lower": [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 110, 110, 110, 110, 110, 80, 80, 80, 80, 80, 80, 80, 80, 100, 100, 100, 100, 100, 100, 100, 80, 80, 80, 80, 80, 100, 100, 100, 100, 100, 100, 80, 80, 80, 80, 80, 80, 100, 100, 100, 100, 105, 105, 80, 80, 80, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 90, 90, 90, 90, 60, 60, 80, 80, 80, 80, 80, 60, 60, 80, 80, 80, 80, 60, 60, 80, 80, 80, 60, 60, 80, 80, 80, 80, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 80, 80, 80, 80, 80, 80, 60, 60, 60, 80, 80, 80, 80, 80, 60, 60, 60, 60, 80, 80, 80, 80, 60, 60, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 60, 60, 60, 60, 60, 60, 80, 80, 80, 80, 80, 80, 60, 60, 60, 80, 80, 80, 80, 80, 80, 60, 60, 60, 80, 80, 80, 80, 80, 80, 60, 60, 60, 80, 80, 80, 80, 80, 80, 80, 60, 60, 80, 80, 80, 80, 80, 80, 80, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 80, 80, 80, 80, 80, 80, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
                    "average": [90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 115, 115, 115, 115, 115, 85, 85, 85, 85, 85, 85, 85, 85, 105, 105, 105, 105, 105, 105, 105, 85, 85, 85, 85, 85, 105, 105, 105, 105, 105, 105, 85, 85, 85, 85, 85, 85, 105, 105, 105, 105, 110, 110, 85, 85, 85, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 95, 95, 95, 95, 65, 65, 85, 85, 85, 85, 85, 65, 65, 85, 85, 85, 85, 65, 65, 85, 85, 85, 65, 65, 85, 85, 85, 85, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 85, 85, 85, 85, 85, 85, 65, 65, 65, 85, 85, 85, 85, 85, 65, 65, 65, 65, 85, 85, 85, 85, 65, 65, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 85, 65, 65, 65, 65, 65, 65, 85, 85, 85, 85, 85, 85, 65, 65, 65, 85, 85, 85, 85, 85, 85, 65, 65, 65, 85, 85, 85, 85, 85, 85, 65, 65, 65, 85, 85, 85, 85, 85, 85, 85, 65, 65, 85, 85, 85, 85, 85, 85, 85, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 85, 85, 85, 85, 85, 85, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 85, 85, 85, 85, 85, 85, 85, 85, 85, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90]
                },
                "average": 83,
                "type": "cadence",
                "max": 120,
                "min": 60
            },
            {
                "graph_data": {
                    "upper": [30, 30, 30, 30, 30, 30, 30, 30, 33, 33, 33, 33, 38, 38, 38, 38, 38, 38, 38, 41, 41, 41, 41, 46, 46, 46, 46, 46, 46, 46, 46, 49, 49, 49, 54, 54, 54, 54, 54, 54, 54, 54, 50, 50, 50, 50, 50, 50, 50, 50, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 45, 45, 45, 45, 45, 45, 55, 55, 55, 60, 60, 60, 50, 50, 50, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 65, 65, 65, 65, 65, 66, 66, 66, 66, 66, 66, 67, 67, 67, 67, 67, 67, 67, 67, 68, 68, 68, 68, 69, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 72, 72, 72, 72, 72, 72, 72, 72, 74, 74, 74, 74, 74, 74, 74, 74, 74, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 52, 52, 40, 40, 40, 40, 40, 40, 50, 50, 50, 50, 52, 52, 40, 40, 40, 40, 40, 40, 50, 50, 50, 52, 52, 52, 52, 40, 40, 40, 40, 40, 65, 75, 75, 75, 75, 75, 77, 77, 55, 55, 55, 55, 55, 55, 65, 65, 65, 65, 65, 55, 55, 50, 50, 50, 50, 60, 60, 60, 60, 60, 62, 62, 50, 50, 50, 50, 50, 55, 55, 55, 55, 55, 55, 50, 50, 50, 70, 70, 70, 70, 70, 70, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 72, 72, 72, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 77, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 75, 75, 75, 75, 77, 77, 77, 77, 77, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                    "lower": [20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 30, 30, 30, 30, 30, 30, 30, 30, 40, 40, 40, 40, 40, 40, 40, 40, 35, 35, 35, 35, 35, 35, 35, 40, 40, 40, 40, 40, 35, 35, 35, 35, 35, 35, 40, 40, 40, 45, 45, 45, 40, 40, 40, 40, 40, 40, 40, 40, 40, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 46, 46, 46, 46, 46, 47, 47, 47, 47, 47, 47, 47, 47, 48, 48, 48, 48, 49, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 51, 51, 51, 51, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 52, 52, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 35, 35, 35, 35, 36, 36, 30, 30, 30, 30, 30, 30, 36, 36, 36, 36, 37, 37, 30, 30, 30, 30, 30, 30, 37, 37, 37, 38, 38, 38, 38, 30, 30, 30, 30, 30, 45, 52, 52, 52, 52, 52, 53, 53, 45, 45, 45, 45, 45, 45, 52, 52, 52, 52, 52, 45, 45, 40, 40, 40, 40, 48, 48, 48, 48, 48, 49, 49, 40, 40, 40, 40, 40, 45, 45, 45, 45, 45, 45, 40, 40, 40, 50, 50, 50, 50, 50, 50, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 51, 51, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 53, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 60, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 65, 65, 65, 65, 66, 66, 66, 66, 66, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
                    "average": [25, 25, 25, 25, 25, 25, 25, 25, 27, 27, 27, 27, 30, 30, 30, 30, 30, 30, 30, 32, 32, 32, 32, 36, 36, 36, 36, 36, 36, 36, 36, 38, 38, 38, 42, 42, 42, 42, 42, 42, 42, 42, 45, 45, 45, 45, 45, 45, 45, 45, 37, 37, 37, 37, 37, 37, 37, 45, 45, 45, 45, 45, 40, 40, 40, 40, 40, 40, 47, 47, 47, 52, 52, 52, 45, 45, 45, 45, 45, 45, 45, 45, 45, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 55, 55, 55, 55, 55, 56, 56, 56, 56, 56, 56, 57, 57, 57, 57, 57, 57, 57, 57, 58, 58, 58, 58, 59, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 61, 61, 61, 61, 61, 61, 61, 63, 63, 63, 63, 63, 63, 63, 63, 63, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 42, 42, 42, 42, 44, 44, 35, 35, 35, 35, 35, 35, 43, 43, 43, 43, 44, 44, 35, 35, 35, 35, 35, 35, 43, 43, 43, 45, 45, 45, 45, 35, 35, 35, 35, 35, 55, 63, 63, 63, 63, 63, 65, 65, 50, 50, 50, 50, 50, 50, 58, 58, 58, 58, 58, 50, 50, 45, 45, 45, 45, 54, 54, 54, 54, 54, 55, 55, 45, 45, 45, 45, 45, 50, 50, 50, 50, 50, 50, 45, 45, 45, 60, 60, 60, 60, 60, 60, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 61, 61, 61, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 60, 60, 60, 60, 60, 65, 65, 65, 65, 65, 65, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 70, 70, 70, 70, 71, 71, 71, 71, 71, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25]
                },
                "average": 49,
                "type": "resistance",
                "max": 77,
                "min": 20
            }
        ]
    },
    "disabled_leaderboard_filters": {
        "following": false,
        "just_me": false,
        "age_and_gender": false
    }
};










