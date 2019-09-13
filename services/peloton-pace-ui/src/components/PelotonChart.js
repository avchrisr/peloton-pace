
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    AppBar, Button, FormControl, FormControlLabel, FormLabel, InputLabel, LinearProgress,
    MenuItem, Radio, RadioGroup, Select, SnackbarContent, TextField, Toolbar, Typography
} from '@material-ui/core';

import _ from 'lodash';
import axios from 'axios';

import { Bar, VictoryBar, VictoryChart, VictoryLabel, VictoryVoronoiContainer, VictoryTheme } from 'victory';


const isOnlyNumbersRegEx = /^\d+$/;

const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '3001';
const REACT_APP_API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

const useStyles = makeStyles({
    container: {
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

export default function PelotonChart() {
    const classes = useStyles();

    const [fromEnv, setFromEnv] = useState('dev');
    const [toEnv, setToEnv] = useState('dev');
    const [fromType, setFromType] = useState('user');
    const [toType, setToType] = useState('user');
    const [fromUsername, setFromUsername] = useState('');
    const [toUsername, setToUsername] = useState('');
    const [templateIds, setTemplateIds] = useState('');
    const [createOrReplaceSystemTemplate, setCreateOrReplaceSystemTemplate] = useState('create');
    const [systemTemplateIdToReplace, setSystemTemplateIdToReplace] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [submitResponseMessage, setSubmitResponseMessage] = useState('');



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
            x: new Date('2019-06-28'),
            y: 110
        },
        {
            x: new Date('2019-06-29'),
            y: 122
        },
        {
            x: new Date('2019-06-30'),
            y: 195
        },
        {
            x: new Date('2019-07-01'),
            y: 279
        },
        {
            x: new Date('2019-07-02'),
            y: 400
        },
        {
            x: new Date('2019-07-05'),
            y: 359
        },
        {
            x: new Date('2019-07-06'),
            y: 320
        },
        {
            x: new Date('2019-07-08'),
            y: 322
        },
        {
            x: new Date('2019-07-09'),
            y: 395
        },
        {
            x: new Date('2019-07-10'),
            y: 279
        },
        {
            x: new Date('2019-07-11'),
            y: 400
        },
        {
            x: new Date('2019-07-13'),
            y: 359
        }
    ];




    // TODO: round up the y values

    const pelotonWorkoutHistoryDataAvgHeartRate = [
        {
            x: new Date('2019-06-28'),
            y: 117.17
        },
        {
            x: new Date('2019-06-29'),
            y: 151.78
        },
        {
            x: new Date('2019-06-30'),
            y: 137.98
        },
        {
            x: new Date('2019-07-01'),
            y: 150.21
        },
        {
            x: new Date('2019-07-02'),
            y: 148.43
        },
        {
            x: new Date('2019-07-05'),
            y: 134.1
        },
        {
            x: new Date('2019-07-06'),
            y: 158.58
        },
        {
            x: new Date('2019-07-08'),
            y: 160.07
        },
        {
            x: new Date('2019-07-09'),
            y: 151.01
        },
        {
            x: new Date('2019-07-10'),
            y: 155.08
        },
        {
            x: new Date('2019-07-11'),
            y: 153.52
        },
        {
            x: new Date('2019-07-13'),
            y: 147.54
        }
    ];

    const pelotonWorkoutHistoryDataClassDuration = [
        {
            x: new Date('2019-06-28'),
            y: 20
        },
        {
            x: new Date('2019-06-29'),
            y: 20
        },
        {
            x: new Date('2019-06-30'),
            y: 20
        },
        {
            x: new Date('2019-07-01'),
            y: 30
        },
        {
            x: new Date('2019-07-02'),
            y: 30
        },
        {
            x: new Date('2019-07-05'),
            y: 30
        },
        {
            x: new Date('2019-07-06'),
            y: 30
        },
        {
            x: new Date('2019-07-08'),
            y: 30
        },
        {
            x: new Date('2019-07-09'),
            y: 30
        },
        {
            x: new Date('2019-07-10'),
            y: 20
        },
        {
            x: new Date('2019-07-11'),
            y: 30
        },
        {
            x: new Date('2019-07-13'),
            y: 30
        }
    ];


    // const pelotonWorkoutHistoryDataClassDuration = [
    //     {
    //         x: '6/28',
    //         y: 20
    //     },
    //     {
    //         x: '6/29',
    //         y: 20
    //     },
    //     {
    //         x: '6/30',
    //         y: 20
    //     },
    //     {
    //         x: '7/1',
    //         y: 30
    //     },
    //     {
    //         x: '7/2',
    //         y: 30
    //     },
    //     {
    //         x: '7/5',
    //         y: 30
    //     },
    //     {
    //         x: '7/6',
    //         y: 30
    //     },
    //     {
    //         x: '7/8',
    //         y: 30
    //     },
    //     {
    //         x: '7/9',
    //         y: 30
    //     },
    //     {
    //         x: '7/10',
    //         y: 20
    //     },
    //     {
    //         x: '7/11',
    //         y: 30
    //     },
    //     {
    //         x: '7/13',
    //         y: 30
    //     }
    // ];



    const handleMouseOver = () => {
        const fillColor = clicked ? "blue" : "tomato";
        chartStyle.data.fill = fillColor;
        setClicked(!clicked);
        setChartStyle(chartStyle);
    };





    const handleInputValueChange = (event) => {
        switch (event.target.name) {
            case 'fromEnv':
                setFromEnv(event.target.value);
                break;
            case 'toEnv':
                setToEnv(event.target.value);
                break;
            case 'fromType':
                setFromType(event.target.value);
                if (event.target.value === 'system') {
                    setFromUsername('');
                }
                break;
            case 'toType':
                setToType(event.target.value);
                if (event.target.value === 'system') {
                    setToUsername('');
                }
                break;
            case 'fromUsername':
                setFromUsername(event.target.value);
                break;
            case 'toUsername':
                setToUsername(event.target.value);
                break;
            case 'templateIds':
                setTemplateIds(event.target.value);
                break;
            case 'createOrReplaceSystemTemplate':
                setCreateOrReplaceSystemTemplate(event.target.value);
                if (event.target.value === 'create') {
                    setSystemTemplateIdToReplace('');
                }
                break;
            case 'systemTemplateIdToReplace':
                setSystemTemplateIdToReplace(event.target.value);
                break;
            default:
                console.log(`Error - Unrecognized event.target.name = ${event.target.name}`);
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const templateIdsToCopy = [];
        let templateIdsArray;
        let systemTemplateId;

        // INPUT VALIDATION
        const errorMessages = [];

        if (fromType === 'user' && _.isEmpty(fromUsername.trim())) {
            errorMessages.push(`"FromUsername" is required.`);
        }
        if (toType === 'user' && _.isEmpty(toUsername.trim())) {
            errorMessages.push(`"ToUsername" is required.`);
        }
        if (fromType === 'user' && toType === 'user' &&
            !_.isEmpty(fromUsername.trim()) &&
            (fromUsername.trim() === toUsername.trim())) {
            errorMessages.push(`"ToUsername" must be different from "FromUsername".`);
        }
        if (fromType === 'system' && toType === 'system') {
            errorMessages.push(`System templates cannot be copied to System`);
        }

        if (createOrReplaceSystemTemplate === 'replace') {
            systemTemplateId = systemTemplateIdToReplace.trim();

            if (_.isEmpty(systemTemplateId)) {
                errorMessages.push(`When replacing an existing System Template, the System Template ID to replace is required.`);
            } else {
                if (!isOnlyNumbersRegEx.test(systemTemplateId) || !_.isInteger(_.toFinite(systemTemplateId))) {
                    errorMessages.push(`"${systemTemplateId}" is not a valid template ID as it is not an integer number.`);
                }
            }
        }

        if (_.isEmpty(templateIds.trim())) {
            errorMessages.push(`At least one Template ID is required.`);
        } else {
            templateIdsArray = templateIds.split(',');

            templateIdsArray.forEach((id) => {
                id = id.trim();
                if (!isOnlyNumbersRegEx.test(id) || !_.isInteger(_.toFinite(id))) {
                    errorMessages.push(`"${id}" is not a valid template ID as it is not an integer number.`);
                } else if (id === systemTemplateId) {
                    errorMessages.push(`Template ID being copied from, and Template ID being replaced cannot be the same.`);
                } else {
                    templateIdsToCopy.push(parseInt(id));
                }
            });

            if (templateIdsArray.length > 1 && toType === 'system' && createOrReplaceSystemTemplate === 'replace') {
                errorMessages.push(`When copying multiple User templates to System, it must be "Create New System Template"`);
            }
        }

        if (errorMessages.length > 0) {
            setErrorMessages(errorMessages);
            return;
        }

        // disable the button until search results comes back
        setLoading(true);
        setErrorMessages([]);


        // setTimeout(() => {
        //     handleReset();
        // }, 4000);



        const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/templates/copy-templates`;

        const requestBody = {
            fromEnvironment: fromEnv,
            toEnvironment: toEnv,
            fromType,
            toType,
            fromUsername,
            toUsername,
            templateIds: templateIdsToCopy,
            createNewSystemTemplate: createOrReplaceSystemTemplate === 'create',
            systemTemplateIdToReplace: systemTemplateIdToReplace
        };


        // TODO: implement user login and proper JWT usage
        const jwt = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjaHJpc3IiLCJpYXQiOjE1Njc1NDU3MjAsImV4cCI6MTU2ODE1MDUyMH0.ps-dOeKe4BA7hbZ7EWWfFHG-H-FQxMtRFhhaap2LIzaL_cQkbY2lXZuGdkWLgPkqw558tmZFXv_i478Jxavxgg';


        const options = {
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            },
            data: requestBody,
            timeout: 15000,
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

            setErrorMessages([errorMessage]);
        });

        if (res) {
            console.log(`-------------  res.data  ---------------`);
            console.log(JSON.stringify(res.data, null, 4));

            setSubmitResponseMessage(res.data.message);
        }

        setLoading(false);
    };

    const handleReset = () => {
        setFromEnv('dev');
        setToEnv('dev');
        setFromType('user');
        setToType('user');
        setFromUsername('');
        setToUsername('');
        setTemplateIds('');
        setCreateOrReplaceSystemTemplate('create');
        setSystemTemplateIdToReplace('');
        setLoading(false);
        setErrorMessages([]);
    };



    return (
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
                        scale={{ x: "time" }}
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
                {/* <div>Avg. Heart Rate</div> */}
                <div>
                    <VictoryChart
                        // horizontal
                        // theme={VictoryTheme.material}
                        // height={800}
                        // width={800}
                        width={600} height={300}
                        domainPadding={{ x: 20, y: [0, 20] }}
                        scale={{ x: "time" }}
                        animate={{
                            duration: 500,
                            onLoad: { duration: 500 }
                        }}
                    >
                        <VictoryLabel text="Avg. Heart Rate" x={300} y={10} textAnchor="middle"/>
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
                        scale={{ x: "time" }}
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
        </div>
    );
};
