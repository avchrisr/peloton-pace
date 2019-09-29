
import React, { useContext, useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid,
    Icon, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography
} from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import ExplicitIcon from '@material-ui/icons/Explicit';

import { navigate } from 'hookrouter';
import { PelotonContext } from "./PelotonApp";

const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '19999';
const REACT_APP_API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const useStyles = makeStyles(theme => ({
    // root: {
    //     width: '100%',
    //     // maxWidth: 360,
    //     // backgroundColor: theme.palette.background.paper,
    //   },
    inline: {
        display: 'inline',
    },

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
    },
    purpleAvatar: {
        margin: '0 auto',
        width: 60,
        height: 60,
        color: '#fff',
        backgroundColor: deepPurple[400],
    },
    listItemTitle: {
        display: 'block',

        '&:hover': {
            cursor: 'pointer'
        }
    },
    listItem: {
        display: 'block',

        '&:hover': {
            // cursor: 'pointer'
        }
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

const PelotonWorkoutList = (props) => {
    const classes = useStyles();

    console.log(`------   PelotonWorkoutList  props   ------`);
    console.log(props);


    const { state, dispatch } = useContext( PelotonContext );

    const pelotonWorkoutOverviewData = state.pelotonWorkoutOverviewData;

    console.log(`------   PelotonWorkoutList  pelotonWorkoutOverviewData   ------`);
    console.log(pelotonWorkoutOverviewData);


    const handleClick = (clickProps) => {

        console.log(`-----   workoutlist props CLICK   -----`);
        console.log(clickProps);

        navigate(`/peloton-workout-detail/${clickProps.workout.id}`);
    };

    return (
        <div className={classes.root}>
            <div style={{fontSize: '1.5rem', backgroundColor: 'whitesmoke', padding: '0.8rem 1rem'}}>{pelotonWorkoutOverviewData.total} Total Workouts</div>
            <List>
                {pelotonWorkoutOverviewData.data.map((workout) => {

                    const workoutId = workout.id;
                    const rideId = workout.ride.id;
                    const instructorName = workout.ride.instructor.name;
                    const workoutStartDate = new Date(workout.start_time * 1000);
                    const workoutStartDateString = `${workoutStartDate.toDateString()} @ ${workoutStartDate.toLocaleTimeString()}`;

                    return (
                        <span key={workout.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar style={{margin: '1.5rem'}}>
                                <span>
                                    <Avatar className={classes.bigAvatar} alt={instructorName} src={workout.ride.instructor.image_url} />
                                    {/*<div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>408 kcal</div>*/}
                                    {/*<div>(15 kcal / min)</div>*/}
                                </span>
                            </ListItemAvatar>
                            <ListItemText style={{margin: '1rem'}}
                                          secondary={
                                              <React.Fragment>
                                                  <Typography
                                                      component="span"
                                                      variant="h6"
                                                      className={classes.listItemTitle}
                                                      color="textPrimary"
                                                      onClick={() => handleClick({workout})}
                                                  >
                                                      <span style={{lineHeight: '2rem'}}>{`${instructorName} - ${workout.ride.title}`} {workout.ride.is_explicit && <ExplicitIcon color="primary" />}</span>
                                                      {/* Emma Lovewell - 30 min Trap Music Ride */}
                                                  </Typography>
                                                  <Typography
                                                      component="span"
                                                      variant="body1"
                                                      className={classes.listItem}
                                                      color="textPrimary"
                                                  >
                                                      <b>Live Class Location: </b>{`${workout.ride.location.toUpperCase()}`}
                                                  </Typography>
                                                  <Typography
                                                      component="span"
                                                      variant="body1"
                                                      className={classes.listItem}
                                                      color="textPrimary"
                                                  >
                                                      {`${workout.name} - ${workout.status}`}
                                                  </Typography>
                                                  <Typography
                                                      component="span"
                                                      variant="body1"
                                                      className={classes.listItem}
                                                      color="textPrimary"
                                                  >
                                                      {workoutStartDateString}
                                                      {/* Wednesday, July 24, 2019 @ 6:40 PM */}
                                                  </Typography>
                                                  {/*<span style={{display: 'flex', margin: '1rem 0 auto', justifyContent: 'space-around'}}>*/}
                                                  {/*      <span style={{textAlign: 'center'}}>*/}
                                                  {/*          <Avatar component="span" className={classes.purpleAvatar}>{workout.ride.duration / 60}</Avatar>*/}
                                                  {/*          <span>Duration</span>*/}
                                                  {/*      </span>*/}
                                                  {/*      <span style={{textAlign: 'center'}}>*/}
                                                  {/*          <Avatar component="span" className={classes.purpleAvatar}>408</Avatar>*/}
                                                  {/*          <span>Calories</span>*/}
                                                  {/*      </span>*/}
                                                  {/*      <span style={{textAlign: 'center'}}>*/}
                                                  {/*          <Avatar component="span" className={classes.purpleAvatar}>145</Avatar>*/}
                                                  {/*          <span>Avg. Heart Rate</span>*/}
                                                  {/*      </span>*/}
                                                  {/*      <span style={{textAlign: 'center'}}>*/}
                                                  {/*          <Avatar component="span" className={classes.purpleAvatar}>155</Avatar>*/}
                                                  {/*          <span>Max Heart Rate</span>*/}
                                                  {/*      </span>*/}
                                                  {/*      <span style={{textAlign: 'center'}}>*/}
                                                  {/*          <Avatar component="span" className={classes.purpleAvatar}>70</Avatar>*/}
                                                  {/*          <span>Avg. Cadence</span>*/}
                                                  {/*      </span>*/}
                                                  {/*      <span style={{textAlign: 'center'}}>*/}
                                                  {/*          <Avatar component="span" className={classes.purpleAvatar}>100</Avatar>*/}
                                                  {/*          <span>Max Cadence</span>*/}
                                                  {/*      </span>*/}
                                                  {/*  </span>*/}
                                              </React.Fragment>
                                          }
                            />
                        </ListItem>
                        <Divider variant="middle" component="li" />
                    </span>
                    );
                })}
            </List>
        </div>
    );
};

export default PelotonWorkoutList;


{/* <Grid container spacing={1}>
                <Grid item xs={12}>
                    <div className={classes.paper}>
                        <div style={{fontSize: '1.5rem', backgroundColor: 'whitesmoke', padding: '0.5rem 0'}}>2019</div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.paper2}>
                        <Avatar className={classes.bigAvatar} alt="Olivia Amato" src="https://workout-metric-images-prod.s3.amazonaws.com/d6278b76c3e34c68b4b009d621070daf" />
                        <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>408 kcal</div>
                        <div style={{margin: '0.5rem auto'}}>(15 kcal / min)</div>
                    </div>
                    <div className={classes.paper22}>
                        <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>Emma Lovewell - Interval</div>
                        <div style={{margin: '0.5rem auto'}}>30 min Trap Music Ride</div>
                        <div style={{margin: '0.5rem auto'}}>Wednesday, July 24, 2019 @ 6:40 PM</div>
                        <div style={{margin: '0.5rem auto'}}>Live on Monday, July 22, 2019 @ 1:55 PM</div>

                        <div style={{display: 'flex', margin: '1rem auto', justifyContent: 'space-around'}}>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Duration</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Calories</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>145</Avatar>
                                <span>Avg. Heart Rate</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>155</Avatar>
                                <span>Max Heart Rate</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Avg. Cadence</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Max Cadence</span>
                            </span>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div className={classes.paper}>
                        <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>Emma Lovewell - Interval</div>
                        <div style={{margin: '0.5rem auto'}}>30 min Trap Music Ride</div>
                        <div style={{margin: '0.5rem auto'}}>Wednesday, July 24, 2019 @ 6:40 PM</div>
                        <div style={{margin: '0.5rem auto'}}>Live on Monday, July 22, 2019 @ 1:55 PM</div>

                        <div style={{display: 'flex', margin: '1rem auto', justifyContent: 'space-around'}}>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Duration</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Calories</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>145</Avatar>
                                <span>Avg. Heart Rate</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>155</Avatar>
                                <span>Max Heart Rate</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Avg. Cadence</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Max Cadence</span>
                            </span>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className={classes.paper}>
                        <Avatar className={classes.bigAvatar} alt="Olivia Amato" src="https://workout-metric-images-prod.s3.amazonaws.com/d6278b76c3e34c68b4b009d621070daf" />
                        <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>408 kcal</div>
                        <div style={{margin: '0.5rem auto'}}>(15 kcal / min)</div>
                    </div>
                </Grid>
                <Grid item xs={9}>
                    <div className={classes.paper}>
                        <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>Emma Lovewell - Interval</div>
                        <div style={{margin: '0.5rem auto'}}>30 min Trap Music Ride</div>
                        <div style={{margin: '0.5rem auto'}}>Wednesday, July 24, 2019 @ 6:40 PM</div>
                        <div style={{margin: '0.5rem auto'}}>Live on Monday, July 22, 2019 @ 1:55 PM</div>

                        <div style={{display: 'flex', margin: '1rem auto', justifyContent: 'space-around'}}>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Duration</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Calories</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>145</Avatar>
                                <span>Avg. Heart Rate</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>155</Avatar>
                                <span>Max Heart Rate</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Avg. Cadence</span>
                            </span>
                            <span>
                                <Avatar className={classes.purpleAvatar}>30</Avatar>
                                <span>Max Cadence</span>
                            </span>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div style={{fontSize: '1.5rem', margin: '1rem'}}>June</div>
                        <div style={{margin: '0.5rem auto'}}>Total # of workouts: 12</div>
                        <div style={{margin: '0.5rem auto'}}>Duration: 5 hr 50 min</div>
                        <div style={{margin: '0.5rem auto'}}>Calories: 4848 kcal</div>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div style={{fontSize: '1.5rem', margin: '1rem'}}>May</div>
                        <div style={{margin: '0.5rem auto'}}>Total # of workouts: 12</div>
                        <div style={{margin: '0.5rem auto'}}>Duration: 5 hr 50 min</div>
                        <div style={{margin: '0.5rem auto'}}>Calories: 4848 kcal</div>
                    </Paper>
                </Grid>
            </Grid> */}