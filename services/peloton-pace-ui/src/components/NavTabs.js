import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { navigate, useRoutes } from 'hookrouter';

import { Button, ButtonGroup } from '@material-ui/core';

import _ from 'lodash';

import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';

import { AuthContext, ReducerActionTypes } from "../App";

const useStyles = makeStyles({
    container: {
        // display: 'grid'
    },
    profileBar: {
        display: 'grid',
        gridTemplateColumns: '5fr 1fr',
        margin: '1rem',
        // height: '1rem',

        // border: '1px solid blue'
    },
    logoutButton: {
        // width: '20%',
        // textAlign: 'right'
    }
});

const NavTabs = (props) => {
    const classes = useStyles();

    console.log('----------   NavTabs props   -------------');
    console.log(props);

    const { dispatch } = useContext(AuthContext);

    const isAuthenticated = window.localStorage.getItem('isAuthenticated');
    const userId = window.localStorage.getItem('userId');
    const userFirstname = window.localStorage.getItem('userFirstname');
    const jwt = window.localStorage.getItem('jwt');

    // console.log(`authenticated = ${authenticated}`);
    // console.log(`authBody = ${authBody}`);

    let lastWorkoutDate;
    let userCreatedDate;
    if (_.has(props, 'pelotonWorkoutOverviewData.data')) {
        lastWorkoutDate = new Date(props.pelotonWorkoutOverviewData.data[0].user.last_workout_at * 1000);        // 1568079303000
        userCreatedDate = new Date(props.pelotonWorkoutOverviewData.data[0].user.created_at * 1000);
    }

    console.log('-------   last workout date   -------------');
    console.log(lastWorkoutDate);

    const handleLogOut = (event) => {
        dispatch({
            type: ReducerActionTypes.LOGOUT
        });

        navigate('/', true);
    };

    return (
        <div>
            <ButtonGroup
                color="primary"
                fullWidth
                size="large"
                variant="outlined"
            >
                <Button onClick={() => navigate('/')}>Peloton Overview</Button>
                <Button onClick={() => navigate('/peloton-workouts')}>Peloton Workouts</Button>
                <Button onClick={() => navigate('/user-profile')}>User Profile</Button>
            </ButtonGroup>

            {isAuthenticated === 'true' &&
            <div className={classes.profileBar}>
                <div style={{lineHeight: '2rem'}}><Button size="large" variant="text">Welcome {userFirstname}!</Button> <span>{lastWorkoutDate && <span><b>Your last workout:</b> {lastWorkoutDate.toDateString()}</span>} | {userCreatedDate && <span><b>Registered since</b> {userCreatedDate.toLocaleDateString()}</span>}</span></div>
                <Button onClick={handleLogOut} variant="outlined">Log Out</Button>
            </div>}
        </div>
    );
};

// export default React.memo(NavTabs);

export default NavTabs;
