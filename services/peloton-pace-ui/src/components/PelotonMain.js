import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    AppBar, Button, FormControl, FormControlLabel, FormLabel, InputLabel, LinearProgress,
    MenuItem, Radio, RadioGroup, Select, SnackbarContent, TextField, Toolbar, Typography
} from '@material-ui/core';

import { Bar, VictoryBar, VictoryChart, VictoryLabel, VictoryVoronoiContainer, VictoryTheme } from 'victory';

import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import _ from 'lodash';

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


    const workedOutDates = [];
    props.pelotonWorkoutListData.data.forEach(workout => {
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


    return (
        <>
            <div className="">
                <div className={classes.workoutSummaryHeader}><h2>{props.pelotonWorkoutListData.total} <span>Total Workouts</span></h2></div>
                <ul className={classes.workoutSummaryIconsWrapper}>

                    {props.pelotonWorkoutListData.data.length > 0 && props.pelotonWorkoutListData.data[0].user.workout_counts.map((category, index) => {
                        return (<li key={index} className={classes.workoutSummaryIcons}><img src={category.icon_url} alt={category.name} /><div className="sc-haEqAx gGCavG"><b>{category.name}</b></div>{category.count}</li>);
                    })}

                    {/* <li className={classes.workoutSummaryIcons}><img src="https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png" alt="Cycling" /><div className="sc-haEqAx gGCavG"><b>Cycling</b></div>37</li>
                <li className={classes.workoutSummaryIcons}><img src="https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-meditation2.png" alt="Medication" /><div className="sc-haEqAx gGCavG"><b>Medication</b></div>10</li>
                <li className={classes.workoutSummaryIcons}><img src="https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png" alt="Cycling" /><div className="sc-haEqAx gGCavG"><b>Cycling</b></div>37</li>
                <li className={classes.workoutSummaryIcons}><img src="https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png" alt="Cycling" /><div className="sc-haEqAx gGCavG"><b>Cycling</b></div>37</li>
                <li className={classes.workoutSummaryIcons}><img src="https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png" alt="Cycling" /><div className="sc-haEqAx gGCavG"><b>Cycling</b></div>37</li> */}

                    {/* <li className="workout-summary-icons iDSyse"><span className="sc-haEqAx gGCavG"><svg viewBox="0 0 28 28"><path
                    d="M15.4122767,15.1814981 L18.4935945,16.689145 C18.5693961,16.7258029 18.6175503,16.8025718 18.6175473,16.8867545 L18.6292285,19.6551564 L13.0039784,19.6551564 C12.8316954,19.6543708 12.672162,19.7458082 12.5857929,19.8948417 C12.4994238,20.0438752 12.4994238,20.227719 12.5857929,20.3767525 C12.672162,20.525786 12.8316954,20.6172234 13.0039784,20.6164378 L18.6332789,20.6164378 L18.6382094,21.7814376 C18.6392011,22.0461765 18.85417,22.260254 19.118979,22.2602136 L19.1208592,22.2602136 C19.3863748,22.259161 19.6007724,22.0431355 19.5997485,21.7776882 L19.5791264,16.883005 C19.5792648,16.4325744 19.3217212,16.0217419 18.9161881,15.8254886 L15.8348703,14.3178417 C15.3260342,14.0705499 15.0713999,13.491066 15.2334383,12.9491333 L16.1578836,9.83433491 C16.2457792,9.54247069 16.5140703,9.34225786 16.8189518,9.34101118 L23.0820776,9.34101118 C23.2543607,9.34179676 23.413894,9.25035936 23.5002631,9.1013259 C23.5866323,8.95229243 23.5866323,8.76844856 23.5002631,8.6194151 C23.413894,8.47038164 23.2543607,8.37894424 23.0820776,8.37972982 L16.8189018,8.37972982 C16.0888422,8.38296643 15.4464585,8.86234192 15.2357385,9.56115714 L14.3117632,12.6759555 C14.0147304,13.6679155 14.4807421,14.7288858 15.4122767,15.1814981 Z M16.0967673,7.23068748 C16.306628,7.29639366 16.5252329,7.32994236 16.7451442,7.3301921 C17.8773391,7.33050382 18.8186751,6.45884724 18.9049739,5.33023698 C18.9912728,4.20162672 18.1934023,3.19705076 17.0743159,3.02530764 C15.9552294,2.85356452 14.8927,3.57263003 14.6364164,4.67515319 C14.3801328,5.77767635 15.0166093,6.89147549 16.0967673,7.23068748 Z M15.5958156,4.80822204 C15.7235488,4.3982206 16.0605019,4.08758118 16.4795962,3.99345862 C16.8986904,3.89933606 17.3361645,4.03605023 17.6270291,4.35204062 C17.9178937,4.66803101 18.0178964,5.11522263 17.8893222,5.52496122 L17.8893222,5.52520118 C17.6898883,6.15654389 17.0170698,6.50751741 16.3850017,6.30992493 C15.7529336,6.11233245 15.3999643,5.44068469 15.5958156,4.80822204 Z M8.24957808,22.2602136 L8.24961808,22.2602136 C8.06285273,22.2600998 7.89304555,22.151885 7.81410203,21.9826678 C7.73515851,21.8134506 7.76135896,21.6138411 7.8813001,21.4707157 L13.0758358,15.2711543 C13.2471107,15.0701827 13.5484464,15.0448943 13.7508373,15.2145073 C13.9532281,15.3841204 13.9809396,15.685166 13.8129118,15.8888588 L8.61837611,22.0884202 C8.52693526,22.1974321 8.39188456,22.2603414 8.24957808,22.2602136 Z M8.47870171,9.34101118 C8.3064187,9.34179676 8.14688536,9.25035936 8.06051623,9.1013259 C7.97414709,8.95229243 7.97414709,8.76844856 8.06051623,8.6194151 C8.14688536,8.47038164 8.3064187,8.37894424 8.47870171,8.37972982 L13.4443638,8.37972982 C13.6166468,8.37894424 13.7761801,8.47038164 13.8625493,8.6194151 C13.9489184,8.76844856 13.9489184,8.95229243 13.8625493,9.1013259 C13.7761801,9.25035936 13.6166468,9.34179676 13.4443638,9.34101118 L8.47870171,9.34101118 Z M26.9305245,24.2705828 C27.0203877,24.4189909 27.0232652,24.6043001 26.9380531,24.7554254 C26.852841,24.9065506 26.6927694,25.0000282 26.5192421,25 L2.48083319,25 C2.30731947,24.9999832 2.14727079,24.9065168 2.06202921,24.7554238 C1.97678763,24.6043307 1.97957414,24.4190455 2.06932076,24.2705828 L4.71917402,19.8870506 C4.80641283,19.7431957 4.96242443,19.6552903 5.13069645,19.6551764 L6.72696106,19.6551764 C6.89924407,19.6543908 7.05877741,19.7458282 7.14514654,19.8948617 C7.23151568,20.0438952 7.23151568,20.227739 7.14514654,20.3767725 C7.05877741,20.5258059 6.89924407,20.6172434 6.72696106,20.6164578 L5.40182441,20.6164578 L3.33321109,24.0387086 L25.6671042,24.0387086 L23.5980109,20.6164578 L22.2730842,20.6164578 C22.1008012,20.6172434 21.9412679,20.5258059 21.8548987,20.3767725 C21.7685296,20.227739 21.7685296,20.0438952 21.8548987,19.8948617 C21.9412679,19.7458282 22.1008012,19.6543908 22.2730842,19.6551764 L23.8693888,19.6551764 C24.0376266,19.6551792 24.1936171,19.7431241 24.2806713,19.8870506 L26.9305245,24.2705828 Z"></path></svg></span><span
                    className="sc-tVThF hSHPFK">Yoga</span><span className="sc-gykZtl eqckmE">0</span></li> */}
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
                                data={props.pelotonWorkoutHistoryDataCaloriesBurned}
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
                                data={props.pelotonWorkoutHistoryDataAvgHeartRate}
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
                                data={props.pelotonWorkoutHistoryDataClassDuration}
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
                                data={props.pelotonWorkoutHistoryDataClassDuration}
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
