import React, {useContext, useEffect, useReducer, useState} from 'react';
import { makeStyles } from '@material-ui/styles';

import {LinearProgress, SnackbarContent} from '@material-ui/core';

import NavTabs from './NavTabs';
import PelotonMain from './PelotonMain';
import UserProfile from './UserProfile';

import _ from 'lodash';
import axios from 'axios';
import { AuthContext } from "../App";
import PelotonWorkoutList from "./PelotonWorkoutList";
import PelotonWorkoutDetail from "./PelotonWorkoutDetail";
import { navigate, useRoutes } from 'hookrouter';

const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '19999';
const REACT_APP_API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const useStyles = makeStyles({
    container: {

        // display: 'flex',
        // justifyContent: 'center',


        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        // gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',

        gridRowGap: '15px',

        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // flexWrap: 'wrap',

        margin: '2rem',

        // width: '800px',
        // border: '2px solid blue',

        // nested selectors
        '& div': {
            // background: '#eee',
            // padding: '1em'
            // border: '1px solid red'
        }
    },
    workoutSummaryHeader: {
        margin: '2rem 0',
        padding: '0.1rem 0',
        textAlign: 'center',
        backgroundColor: 'whitesmoke'
    },
    workoutSummaryIconsWrapper: {
        display: 'flex',
        // justifyContent: 'space-around',
        justifyContent: 'space-evenly',

        listStyle: 'none',

        textAlign: 'center',

        '& li': {
            // display: 'inline'
        }
    },
    workoutSummaryIcons: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        '& img': {
            width: '80px',
            height: '80px',
        }
    },

    buttons: {
        display: 'grid',
        gridTemplateColumns: '100px 100px',
        gridGap: '1rem',
        marginTop: '2rem'
        // gridTemplateColumns: 'minmax(1fr, auto) minmax(1fr, auto)',
    },
    errorMessage: {
        color: 'red',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridRowGap: '10px',
        marginTop: '20px'

        // border: '1px solid red',
    }
});

const routes = {
    // '/': () => <PelotonApp />,
    '/user-profile': () => <UserProfile />,
    '/peloton-workouts': () => <PelotonWorkoutList />,
    '/peloton-workout-detail/:workoutId': ({workoutId}) => <PelotonWorkoutDetail workoutId={workoutId} />
};


export const PelotonContext = React.createContext();

export const PelotonContextReducerActionTypes = {
    OVERVIEW: 'OVERVIEW',
    DETAIL: 'DETAIL'
};

const initialContextState = {
    pelotonWorkoutOverviewData: {},
    pelotonWorkoutDetailData: {}
};

const reducer = (state, action) => {
    switch (action.type) {
        case PelotonContextReducerActionTypes.OVERVIEW:
            return {
                ...state,
                pelotonWorkoutOverviewData: action.payload
            };
        case PelotonContextReducerActionTypes.DETAIL:
            const pelotonWorkoutDetailData = state.pelotonWorkoutDetailData;
            pelotonWorkoutDetailData[action.payload.workoutId] = action.payload.data;
            return {
                ...state,
                pelotonWorkoutDetailData
            };
        default:
            return state;
    }
};

const PelotonApp = (props) => {
    const classes = useStyles();

    const routeResult = useRoutes(routes);

    const [state, dispatch] = useReducer(reducer, initialContextState);


    console.log('--------   PelotonApp routeResult   ----------');
    console.log(routeResult);

    console.log('----------   peloton app props   -------------');
    console.log(props);

    const {state: authState} = useContext(AuthContext);     //  DOES NOT WORK

    console.log('------------   PelotonApp AuthState   --------------');
    console.log(authState);


    const isAuthenticated = window.localStorage.getItem('isAuthenticated');
    const userId = window.localStorage.getItem('userId');
    const username = window.localStorage.getItem('username');
    const userFirstname = window.localStorage.getItem('userFirstname');
    const jwt = window.localStorage.getItem('jwt');

    console.log(`PelotonApp isAuthenticated = ${isAuthenticated}`);
    console.log(`PelotonApp userId = ${userId}`);
    console.log(`PelotonApp username = ${username}`);
    console.log(`PelotonApp userFirstname = ${userFirstname}`);
    console.log(`PelotonApp jwt = ${jwt}`);


    const initialStateData = {
        isLoading: true,
        errorMessages: []
    };
    const [data, setData] = useState(initialStateData);


    const fetchPelotonWorkoutData = async () => {

        /*
        {
            "id": 2,
            "userId": "a5a7e230614842e98b6205b80fb79fa6",
            "username": "SpinninChris",
            "sessionId": "04a0989e39cb4f0f86c56f4ef2a4bae3",
            "pelotonPaceUsername": "chrisr@email.com"
        }
         */

        // const pelotonUserId = 'a5a7e230614842e98b6205b80fb79fa6';
        // const pelotonSessionId = '176b1e04d8054c70820d8981b613b0e1';

        // // call to retrieve the user info
        const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION
        }/peloton-dashboard/peloton-pace-service/peloton/get-workout-summary?pelotonPaceUsername=${username}`;  // ?limit=15&page=2

        const options = {
            url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            // data: requestBody,
            timeout: 5000,
            // auth: {
            //     username: environment.username,
            //     password: environment.password
            // }
        };

        console.log(`URL = ${url}`);

        const res = await axios(options).catch((err) => {
            console.log(`-------------  AXIOS ERROR  ---------------`);
            console.log(err);
            console.log(JSON.stringify(err, null, 4));
            console.log(`-------------  ERROR RESPONSE  ---------------`);
            console.log(err.response);

            const errorMessage = _.get(err, 'response.data.message') || _.get(err, 'message');

            console.log('--------   Peloton Workout Fetch - Error Message   ----------');
            console.log(errorMessage);

            setData({
                ...data,
                errorMessages: [errorMessage],
                isLoading: false
            });
        });

        if (res) {
            console.log(`-------------  Peloton Workout Fetch - res.data  ---------------`);
            console.log(res.data);
            // console.log(JSON.stringify(res.data, null, 4));

            setData({
                ...data,
                // pelotonWorkoutOverviewData: res.data,
                isLoading: false
            });

            dispatch({
                type: PelotonContextReducerActionTypes.OVERVIEW,
                payload: res.data
            });
        }
    };

    useEffect(() => {

        // TODO: create a button to "refresh / refetch" ?

        if (_.isEmpty(state.pelotonWorkoutOverviewData)) {
            fetchPelotonWorkoutData();
        }

        // componentWillUnmount equivalent
        return () => {
            // clean up
        }
    }, []);         // empty array [] makes it call only once


    console.log(`PelotonApp window.location.pathname = ${window.location.pathname}`);

    return (
        data.isLoading ? <LinearProgress /> :
            <PelotonContext.Provider value={{ state, dispatch }}>
                <div>
                    <NavTabs
                        pelotonWorkoutOverviewData={state.pelotonWorkoutOverviewData}
                    />

                    {window.location.pathname === '/' && _.has(state, 'pelotonWorkoutOverviewData.data') && <PelotonMain pelotonWorkoutOverviewData={state.pelotonWorkoutOverviewData} />}
                    {window.location.pathname !== '/' && routeResult || <div>404 NOT FOUND</div>}

                    {data.errorMessages.length > 0 && <div className={classes.errorMessagesContainer}>{data.errorMessages.map((errorMessage, index) => (<SnackbarContent
                        className={classes.errorMessage}
                        message={errorMessage}
                        key={index}
                    />))}</div>}
                </div>
            </PelotonContext.Provider>
    );
};

export default PelotonApp;
