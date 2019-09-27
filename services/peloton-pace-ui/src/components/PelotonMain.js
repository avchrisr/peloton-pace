import React, {useContext, useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    AppBar, Button, FormControl, FormControlLabel, FormLabel, InputLabel, LinearProgress,
    MenuItem, Radio, RadioGroup, Select, SnackbarContent, TextField, Toolbar, Typography
} from '@material-ui/core';

import { Bar, VictoryBar, VictoryChart, VictoryLabel, VictoryVoronoiContainer, VictoryTheme } from 'victory';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import _ from 'lodash';
import axios from "axios";
import { PelotonContext, PelotonContextReducerActionTypes } from "./PelotonApp";

const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '9090';            // 3001
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

const PelotonMain = (props) => {
    const classes = useStyles();


    console.log('---------------   peloton main props   ---------------');
    console.log(props);

    const { state, dispatch } = useContext( PelotonContext );

    const isAuthenticated = window.localStorage.getItem('isAuthenticated');
    const userId = window.localStorage.getItem('userId');
    const userFirstname = window.localStorage.getItem('userFirstname');
    const jwt = window.localStorage.getItem('jwt');


    console.log(`PelotonMain isAuthenticated = ${isAuthenticated}`);
    console.log(`PelotonMain userId = ${userId}`);
    console.log(`PelotonMain userFirstname = ${userFirstname}`);
    console.log(`PelotonMain jwt = ${jwt}`);

    const initialStateData = {
        pelotonWorkoutDetailData: {},
        isLoading: true,
        errorMessages: []
    };
    const [data, setData] = useState(initialStateData);

    const workedOutDates = [];
    props.pelotonWorkoutOverviewData.data.forEach(workout => {
        workedOutDates.push(new Date(workout.start_time * 1000));
    });

    // const [selectedDays, setSelectedDays] = useState([new Date(2019, 8, 1), new Date(2019, 8, 8)]);            // 1567494000000 (2019-09-03)
    // const [selectedDays, setSelectedDays] = useState([new Date(1567494000000), new Date(1567839600000)]);         // 1567839600000 (2019-09-07)
    const [selectedDays, setSelectedDays] = useState(workedOutDates);

    const [clicked, setClicked] = useState(false);
    const [chartStyle, setChartStyle] = useState({
        data: {
            fill: 'green',
            stroke: 'black',
            strokeWidth: 0.5
        }
    });

    const [chartStyleAvgHeartRate, setChartStyleAvgHeartRate] = useState({
        data: {
            fill: 'tomato',
            // fillOpacity: 0.7,
            stroke: 'black',
            strokeWidth: 0.5
        }
    });


    const handleMouseOver = () => {
        const fillColor = clicked ? "blue" : "tomato";
        chartStyle.data.fill = fillColor;
        setClicked(!clicked);
        setChartStyle(chartStyle);
    };

    const handleDayClick = (day, { selected }) => {
        if (selected) {
            const selectedIndex = selectedDays.findIndex(selectedDay => DateUtils.isSameDay(selectedDay, day));
            selectedDays.splice(selectedIndex, 1);
        } else {
            selectedDays.push(day);
        }
        setSelectedDays(_.cloneDeep(selectedDays));
    };


    const fetchPelotonWorkoutDetailData = async (workoutId) => {

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
        const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/peloton/get-workout-detail/${workoutId}`;  // ?limit=15&page=2

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

            console.log('--------   Peloton Workout Detail Fetch - Error Message   ----------');
            console.log(errorMessage);

            const errorMessages = data.errorMessages;
            errorMessages.push(errorMessage);

            setData({
                ...data,
                errorMessages
            });
        });

        if (res) {
            console.log(`-------------  Peloton Workout Detail Fetch - res.data  ---------------`);
            console.log(res.data);


            // TODO: this 'setData' will be called concurrently by many processes. will it cause any issues?

            // setData({
            //     ...data,
            //     pelotonWorkoutDetailData: {...data.pelotonWorkoutDetailData, [workoutId]: JSON.parse(res.data)},
            //     // isLoading: false
            // });

            // window.localStorage.setItem('pelotonWorkoutDetailData', JSON.stringify(res.data));
        }

        // window.localStorage.setItem('pelotonWorkoutDetailData', JSON.stringify(initialPelotonWorkoutOverviewData));

        // setData({
        //     ...data,
        //     pelotonWorkoutDetailData: initialPelotonWorkoutOverviewData,
        //     isLoading: false
        // });

        return res;
    };


    const [caloriesMetrics, setCaloriesMetrics] = useState({
        isLoading: true,
        data: []
    });


    // const pelotonWorkoutHistoryDataCaloriesBurned = [
//     {
//         x: new Date('2019-06-28'),
//         y: 110
//     },
//     {
//         x: new Date('2019-06-29'),
//         y: 122
//     },
//     {
//         x: new Date('2019-06-30'),
//         y: 195
//     },
//     {
//         x: new Date('2019-07-01'),
//         y: 279
//     },
//     {
//         x: new Date('2019-07-02'),
//         y: 400
//     },
//     {
//         x: new Date('2019-07-05'),
//         y: 359
//     },
//     {
//         x: new Date('2019-07-06'),
//         y: 320
//     },
//     {
//         x: new Date('2019-07-08'),
//         y: 322
//     },
//     {
//         x: new Date('2019-07-09'),
//         y: 395
//     },
//     {
//         x: new Date('2019-07-10'),
//         y: 279
//     },
//     {
//         x: new Date('2019-07-11'),
//         y: 400
//     },
//     {
//         x: new Date('2019-07-13'),
//         y: 359
//     }
// ];

    const pelotonWorkoutHistoryDataCaloriesBurned = [
        {
            x: '6/28',
            y: 110
        },
        {
            x: '6/29',
            y: 122
        },
        {
            x: '6/30',
            y: 195
        },
        {
            x: '7/1',
            y: 279
        },
        {
            x: '7/2',
            y: 400
        },
        {
            x: '7/5',
            y: 359
        },
        {
            x: '7/6',
            y: 320
        },
        {
            x: '7/8',
            y: 322
        },
        {
            x: '7/9',
            y: 395
        },
        {
            x: '7/10',
            y: 279
        },
        {
            x: '7/11',
            y: 400
        },
        {
            x: '7/13',
            y: 359
        }
    ];


    const fetchDetails = async () => {
        props.pelotonWorkoutOverviewData.data.forEach(async (workout) => {
            if (!_.has(state, `pelotonWorkoutDetailData[${workout.id}]`)) {
                const response = await fetchPelotonWorkoutDetailData(workout.id).catch((err) => {

                    console.log(`-------------  fetch peloton workout detail err  ---------------`);
                    console.log(err);
                });

                console.log(`-------------  fetch peloton workout detail response  ---------------`);
                console.log(response);

                dispatch({
                    type: PelotonContextReducerActionTypes.DETAIL,
                    payload: {
                        workoutId: workout.id,
                        data: {
                            workoutDetail: JSON.parse(response.data.workoutDetail),
                            workoutMetrics: JSON.parse(response.data.workoutMetrics),
                            rideDetail: JSON.parse(response.data.rideDetail)
                        }
                    }
                });
            }
        });

        setData({
            ...data,
            isLoading: false
        });
    };

    useEffect(() => {
        fetchDetails();

        // componentWillUnmount equivalent
        return () => {
            // clean up
        }
    }, []);         // empty array [] makes it call only once


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

// const pelotonWorkoutHistoryDataClassDuration = [
//     {
//         x: new Date('2019-06-28'),
//         y: 20
//     },
//     {
//         x: new Date('2019-06-29'),
//         y: 20
//     },
//     {
//         x: new Date('2019-06-30'),
//         y: 20
//     },
//     {
//         x: new Date('2019-07-01'),
//         y: 30
//     },
//     {
//         x: new Date('2019-07-02'),
//         y: 30
//     },
//     {
//         x: new Date('2019-07-05'),
//         y: 30
//     },
//     {
//         x: new Date('2019-07-06'),
//         y: 30
//     },
//     {
//         x: new Date('2019-07-08'),
//         y: 30
//     },
//     {
//         x: new Date('2019-07-09'),
//         y: 30
//     },
//     {
//         x: new Date('2019-07-10'),
//         y: 20
//     },
//     {
//         x: new Date('2019-07-11'),
//         y: 30
//     },
//     {
//         x: new Date('2019-07-13'),
//         y: 30
//     }
// ];


    const pelotonWorkoutHistoryDataClassDuration = [
        {
            x: '6/28',
            y: 20
        },
        {
            x: '6/29',
            y: 20
        },
        {
            x: '6/30',
            y: 20
        },
        {
            x: '7/1',
            y: 30
        },
        {
            x: '7/2',
            y: 30
        },
        {
            x: '7/5',
            y: 30
        },
        {
            x: '7/6',
            y: 30
        },
        {
            x: '7/8',
            y: 30
        },
        {
            x: '7/9',
            y: 30
        },
        {
            x: '7/10',
            y: 20
        },
        {
            x: '7/11',
            y: 30
        },
        {
            x: '7/13',
            y: 30
        }
    ];

    return (
        data.isLoading ? <LinearProgress /> :
            <>
                <div className="">
                    <div className={classes.workoutSummaryHeader}><h2>{props.pelotonWorkoutOverviewData.total} <span>Total Workouts</span></h2></div>
                    <ul className={classes.workoutSummaryIconsWrapper}>
                        {props.pelotonWorkoutOverviewData.data.length > 0 && props.pelotonWorkoutOverviewData.data[0].user.workout_counts.map((category, index) => {
                            return (<li key={index} className={classes.workoutSummaryIcons}><img src={category.icon_url} alt={category.name} /><div className="sc-haEqAx gGCavG"><b>{category.name}</b></div>{category.count}</li>);
                        })}
                    </ul>
                </div>

                <div>
                    <div className={classes.workoutSummaryHeader}><h2>Monthly Activity</h2></div>

                    {/* TODO: make calendar READ-ONLY */}

                    <div style={{textAlign: 'center'}}>
                        <DayPicker
                            selectedDays={selectedDays}
                            onDayClick={handleDayClick}
                        /></div>
                </div>

                <div>
                    <div className={classes.workoutSummaryHeader}><h2>Personal Best</h2></div>
                    <ul className={classes.workoutSummaryIconsWrapper}>
                        <li>
                            <b>Date</b>
                            <div>2019-09-04</div>
                        </li>
                        <li>
                            <b>Duration</b>
                            <div>30 min</div>
                        </li>
                        <li>
                            <b>Calories</b>
                            <div>434 kcal (35 kcal / min)</div>
                        </li>
                        <li>
                            <b>Avg. Heart Rate</b>
                            <div>145 bpm</div>
                        </li>
                        <li>
                            <b>Avg. Cadence</b>
                            <div>90 rpm</div>
                        </li>
                    </ul>
                </div>


                <div className={classes.workoutSummaryHeader}><h2>Summary Charts</h2></div>
                <div className={classes.container}>
                    <div>
                        {/* <div>Calories Burned</div> */}
                        <div>
                            <VictoryChart
                                // horizontal
                                // theme={VictoryTheme.material}
                                width={600} height={300}
                                // padding={{ top: 50, bottom: 50 }}
                                domainPadding={{ x: 20, y: [0, 20] }}
                                // scale={{ x: "time" }}
                                animate={{
                                    duration: 500,
                                    // easing: 'bounce',
                                    onLoad: { duration: 500 }
                                }}
                            >
                                <VictoryLabel text="Calories Burned" x={300} y={10} textAnchor="middle"/>
                                <VictoryBar
                                    // barRatio={0.8}
                                    dataComponent={
                                        // <Bar events={{ onMouseOver: handleMouseOver }}/>
                                        <Bar />
                                    }
                                    style={chartStyle}
                                    data={pelotonWorkoutHistoryDataCaloriesBurned}
                                    labels={({ datum }) => datum.y}
                                    // data={[
                                    //     { x: new Date(1980, 1, 1), y: 9 },
                                    //     { x: new Date(1996, 1, 1), y: 3 },
                                    //     { x: new Date(2006, 1, 1), y: 5 },
                                    //     { x: new Date(2016, 1, 1), y: 4 }
                                    // ]}
                                />
                            </VictoryChart>
                        </div>
                    </div>

                    <div>
                        {/* <div>Avg. Heart Rate (bpm)</div> */}
                        <div>
                            <VictoryChart
                                // horizontal
                                // theme={VictoryTheme.material}
                                // height={800}
                                // width={800}
                                width={600} height={300}
                                domainPadding={{ x: 20, y: [0, 20] }}
                                // scale={{ x: "time" }}
                                animate={{
                                    duration: 500,
                                    onLoad: { duration: 500 }
                                }}
                            >
                                <VictoryLabel text="Avg. Heart Rate (bpm)" x={300} y={10} textAnchor="middle"/>
                                <VictoryBar
                                    // samples={50}
                                    // barRatio={0.8}
                                    dataComponent={
                                        // <Bar events={{ onMouseOver: handleMouseOver }}/>
                                        <Bar />
                                    }
                                    style={chartStyleAvgHeartRate}
                                    data={pelotonWorkoutHistoryDataAvgHeartRate}
                                    labels={({ datum }) => datum.y}

                                    // data={[
                                    //     { x: new Date(1980, 1, 1), y: 9 },
                                    //     { x: new Date(1996, 1, 1), y: 3 },
                                    //     { x: new Date(2006, 1, 1), y: 5 },
                                    //     { x: new Date(2016, 1, 1), y: 4 }
                                    // ]}
                                />
                            </VictoryChart>
                        </div>
                    </div>

                    <div>
                        {/* <div>Class Duration (min)</div> */}
                        <div>
                            <VictoryChart
                                // polar
                                // horizontal
                                // theme={VictoryTheme.material}
                                // height={800}
                                // width={800}
                                width={600} height={200}
                                domainPadding={{ x: 20, y: [0, 20] }}
                                // scale={{ x: "time" }}
                                // animate={{
                                //     duration: 500,
                                //     onLoad: { duration: 500 }
                                // }}
                            >
                                <VictoryLabel text="Class Duration (min)" x={300} y={10} textAnchor="middle"/>
                                <VictoryBar
                                    theme={VictoryTheme.material}
                                    // alignment="middle"
                                    // barRatio={0.8}
                                    // categories={{ x: ["dogs", "cats", "mice"] }}
                                    animate={{
                                        duration: 500,
                                        onLoad: { duration: 500 }
                                    }}
                                    // containerComponent={<VictoryVoronoiContainer/>}
                                    dataComponent={
                                        // <Bar events={{ onMouseOver: handleMouseOver }}/>
                                        <Bar />
                                    }
                                    style={chartStyleAvgHeartRate}
                                    data={pelotonWorkoutHistoryDataClassDuration}
                                    labels={({ datum }) => datum.y}
                                    // labelComponent={<VictoryLabel dy={30}/>}

                                    // data={[
                                    //     { x: new Date(1980, 1, 1), y: 9 },
                                    //     { x: new Date(1996, 1, 1), y: 3 },
                                    //     { x: new Date(2006, 1, 1), y: 5 },
                                    //     { x: new Date(2016, 1, 1), y: 4 }
                                    // ]}
                                />
                            </VictoryChart>
                        </div>
                    </div>

                    <div>
                        {/* <div>Avg. Cadence</div> */}
                        <div>
                            <VictoryChart
                                // polar
                                // horizontal
                                // theme={VictoryTheme.material}
                                // height={800}
                                // width={800}
                                width={600} height={200}
                                domainPadding={{ x: 20, y: [0, 20] }}
                                // scale={{ x: "time" }}
                                // animate={{
                                //     duration: 500,
                                //     onLoad: { duration: 500 }
                                // }}
                            >
                                <VictoryLabel text="Avg. Cadence (rpm)" x={300} y={10} textAnchor="middle"/>
                                <VictoryBar
                                    theme={VictoryTheme.material}
                                    // alignment="middle"
                                    // barRatio={0.8}
                                    // categories={{ x: ["dogs", "cats", "mice"] }}
                                    animate={{
                                        duration: 500,
                                        onLoad: { duration: 500 }
                                    }}
                                    // containerComponent={<VictoryVoronoiContainer/>}
                                    dataComponent={
                                        // <Bar events={{ onMouseOver: handleMouseOver }}/>
                                        <Bar />
                                    }
                                    style={chartStyleAvgHeartRate}
                                    data={pelotonWorkoutHistoryDataClassDuration}
                                    labels={({ datum }) => datum.y}
                                    // labelComponent={<VictoryLabel dy={30}/>}

                                    // data={[
                                    //     { x: new Date(1980, 1, 1), y: 9 },
                                    //     { x: new Date(1996, 1, 1), y: 3 },
                                    //     { x: new Date(2006, 1, 1), y: 5 },
                                    //     { x: new Date(2016, 1, 1), y: 4 }
                                    // ]}
                                />
                            </VictoryChart>
                        </div>
                    </div>
                </div>
            </>
    );
};

export default PelotonMain;
