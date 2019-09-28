
import React, { useContext, useEffect, useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid,
    Icon, LinearProgress, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography
} from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import ExplicitIcon from '@material-ui/icons/Explicit';

import { navigate } from 'hookrouter';

import { Bar, VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme, VictoryVoronoiContainer } from 'victory';
import _ from 'lodash';
import { PelotonContext } from "./PelotonApp";


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

    const { state, dispatch } = useContext( PelotonContext );

    console.log(`------   PelotonWorkoutDetail  PELOTON CONTEXT STATE   ------`);
    console.log(state);

    // {workoutId: "d4b2edd19b1041ec81ad7cf297573ede"}      rideId

    const classes = useStyles();

    const workoutDetailData = state.pelotonWorkoutDetailData[props.workoutId];

    const initialStateData = {
        isLoading: true,
        errorMessages: []
    };
    const [data, setData] = useState(initialStateData);

    const [workoutId, setWorkoutId] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [explicitClass, setExplicitClass] = useState(false);
    const [cadenceMetrics, setCadenceMetrics] = useState({});
    const [heartRateMetrics, setHeartRateMetrics] = useState({});
    const [caloriesSummary, setCaloriesSummary] = useState({});
    const [cadenceMetricsData, setCadenceMetricsData] = useState({});
    const [heartRateMetricsData, setHeartRateMetricsData] = useState({});


    const workoutStartDate = new Date(workoutDetailData.workoutDetail.start_time * 1000);
    const workoutStartDateString = `${workoutStartDate.toDateString()} @ ${workoutStartDate.toLocaleTimeString()}`;

    useEffect(() => {

        // setWorkoutId(workoutDetail.id);
        setInstructorName(workoutDetailData.rideDetail.ride.instructor.name);
        setExplicitClass(workoutDetailData.rideDetail.ride.is_explicit);

        const cadenceMetrics = _.find(workoutDetailData.workoutMetrics.metrics, (category) => category.slug === 'cadence');
        const heartRateMetrics = _.find(workoutDetailData.workoutMetrics.metrics, (category) => category.slug === 'heart_rate');
        const caloriesSummary = _.find(workoutDetailData.workoutMetrics.summaries, (category) => category.slug === 'calories');

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


        setTimeout(() => {
            setData({
                ...data,
                isLoading: false
            });
        }, 300);


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
            <div style={{fontSize: '1.5rem', backgroundColor: 'whitesmoke', padding: '0.8rem 1rem'}}>{`${instructorName} - ${workoutDetailData.rideDetail.ride.title}`} {explicitClass && <ExplicitIcon color="primary" />}</div>
            <List>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar style={{margin: '1rem'}}>
                        <span>
                            <Avatar onClick={handleClickInstructor} className={classes.bigAvatar} alt={instructorName} src={workoutDetailData.rideDetail.ride.instructor.image_url} />
                            <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>{caloriesSummary.value} {caloriesSummary.display_unit}</div>
                            <div>{`(${(caloriesSummary.value / (workoutDetailData.rideDetail.ride.duration / 60)).toPrecision(3)} kcal / min)`}</div>
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
                                              <b>{`${workoutDetailData.workoutDetail.name} - ${workoutDetailData.workoutDetail.status}`}</b>
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              <b>Live Class Location: </b>{`${workoutDetailData.rideDetail.ride.location.toUpperCase()}`}
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              <b>Difficulty Rating: </b>{`${workoutDetailData.rideDetail.ride.difficulty_rating_avg.toPrecision(2)} based on ${workoutDetailData.rideDetail.ride.difficulty_rating_count} votes`}
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              {`${workoutDetailData.rideDetail.ride.description}`}
                                          </Typography>
                                          <span style={{display: 'flex', margin: '1rem 0 auto', justifyContent: 'space-around'}}>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{workoutDetailData.rideDetail.ride.duration / 60}</Avatar>
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
                        duration: 900,
                        onLoad: { duration: 900 }
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
                        duration: 900,
                        onLoad: { duration: 900 }
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
                        {workoutDetailData.rideDetail.ride.instructor.short_bio}
                    </Typography>
                    {/* <Divider variant="fullWidth" component="hr" /> */}
                    <Typography variant="body1" gutterBottom>
                        {workoutDetailData.rideDetail.ride.instructor.bio}
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
