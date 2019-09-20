
import React, { useContext, useEffect, useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import {
    Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid,
    Icon, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography
} from '@material-ui/core';
import { deepOrange, deepPurple } from '@material-ui/core/colors';

import { navigate } from 'hookrouter';

import { RootContext } from "../RootContext";

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


export default function PelotonWorkoutDetail(props) {

    console.log(`------   workout detail  props   ------`);
    console.log(props);

    // {workoutId: "d4b2edd19b1041ec81ad7cf297573ede"}

    const classes = useStyles();

    const { authenticated, setAuthenticated, authBody, setAuthBody, pelotonWorkoutListData, setPelotonWorkoutListData } = useContext(RootContext);

    const workout = _.find(pelotonWorkoutListData.data, (workout) => workout.id === props.workoutId);

    const initialWorkoutDetail = {
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

    const [workoutDetail, setWorkoutDetail] = useState(initialWorkoutDetail);

    useEffect(() => {
        // componentDidMount equivalent

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


    const workoutId = workout.id;
    const instructorName = workout.ride.instructor.name;
    const explicitClass = workout.ride.is_explicit ? '(explicit)' : '';
    const workoutStartDate = new Date(workout.start_time * 1000);
    const workoutStartDateString = `${workoutStartDate.toDateString()} @ ${workoutStartDate.toLocaleTimeString()}`;

    const cadenceMetrics = _.find(workoutDetail.metrics, (category) => category.slug === 'cadence');
    const heartRateMetrics = _.find(workoutDetail.metrics, (category) => category.slug === 'heart_rate');
    const caloriesSummary = _.find(workoutDetail.summaries, (category) => category.slug === 'calories');

    const cadenceMetricsData = cadenceMetrics.values.map((value, index) => {
        return {x: index * 5, y: value};
    });

    const heartRateMetricsData = heartRateMetrics.values.map((value, index) => {
        return {x: index * 5, y: value};
    });

    console.log(cadenceMetricsData);
    console.log(JSON.stringify(cadenceMetricsData));
    console.log(JSON.stringify(heartRateMetricsData));


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
        <div className={classes.root}>
            <div style={{fontSize: '1.5rem', backgroundColor: 'whitesmoke', padding: '0.8rem 1rem'}}>{`${instructorName} - ${workout.ride.title} ${explicitClass}`}</div>
            <List>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar style={{margin: '1rem'}}>
                        <span>
                            <Avatar onClick={handleClickInstructor} className={classes.bigAvatar} alt={instructorName} src={workout.ride.instructor.image_url} />
                            <div style={{fontSize: '1.5rem', margin: '0.5rem auto'}}>{caloriesSummary.value} {caloriesSummary.display_unit}</div>
                            <div>{`(${(caloriesSummary.value / (workout.ride.duration / 60)).toPrecision(3)} kcal / min)`}</div>
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
                                              <b>{`${workout.name} - ${workout.status}`}</b>
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
                                              <b>Difficulty Rating: </b>{`${workout.ride.difficulty_rating_avg.toPrecision(2)} based on ${workout.ride.difficulty_rating_count} votes`}
                                          </Typography>
                                          <Typography
                                              component="span"
                                              variant="body1"
                                              className={classes.listItem}
                                              color="textPrimary"
                                          >
                                              {`${workout.ride.description}`}
                                          </Typography>
                                          <span style={{display: 'flex', margin: '1rem 0 auto', justifyContent: 'space-around'}}>
                                    <span style={{textAlign: 'center'}}>
                                        <Avatar component="span" className={classes.purpleAvatar}>{workout.ride.duration / 60}</Avatar>
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
                        {workout.ride.instructor.short_bio}
                    </Typography>
                    {/* <Divider variant="fullWidth" component="hr" /> */}
                    <Typography variant="body1" gutterBottom>
                        {workout.ride.instructor.bio}
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
