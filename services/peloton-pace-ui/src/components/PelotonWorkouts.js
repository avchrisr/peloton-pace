
import React, { useContext, useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid, Paper
} from '@material-ui/core';

import { navigate } from 'hookrouter';

import { RootContext } from "../RootContext";

const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '3001';
const REACT_APP_API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        margin: '2rem 1rem',

        //   border: '1px solid blue'
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,

        '&:hover': {
            cursor: 'pointer'
        }
    },
}));

export default function PelotonWorkouts() {
    const classes = useStyles();

    // const { authenticated, setAuthenticated, authBody, setAuthBody, pelotonWorkoutListData, setPelotonWorkoutListData } = useContext(RootContext);


    const handleClick = (props) => {

        console.log('----  workout to list page click props  -----');
        console.log(props);

        navigate(`/peloton-workout-list/${props.month}`);

    };

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {/* <Paper className={classes.paper}> */}
                    <div style={{fontSize: '1.5rem'}}>2019</div>
                    {/* </Paper> */}
                </Grid>
                <Grid item xs={6}>
                    <div className={classes.paper} onClick={() => handleClick({month: 9, year: 2019})}>
                        <div style={{fontSize: '1.5rem', margin: '1rem'}}>September</div>
                        <div style={{margin: '0.5rem auto'}}>Total # of workouts: 12</div>
                        <div style={{margin: '0.5rem auto'}}>Duration: 5 hr 50 min</div>
                        <div style={{margin: '0.5rem auto'}}>Calories: 4848 kcal</div>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper} onClick={() => handleClick({month: 8, year: 2019})}>
                        <div style={{fontSize: '1.5rem', margin: '1rem'}}>August</div>
                        <div style={{margin: '0.5rem auto'}}>Total # of workouts: 12</div>
                        <div style={{margin: '0.5rem auto'}}>Duration: 5 hr 50 min</div>
                        <div style={{margin: '0.5rem auto'}}>Calories: 4848 kcal</div>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div style={{fontSize: '1.5rem', margin: '1rem'}}>July</div>
                        <div style={{margin: '0.5rem auto'}}>Total # of workouts: 12</div>
                        <div style={{margin: '0.5rem auto'}}>Duration: 5 hr 50 min</div>
                        <div style={{margin: '0.5rem auto'}}>Calories: 4848 kcal</div>
                    </Paper>
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
                {/* <Grid item xs={3}>
                    <Paper className={classes.paper}>
                        <div style={{fontSize: '1.5rem', margin: '1rem'}}>June</div>
                        <div style={{margin: '0.5rem auto'}}>Total # of workouts: 12</div>
                        <div style={{margin: '0.5rem auto'}}>Duration: 5 hr 50 min</div>
                        <div style={{margin: '0.5rem auto'}}>Calories: 4848 kcal</div>
                    </Paper>
                </Grid> */}
            </Grid>
        </div>
    );
};
