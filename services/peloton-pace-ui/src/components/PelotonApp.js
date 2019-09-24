import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import {LinearProgress, SnackbarContent} from '@material-ui/core';

import NavTabs from './NavTabs';
import PelotonMain from './PelotonMain';
import PelotonWorkouts from './PelotonWorkouts';
import UserProfile from './UserProfile';

import _ from 'lodash';
import axios from 'axios';
import {AuthContext} from "../App";
import PelotonWorkoutList from "./PelotonWorkoutList";
import PelotonWorkoutDetail from "./PelotonWorkoutDetail";
import { navigate, useRoutes } from 'hookrouter';

const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '3001';
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
    '/user-profile': () => <UserProfile a={true}/>,
    // '/': () => <PelotonMain />,
    // '/peloton-main': () => <PelotonMain />,
    // '/peloton-workouts': () => <PelotonWorkouts />,
    '/peloton-workouts': () => <PelotonWorkoutList />,
    // '/peloton-workout-list/:month': ({month}) => <PelotonWorkoutList month={month} />,
    '/peloton-workout-detail/:workoutId': ({workoutId}) => <PelotonWorkoutDetail workoutId={workoutId} />
};

const PelotonApp = (props) => {
    const classes = useStyles();

    const routeResult = useRoutes(routes);

    console.log('--------   PelotonApp routeResult   ----------');
    console.log(routeResult);

    console.log('----------   peloton app props   -------------');
    console.log(props);

    const {state: authState} = useContext(AuthContext);     //  DOES NOT WORK

    console.log('------------   PelotonApp AuthState   --------------');
    console.log(authState);


    const isAuthenticated = window.localStorage.getItem('isAuthenticated');
    const userId = window.localStorage.getItem('userId');
    const userFirstname = window.localStorage.getItem('userFirstname');
    const jwt = window.localStorage.getItem('jwt');

    console.log(`PelotonApp isAuthenticated = ${isAuthenticated}`);
    console.log(`PelotonApp userId = ${userId}`);
    console.log(`PelotonApp userFirstname = ${userFirstname}`);
    console.log(`PelotonApp jwt = ${jwt}`);


    const initialPelotonWorkoutOverviewData = {
        "count": 5,
        "summary": {
            "2019-08": 7,
            "2019-09": 2,
            "2019-06": 22,
            "2019-07": 23
        },
        "page_count": 11,
        "show_next": true,
        "next": {
            "created_at": 1566151377,
            "workout_id": "897d86bcc21247538ac1774220212063"
        },
        "show_previous": false,
        "sort_by": "-created_at,-pk",
        "limit": 5,
        "aggregate_stats": [],
        "total": 54,
        "data": [
            {
                "status": "COMPLETE",
                "start_time": 1568079393,
                "workout_type": "class",
                "total_work": 0.0,
                "is_total_work_personal_record": false,
                "device_type": "iPad",
                "timezone": "America/Los_Angeles",
                "device_time_created_at": 1568054103,
                "user": {
                    "block_explicit": false,
                    "username": "SpinninChris",
                    "total_workouts": 54,
                    "total_pedaling_metric_workouts": 0,
                    "is_profile_private": false,
                    "created_at": 1560616971,
                    "total_non_pedaling_metric_workouts": 54,
                    "is_provisional": false,
                    "last_workout_at": 1568079303,
                    "image_url": "https://res.cloudinary.com/peloton-cycle/image/upload/l_default_user_images:chars:s,f_jpg/default_user_images/backgrounds/10",
                    "location": "Aliso Viejo, CA",
                    "total_followers": 0,
                    "workout_counts": [
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-walking2.png",
                            "name": "Walking",
                            "slug": "walking"
                        },
                        {
                            "count": 2,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-strength2.png",
                            "name": "Strength",
                            "slug": "strength"
                        },
                        {
                            "count": 36,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png",
                            "name": "Cycling",
                            "slug": "cycling"
                        },
                        {
                            "count": 6,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-stretching2.png",
                            "name": "Stretching",
                            "slug": "stretching"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-running2.png",
                            "name": "Running",
                            "slug": "running"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-circuit2.png",
                            "name": "Bootcamp",
                            "slug": "circuit"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-yoga2.png",
                            "name": "Yoga",
                            "slug": "yoga"
                        },
                        {
                            "count": 10,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-meditation2.png",
                            "name": "Meditation",
                            "slug": "meditation"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-cardio2.png",
                            "name": "Cardio",
                            "slug": "cardio"
                        }
                    ],
                    "id": "a5a7e230614842e98b6205b80fb79fa6",
                    "total_following": 0
                },
                "id": "d4b2edd19b1041ec81ad7cf297573ede",
                "fitbit_id": null,
                "peloton_id": "95674e8ebdd546eb8034de34cd05bc64",
                "user_id": "a5a7e230614842e98b6205b80fb79fa6",
                "name": "Cycling Workout",
                "strava_id": null,
                "title": null,
                "has_leaderboard_metrics": false,
                "created_at": 1568079303,
                "created": 1568079303,
                "has_pedaling_metrics": false,
                "platform": "iOS_app",
                "end_time": 1568081192,
                "metrics_type": null,
                "ride": {
                    "scheduled_start_time": 1568043000,
                    "is_live_in_studio_only": false,
                    "rating": 0,
                    "content_provider": "peloton",
                    "is_archived": true,
                    "pedaling_end_offset": 1860,
                    "live_stream_url": null,
                    "series_id": "3eeb7b9e3a3d4e01b6348da56790bdd2",
                    "sold_out": false,
                    "instructor_id": "05735e106f0747d2a112d32678be8afd",
                    "duration": 1800,
                    "overall_estimate": 0.977104,
                    "id": "157bc6faa9ad4ea191e0c905ab9ce6fe",
                    "total_ratings": 0,
                    "title": "30 min HIIT Ride",
                    "difficulty_level": null,
                    "live_stream_id": "157bc6faa9ad4ea191e0c905ab9ce6fe-live",
                    "ride_type_id": "7579b9edbdf9464fa19eb58193897a73",
                    "length": 1917,
                    "difficulty_rating_count": 3658,
                    "difficulty_estimate": 8.769981,
                    "content_format": "video",
                    "location": "nyc",
                    "difficulty_rating_avg": 8.7939,
                    "has_closed_captions": false,
                    "pedaling_duration": 1800,
                    "fitness_discipline": "cycling",
                    "description": "Efficient and effective, this intervals-driven class boosts metabolism and gives you a heart-healthy workout leaving you full of energy and confidence.  ",
                    "sample_vod_stream_url": null,
                    "ride_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "extra_images": [],
                    "metrics": [
                        "heart_rate",
                        "cadence",
                        "calories"
                    ],
                    "studio_peloton_id": "ec338e1ac41d4e878bc4358e9583ff0a",
                    "is_closed_caption_shown": false,
                    "vod_stream_url": "http://secure-vh.akamaihd.net/i/vod/bike/09-2019/09092019-olivia-1130am-bb/09092019-olivia-1130am-bb_,2,4,6,8,13,20,30,60,00k.mp4.csmil/master.m3u8",
                    "total_in_progress_workouts": 4,
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
                    "overall_rating_count": 4316,
                    "overall_rating_avg": 0.9736,
                    "pedaling_start_offset": 60,
                    "total_workouts": 8531,
                    "language": "english",
                    "is_explicit": true,
                    "has_pedaling_metrics": true,
                    "image_url": "https://s3.amazonaws.com/peloton-ride-images/d69cf53151911826fcfaee5d652d3302895fe08a/img_1568045256_811ca4fa1f3145a1a8f77572e26f6a51.png",
                    "original_air_time": 1568042340,
                    "vod_stream_id": "157bc6faa9ad4ea191e0c905ab9ce6fe-vod",
                    "class_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "fitness_discipline_display_name": "Cycling"
                },
                "fitness_discipline": "cycling"
            },
            {
                "status": "COMPLETE",
                "start_time": 1567442445,
                "workout_type": "class",
                "total_work": 0.0,
                "is_total_work_personal_record": false,
                "device_type": "iPad",
                "timezone": "America/Los_Angeles",
                "device_time_created_at": 1567417156,
                "user": {
                    "block_explicit": false,
                    "username": "SpinninChris",
                    "total_workouts": 54,
                    "total_pedaling_metric_workouts": 0,
                    "is_profile_private": false,
                    "created_at": 1560616971,
                    "total_non_pedaling_metric_workouts": 54,
                    "is_provisional": false,
                    "last_workout_at": 1568079303,
                    "image_url": "https://res.cloudinary.com/peloton-cycle/image/upload/l_default_user_images:chars:s,f_jpg/default_user_images/backgrounds/10",
                    "location": "Aliso Viejo, CA",
                    "total_followers": 0,
                    "workout_counts": [
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-walking2.png",
                            "name": "Walking",
                            "slug": "walking"
                        },
                        {
                            "count": 2,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-strength2.png",
                            "name": "Strength",
                            "slug": "strength"
                        },
                        {
                            "count": 36,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png",
                            "name": "Cycling",
                            "slug": "cycling"
                        },
                        {
                            "count": 6,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-stretching2.png",
                            "name": "Stretching",
                            "slug": "stretching"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-running2.png",
                            "name": "Running",
                            "slug": "running"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-circuit2.png",
                            "name": "Bootcamp",
                            "slug": "circuit"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-yoga2.png",
                            "name": "Yoga",
                            "slug": "yoga"
                        },
                        {
                            "count": 10,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-meditation2.png",
                            "name": "Meditation",
                            "slug": "meditation"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-cardio2.png",
                            "name": "Cardio",
                            "slug": "cardio"
                        }
                    ],
                    "id": "a5a7e230614842e98b6205b80fb79fa6",
                    "total_following": 0
                },
                "id": "a0a0d605d092433b809f8d5021c7f359",
                "fitbit_id": null,
                "peloton_id": "5df7c6b001e445bea09197c556aa6872",
                "user_id": "a5a7e230614842e98b6205b80fb79fa6",
                "name": "Cycling Workout",
                "strava_id": null,
                "title": null,
                "has_leaderboard_metrics": false,
                "created_at": 1567442356,
                "created": 1567442356,
                "has_pedaling_metrics": false,
                "platform": "iOS_app",
                "end_time": 1567443645,
                "metrics_type": null,
                "ride": {
                    "scheduled_start_time": 1567144800,
                    "is_live_in_studio_only": false,
                    "rating": 0,
                    "content_provider": "peloton",
                    "is_archived": true,
                    "pedaling_end_offset": 1260,
                    "live_stream_url": null,
                    "series_id": "3eeb7b9e3a3d4e01b6348da56790bdd2",
                    "sold_out": false,
                    "instructor_id": "c0a9505d8135412d824cf3c97406179b",
                    "duration": 1200,
                    "overall_estimate": 0.991623,
                    "id": "a486bbeb79bb4032882e0dc8502e9809",
                    "total_ratings": 0,
                    "title": "20 min HIIT Ride",
                    "difficulty_level": "intermediate",
                    "live_stream_id": "a486bbeb79bb4032882e0dc8502e9809-live",
                    "ride_type_id": "7579b9edbdf9464fa19eb58193897a73",
                    "length": 1379,
                    "difficulty_rating_count": 2156,
                    "difficulty_estimate": 8.209742,
                    "content_format": "video",
                    "location": "uk",
                    "difficulty_rating_avg": 8.218,
                    "has_closed_captions": false,
                    "pedaling_duration": 1200,
                    "fitness_discipline": "cycling",
                    "description": "Efficient and effective, this intervals-driven class boosts metabolism and gives you a heart-healthy workout leaving you full of energy and confidence.  ",
                    "sample_vod_stream_url": null,
                    "ride_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "extra_images": [],
                    "metrics": [
                        "heart_rate",
                        "cadence",
                        "calories"
                    ],
                    "studio_peloton_id": "06ab55c063da4e3cb8238afa8a52092f",
                    "is_closed_caption_shown": false,
                    "vod_stream_url": "http://secure-vh.akamaihd.net/i/vod/bike/08-2019/08302019-leanne-0700am-bb/08302019-leanne-0700am-bb_,2,4,6,8,13,20,30,60,00k.mp4.csmil/master.m3u8",
                    "total_in_progress_workouts": 0,
                    "instructor": {
                        "is_visible": true,
                        "last_name": "Hainsby",
                        "featured_profile": true,
                        "list_order": 23,
                        "music_bio": "",
                        "id": "c0a9505d8135412d824cf3c97406179b",
                        "first_name": "Leanne",
                        "user_id": "913618e33a3f4d7ea69983b9c4524677",
                        "instagram_profile": "",
                        "jumbotron_url_dark": null,
                        "jumbotron_url": null,
                        "spotify_playlist_uri": "spotify:user:onepeloton:playlist:4Zezzm44QXh20RqWGkGVBC",
                        "web_instructor_list_gif_image_url": null,
                        "strava_profile": "",
                        "life_style_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/da800e456e6448ed9c114a37dcc77d36",
                        "instructor_hero_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/be1c3b89a5494cf082f696c543ef48de",
                        "username": "danceonbike_uk",
                        "bio": "Leanne is a former professional dancer turned fitness enthusiast who is passionate about movement and self-expression. Leanne has danced since the age of 3, and has worked her way on stage with some of the best-known artists in the world like Taylor Swift, Kylie Minogue and Katy Perry. Leanne brings her energy to the Bike and inspires new audiences to sweat with her. Leanne’s style of teaching motivates you to step up, and step outside of your comfort zone. She believes that growth comes from areas of discomfort, and through her guidance and support, she’ll get you to the finish line with a smile on your face. Leanne is based in the UK and teaches live rides from our London studio.",
                        "quote": "Sweat, smile, repeat! ",
                        "twitter_profile": "",
                        "jumbotron_url_ios": "https://workout-metric-images-prod.s3.amazonaws.com/0882f5fda8f74906b65fb3c17bdf2792",
                        "background": "I have been dancing since a very young age, so expressing myself unapologetically through music and movement is second nature. I can’t wait to channel this energy and connect with you in this way on the Bike. Get excited for big playlists and to be fully focused on the workout you deserve! ",
                        "film_link": "",
                        "web_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/787f8ba561764471abd386fc76f4d463",
                        "facebook_fan_page": "",
                        "name": "Leanne Hainsby",
                        "ios_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/73347e01a8534c1989b5d9e7770a9e24",
                        "bike_instructor_list_display_image_url": null,
                        "is_filterable": true,
                        "about_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/42c2615890a0475db1e1fc197a1c1049",
                        "fitness_disciplines": [
                            "cycling"
                        ],
                        "short_bio": "Sweat, smile, repeat! ",
                        "ordered_q_and_as": [
                            [
                                "How Do You Motivate?",
                                "I believe that music is what drives us, so I plan to curate meaningful playlists that will push and uplift you. I also share my own personal experience living every day on the edge of my comfort zone, and I will invite you to do the same. I want you to feel supported but pushed so you get the most out of your time with me. "
                            ],
                            [
                                "Outside of Peloton",
                                "Outside of Peloton I love seeing new parts of the world, attending music festivals and rounding out my training through yoga and boxing. I enjoy spending time with my family and friends, and making time to be fully present with them. I’m always looking for a good piece of pizza or a green juice. Life’s all about balance!"
                            ],
                            [
                                "",
                                ""
                            ]
                        ],
                        "image_url": "https://workout-metric-images-prod.s3.amazonaws.com/4fe522646aa34c9c8225159ffc8e8da9",
                        "coach_type": "peloton_coach"
                    },
                    "home_peloton_id": "519c12066fb8497e89495373bb0e3224",
                    "overall_rating_count": 2744,
                    "overall_rating_avg": 0.9923,
                    "pedaling_start_offset": 60,
                    "total_workouts": 5140,
                    "language": "english",
                    "is_explicit": false,
                    "has_pedaling_metrics": true,
                    "image_url": "https://s3.amazonaws.com/peloton-ride-images/4219ad4a84a963583e4bfe9b36d6b6e6150e4153/img_1567146627_f3105c024bae4cb0828c851026d167b6.png",
                    "original_air_time": 1567144200,
                    "vod_stream_id": "a486bbeb79bb4032882e0dc8502e9809-vod",
                    "class_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "fitness_discipline_display_name": "Cycling"
                },
                "fitness_discipline": "cycling"
            },
            {
                "status": "COMPLETE",
                "start_time": 1567043138,
                "workout_type": "class",
                "total_work": 0.0,
                "is_total_work_personal_record": false,
                "device_type": "iPad",
                "timezone": "America/Los_Angeles",
                "device_time_created_at": 1567017849,
                "user": {
                    "block_explicit": false,
                    "username": "SpinninChris",
                    "total_workouts": 54,
                    "total_pedaling_metric_workouts": 0,
                    "is_profile_private": false,
                    "created_at": 1560616971,
                    "total_non_pedaling_metric_workouts": 54,
                    "is_provisional": false,
                    "last_workout_at": 1568079303,
                    "image_url": "https://res.cloudinary.com/peloton-cycle/image/upload/l_default_user_images:chars:s,f_jpg/default_user_images/backgrounds/10",
                    "location": "Aliso Viejo, CA",
                    "total_followers": 0,
                    "workout_counts": [
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-walking2.png",
                            "name": "Walking",
                            "slug": "walking"
                        },
                        {
                            "count": 2,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-strength2.png",
                            "name": "Strength",
                            "slug": "strength"
                        },
                        {
                            "count": 36,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png",
                            "name": "Cycling",
                            "slug": "cycling"
                        },
                        {
                            "count": 6,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-stretching2.png",
                            "name": "Stretching",
                            "slug": "stretching"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-running2.png",
                            "name": "Running",
                            "slug": "running"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-circuit2.png",
                            "name": "Bootcamp",
                            "slug": "circuit"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-yoga2.png",
                            "name": "Yoga",
                            "slug": "yoga"
                        },
                        {
                            "count": 10,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-meditation2.png",
                            "name": "Meditation",
                            "slug": "meditation"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-cardio2.png",
                            "name": "Cardio",
                            "slug": "cardio"
                        }
                    ],
                    "id": "a5a7e230614842e98b6205b80fb79fa6",
                    "total_following": 0
                },
                "id": "dd8c9094a2d04d7fa324687c60d0b7db",
                "fitbit_id": null,
                "peloton_id": "80d3879bae5f40b09c5cedc240c3c6f7",
                "user_id": "a5a7e230614842e98b6205b80fb79fa6",
                "name": "Cycling Workout",
                "strava_id": null,
                "title": null,
                "has_leaderboard_metrics": false,
                "created_at": 1567043049,
                "created": 1567043049,
                "has_pedaling_metrics": false,
                "platform": "iOS_app",
                "end_time": 1567044938,
                "metrics_type": null,
                "ride": {
                    "scheduled_start_time": 1567013400,
                    "is_live_in_studio_only": false,
                    "rating": 0,
                    "content_provider": "peloton",
                    "is_archived": true,
                    "pedaling_end_offset": 1860,
                    "live_stream_url": null,
                    "series_id": "a0b4ddda87dc4d65b9c769afb5a4617b",
                    "sold_out": false,
                    "instructor_id": "f6f2d613dc344e4bbf6428cd34697820",
                    "duration": 1800,
                    "overall_estimate": 0.993599,
                    "id": "163972876fcd41f7a3e4202b65d554a4",
                    "total_ratings": 0,
                    "title": "30 min EDM/Electronic Dance Ride",
                    "difficulty_level": "intermediate",
                    "live_stream_id": "163972876fcd41f7a3e4202b65d554a4-live",
                    "ride_type_id": "f10471dcd6a34e5f8ed54eb634b5df19",
                    "length": 1951,
                    "difficulty_rating_count": 5609,
                    "difficulty_estimate": 7.861638,
                    "content_format": "video",
                    "location": "nyc",
                    "difficulty_rating_avg": 7.8609,
                    "has_closed_captions": false,
                    "pedaling_duration": 1800,
                    "fitness_discipline": "cycling",
                    "description": "You’ll feel like you’re on the dancefloor during this high-energy, EDM-themed ride. ",
                    "sample_vod_stream_url": null,
                    "ride_type_ids": [
                        "f10471dcd6a34e5f8ed54eb634b5df19"
                    ],
                    "extra_images": [],
                    "metrics": [
                        "heart_rate",
                        "cadence",
                        "calories"
                    ],
                    "studio_peloton_id": "ecec646a94574593b755c3ba304435df",
                    "is_closed_caption_shown": false,
                    "vod_stream_url": "http://secure-vh.akamaihd.net/i/vod/bike/08-2019/08282019-emma-130pm-bb/08282019-emma-130pm-bb_,2,4,6,8,13,20,30,00k.mp4.csmil/master.m3u8",
                    "total_in_progress_workouts": 1,
                    "instructor": {
                        "is_visible": true,
                        "last_name": "Lovewell",
                        "featured_profile": true,
                        "list_order": 17,
                        "music_bio": "Ready to ride? Check out a sample of Emma’s current class playlist.",
                        "id": "f6f2d613dc344e4bbf6428cd34697820",
                        "first_name": "Emma",
                        "user_id": "097db0ef549b4c27a29a68ba05856e22",
                        "instagram_profile": "",
                        "jumbotron_url_dark": null,
                        "jumbotron_url": "https://workout-metric-images-prod.s3.amazonaws.com/c9c0fe175ad54453b3389364acd69e40",
                        "spotify_playlist_uri": "spotify:user:onepeloton:playlist:4z5nf64xaZDGAGdPgd2MZp",
                        "web_instructor_list_gif_image_url": null,
                        "strava_profile": "",
                        "life_style_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/ae93987937c34dc5b24e0829524cc3df",
                        "instructor_hero_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/30283b4b26d34f34ae1852848cdc2189",
                        "username": "islandlife17",
                        "bio": "Emma Lovewell is a Martha’s Vineyard native and a woman of all trades. She’s spent much of her career in fitness and wellness as a professional dancer, dance coach, fitness model, personal trainer and pilates instructor. Emma was also a DJ, and brings this love of music to her teaching style at Peloton. She’s passionate about movement and connecting the heavy beats of her playlists to each ride she teaches. After class, expect to feel like you just stepped off the dance floor.",
                        "quote": "I love you, but I’m going to push you.",
                        "twitter_profile": "",
                        "jumbotron_url_ios": "https://workout-metric-images-prod.s3.amazonaws.com/835e341e5b334814bac6811bf43f97b9",
                        "background": "My classes are driven by music, so they’re fun, but don’t let that fool you into thinking you’re not working hard! I always try to find the perfect combination of training and entertainment so that class will fly by, and you won’t even realize how hard you just pushed yourself. ",
                        "film_link": "",
                        "web_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/ef91c17638364ee8ade69b2e06beb448",
                        "facebook_fan_page": "",
                        "name": "Emma Lovewell",
                        "ios_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/a0b4fed3aa904572a2637280d026434e",
                        "bike_instructor_list_display_image_url": null,
                        "is_filterable": true,
                        "about_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/847a2ea587a4453c93305b7bb08f85f8",
                        "fitness_disciplines": [
                            "cycling"
                        ],
                        "short_bio": "\"I love you, but I’m going to push you.\"",
                        "ordered_q_and_as": [
                            [
                                "How Do You Motivate?",
                                "I want people to feel lighter when they finish my class; whether it’s leaving behind a puddle of sweat, or letting go of negative thoughts or feelings. We are always changing. It’s impossible to stay the same. Embrace the change that is coming, and don’t ever miss an opportunity to get stronger."
                            ],
                            [
                                "Outside of Peloton",
                                "I come from a creative family of entrepreneurs so I play the piano, enjoy painting watercolors, cooking, gardening, adventuring and traveling. I snowboard in the winter, and surf and sail in the summer. I always need a creative outlet so I have a lot of hobbies! \r\n"
                            ],
                            [
                                "",
                                ""
                            ]
                        ],
                        "image_url": "https://workout-metric-images-prod.s3.amazonaws.com/6ad6f5f03bc943c386f8e4a22c9883f0",
                        "coach_type": "peloton_coach"
                    },
                    "home_peloton_id": "ed117fde028d414dbd05344067580369",
                    "overall_rating_count": 6852,
                    "overall_rating_avg": 0.9937,
                    "pedaling_start_offset": 60,
                    "total_workouts": 11911,
                    "language": "english",
                    "is_explicit": true,
                    "has_pedaling_metrics": true,
                    "image_url": "https://s3.amazonaws.com/peloton-ride-images/7012de20566cb7b07a4a9840c70ab7bc00c18731/img_1567023238_5b5bb85086bd4732851525a226978010.png",
                    "original_air_time": 1567012800,
                    "vod_stream_id": "163972876fcd41f7a3e4202b65d554a4-vod",
                    "class_type_ids": [
                        "f10471dcd6a34e5f8ed54eb634b5df19"
                    ],
                    "fitness_discipline_display_name": "Cycling"
                },
                "fitness_discipline": "cycling"
            },
            {
                "status": "COMPLETE",
                "start_time": 1566524657,
                "workout_type": "class",
                "total_work": 0.0,
                "is_total_work_personal_record": false,
                "device_type": "iPad",
                "timezone": "America/Los_Angeles",
                "device_time_created_at": 1566499368,
                "user": {
                    "block_explicit": false,
                    "username": "SpinninChris",
                    "total_workouts": 54,
                    "total_pedaling_metric_workouts": 0,
                    "is_profile_private": false,
                    "created_at": 1560616971,
                    "total_non_pedaling_metric_workouts": 54,
                    "is_provisional": false,
                    "last_workout_at": 1568079303,
                    "image_url": "https://res.cloudinary.com/peloton-cycle/image/upload/l_default_user_images:chars:s,f_jpg/default_user_images/backgrounds/10",
                    "location": "Aliso Viejo, CA",
                    "total_followers": 0,
                    "workout_counts": [
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-walking2.png",
                            "name": "Walking",
                            "slug": "walking"
                        },
                        {
                            "count": 2,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-strength2.png",
                            "name": "Strength",
                            "slug": "strength"
                        },
                        {
                            "count": 36,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png",
                            "name": "Cycling",
                            "slug": "cycling"
                        },
                        {
                            "count": 6,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-stretching2.png",
                            "name": "Stretching",
                            "slug": "stretching"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-running2.png",
                            "name": "Running",
                            "slug": "running"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-circuit2.png",
                            "name": "Bootcamp",
                            "slug": "circuit"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-yoga2.png",
                            "name": "Yoga",
                            "slug": "yoga"
                        },
                        {
                            "count": 10,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-meditation2.png",
                            "name": "Meditation",
                            "slug": "meditation"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-cardio2.png",
                            "name": "Cardio",
                            "slug": "cardio"
                        }
                    ],
                    "id": "a5a7e230614842e98b6205b80fb79fa6",
                    "total_following": 0
                },
                "id": "e9274b3b48b743a99d948c48b275bc20",
                "fitbit_id": null,
                "peloton_id": "dc7cf3cf10bf4323ada122e38d518fde",
                "user_id": "a5a7e230614842e98b6205b80fb79fa6",
                "name": "Cycling Workout",
                "strava_id": null,
                "title": null,
                "has_leaderboard_metrics": false,
                "created_at": 1566524568,
                "created": 1566524568,
                "has_pedaling_metrics": false,
                "platform": "iOS_app",
                "end_time": 1566526457,
                "metrics_type": null,
                "ride": {
                    "scheduled_start_time": 1566363600,
                    "is_live_in_studio_only": false,
                    "rating": 0,
                    "content_provider": "peloton",
                    "is_archived": true,
                    "pedaling_end_offset": 1860,
                    "live_stream_url": null,
                    "series_id": "3eeb7b9e3a3d4e01b6348da56790bdd2",
                    "sold_out": false,
                    "instructor_id": "c0a9505d8135412d824cf3c97406179b",
                    "duration": 1800,
                    "overall_estimate": 0.987697,
                    "id": "08a3bed253bf42bd8cdfd1b9478e090c",
                    "total_ratings": 0,
                    "title": "30 min HIIT Ride",
                    "difficulty_level": "intermediate",
                    "live_stream_id": "08a3bed253bf42bd8cdfd1b9478e090c-live",
                    "ride_type_id": "7579b9edbdf9464fa19eb58193897a73",
                    "length": 1989,
                    "difficulty_rating_count": 1747,
                    "difficulty_estimate": 8.472355,
                    "content_format": "video",
                    "location": "uk",
                    "difficulty_rating_avg": 8.486,
                    "has_closed_captions": false,
                    "pedaling_duration": 1800,
                    "fitness_discipline": "cycling",
                    "description": "Efficient and effective, this intervals-driven class boosts metabolism and gives you a heart-healthy workout leaving you full of energy and confidence.  ",
                    "sample_vod_stream_url": null,
                    "ride_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "extra_images": [],
                    "metrics": [
                        "heart_rate",
                        "cadence",
                        "calories"
                    ],
                    "studio_peloton_id": "9376adca3d834594b4f77334c5f1641a",
                    "is_closed_caption_shown": false,
                    "vod_stream_url": "http://secure-vh.akamaihd.net/i/vod/bike/08-2019/08212019-leanne-0600am-b1/08212019-leanne-0600am-b1_,2,4,6,8,13,20,30,00k.mp4.csmil/master.m3u8",
                    "total_in_progress_workouts": 0,
                    "instructor": {
                        "is_visible": true,
                        "last_name": "Hainsby",
                        "featured_profile": true,
                        "list_order": 23,
                        "music_bio": "",
                        "id": "c0a9505d8135412d824cf3c97406179b",
                        "first_name": "Leanne",
                        "user_id": "913618e33a3f4d7ea69983b9c4524677",
                        "instagram_profile": "",
                        "jumbotron_url_dark": null,
                        "jumbotron_url": null,
                        "spotify_playlist_uri": "spotify:user:onepeloton:playlist:4Zezzm44QXh20RqWGkGVBC",
                        "web_instructor_list_gif_image_url": null,
                        "strava_profile": "",
                        "life_style_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/da800e456e6448ed9c114a37dcc77d36",
                        "instructor_hero_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/be1c3b89a5494cf082f696c543ef48de",
                        "username": "danceonbike_uk",
                        "bio": "Leanne is a former professional dancer turned fitness enthusiast who is passionate about movement and self-expression. Leanne has danced since the age of 3, and has worked her way on stage with some of the best-known artists in the world like Taylor Swift, Kylie Minogue and Katy Perry. Leanne brings her energy to the Bike and inspires new audiences to sweat with her. Leanne’s style of teaching motivates you to step up, and step outside of your comfort zone. She believes that growth comes from areas of discomfort, and through her guidance and support, she’ll get you to the finish line with a smile on your face. Leanne is based in the UK and teaches live rides from our London studio.",
                        "quote": "Sweat, smile, repeat! ",
                        "twitter_profile": "",
                        "jumbotron_url_ios": "https://workout-metric-images-prod.s3.amazonaws.com/0882f5fda8f74906b65fb3c17bdf2792",
                        "background": "I have been dancing since a very young age, so expressing myself unapologetically through music and movement is second nature. I can’t wait to channel this energy and connect with you in this way on the Bike. Get excited for big playlists and to be fully focused on the workout you deserve! ",
                        "film_link": "",
                        "web_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/787f8ba561764471abd386fc76f4d463",
                        "facebook_fan_page": "",
                        "name": "Leanne Hainsby",
                        "ios_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/73347e01a8534c1989b5d9e7770a9e24",
                        "bike_instructor_list_display_image_url": null,
                        "is_filterable": true,
                        "about_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/42c2615890a0475db1e1fc197a1c1049",
                        "fitness_disciplines": [
                            "cycling"
                        ],
                        "short_bio": "Sweat, smile, repeat! ",
                        "ordered_q_and_as": [
                            [
                                "How Do You Motivate?",
                                "I believe that music is what drives us, so I plan to curate meaningful playlists that will push and uplift you. I also share my own personal experience living every day on the edge of my comfort zone, and I will invite you to do the same. I want you to feel supported but pushed so you get the most out of your time with me. "
                            ],
                            [
                                "Outside of Peloton",
                                "Outside of Peloton I love seeing new parts of the world, attending music festivals and rounding out my training through yoga and boxing. I enjoy spending time with my family and friends, and making time to be fully present with them. I’m always looking for a good piece of pizza or a green juice. Life’s all about balance!"
                            ],
                            [
                                "",
                                ""
                            ]
                        ],
                        "image_url": "https://workout-metric-images-prod.s3.amazonaws.com/4fe522646aa34c9c8225159ffc8e8da9",
                        "coach_type": "peloton_coach"
                    },
                    "home_peloton_id": "be641ffeeca141fa875b549fa5841aac",
                    "overall_rating_count": 2153,
                    "overall_rating_avg": 0.9884,
                    "pedaling_start_offset": 60,
                    "total_workouts": 4183,
                    "language": "english",
                    "is_explicit": false,
                    "has_pedaling_metrics": true,
                    "image_url": "https://s3.amazonaws.com/peloton-ride-images/869f3f95c885e975c7c459c06163ed0fa22f8137/img_1566368169_607ef22cdda043f3b7a28e640e2d400c.png",
                    "original_air_time": 1566363000,
                    "vod_stream_id": "08a3bed253bf42bd8cdfd1b9478e090c-vod",
                    "class_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "fitness_discipline_display_name": "Cycling"
                },
                "fitness_discipline": "cycling"
            },
            {
                "status": "COMPLETE",
                "start_time": 1566151467,
                "workout_type": "class",
                "total_work": 0.0,
                "is_total_work_personal_record": false,
                "device_type": "iPad",
                "timezone": "America/Los_Angeles",
                "device_time_created_at": 1566126177,
                "user": {
                    "block_explicit": false,
                    "username": "SpinninChris",
                    "total_workouts": 54,
                    "total_pedaling_metric_workouts": 0,
                    "is_profile_private": false,
                    "created_at": 1560616971,
                    "total_non_pedaling_metric_workouts": 54,
                    "is_provisional": false,
                    "last_workout_at": 1568079303,
                    "image_url": "https://res.cloudinary.com/peloton-cycle/image/upload/l_default_user_images:chars:s,f_jpg/default_user_images/backgrounds/10",
                    "location": "Aliso Viejo, CA",
                    "total_followers": 0,
                    "workout_counts": [
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-walking2.png",
                            "name": "Walking",
                            "slug": "walking"
                        },
                        {
                            "count": 2,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-strength2.png",
                            "name": "Strength",
                            "slug": "strength"
                        },
                        {
                            "count": 36,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-cycling2.png",
                            "name": "Cycling",
                            "slug": "cycling"
                        },
                        {
                            "count": 6,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-stretching2.png",
                            "name": "Stretching",
                            "slug": "stretching"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-running2.png",
                            "name": "Running",
                            "slug": "running"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-circuit2.png",
                            "name": "Bootcamp",
                            "slug": "circuit"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-yoga2.png",
                            "name": "Yoga",
                            "slug": "yoga"
                        },
                        {
                            "count": 10,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/nonzero-meditation2.png",
                            "name": "Meditation",
                            "slug": "meditation"
                        },
                        {
                            "count": 0,
                            "icon_url": "https://s3.amazonaws.com/static-cdn.pelotoncycle.com/workout-count-icons/zero-cardio2.png",
                            "name": "Cardio",
                            "slug": "cardio"
                        }
                    ],
                    "id": "a5a7e230614842e98b6205b80fb79fa6",
                    "total_following": 0
                },
                "id": "897d86bcc21247538ac1774220212063",
                "fitbit_id": null,
                "peloton_id": "da1bb5304440448aab4a3f2e93e66e90",
                "user_id": "a5a7e230614842e98b6205b80fb79fa6",
                "name": "Cycling Workout",
                "strava_id": null,
                "title": null,
                "has_leaderboard_metrics": false,
                "created_at": 1566151377,
                "created": 1566151377,
                "has_pedaling_metrics": false,
                "platform": "iOS_app",
                "end_time": 1566153266,
                "metrics_type": null,
                "ride": {
                    "scheduled_start_time": 1565438400,
                    "is_live_in_studio_only": false,
                    "rating": 0,
                    "content_provider": "peloton",
                    "is_archived": true,
                    "pedaling_end_offset": 1860,
                    "live_stream_url": null,
                    "series_id": "3eeb7b9e3a3d4e01b6348da56790bdd2",
                    "sold_out": false,
                    "instructor_id": "c0a9505d8135412d824cf3c97406179b",
                    "duration": 1800,
                    "overall_estimate": 0.990502,
                    "id": "34fc309bfdec4ac68c94cb5957638797",
                    "total_ratings": 0,
                    "title": "30 min HIIT Ride",
                    "difficulty_level": "intermediate",
                    "live_stream_id": "34fc309bfdec4ac68c94cb5957638797-live",
                    "ride_type_id": "7579b9edbdf9464fa19eb58193897a73",
                    "length": 1988,
                    "difficulty_rating_count": 2015,
                    "difficulty_estimate": 8.267474,
                    "content_format": "video",
                    "location": "uk",
                    "difficulty_rating_avg": 8.2749,
                    "has_closed_captions": false,
                    "pedaling_duration": 1800,
                    "fitness_discipline": "cycling",
                    "description": "Efficient and effective, this intervals-driven class boosts metabolism and gives you a heart-healthy workout leaving you full of energy and confidence.  ",
                    "sample_vod_stream_url": null,
                    "ride_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "extra_images": [],
                    "metrics": [
                        "heart_rate",
                        "cadence",
                        "calories"
                    ],
                    "studio_peloton_id": "8e178773f3d44b61a8387b9bbf1b6c78",
                    "is_closed_caption_shown": false,
                    "vod_stream_url": "http://secure-vh.akamaihd.net/i/vod/bike/08-2019/08102019-leanne-0100pm-bb/08102019-leanne-0100pm-bb_,2,4,6,8,13,20,30,60,00k.mp4.csmil/master.m3u8",
                    "total_in_progress_workouts": 0,
                    "instructor": {
                        "is_visible": true,
                        "last_name": "Hainsby",
                        "featured_profile": true,
                        "list_order": 23,
                        "music_bio": "",
                        "id": "c0a9505d8135412d824cf3c97406179b",
                        "first_name": "Leanne",
                        "user_id": "913618e33a3f4d7ea69983b9c4524677",
                        "instagram_profile": "",
                        "jumbotron_url_dark": null,
                        "jumbotron_url": null,
                        "spotify_playlist_uri": "spotify:user:onepeloton:playlist:4Zezzm44QXh20RqWGkGVBC",
                        "web_instructor_list_gif_image_url": null,
                        "strava_profile": "",
                        "life_style_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/da800e456e6448ed9c114a37dcc77d36",
                        "instructor_hero_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/be1c3b89a5494cf082f696c543ef48de",
                        "username": "danceonbike_uk",
                        "bio": "Leanne is a former professional dancer turned fitness enthusiast who is passionate about movement and self-expression. Leanne has danced since the age of 3, and has worked her way on stage with some of the best-known artists in the world like Taylor Swift, Kylie Minogue and Katy Perry. Leanne brings her energy to the Bike and inspires new audiences to sweat with her. Leanne’s style of teaching motivates you to step up, and step outside of your comfort zone. She believes that growth comes from areas of discomfort, and through her guidance and support, she’ll get you to the finish line with a smile on your face. Leanne is based in the UK and teaches live rides from our London studio.",
                        "quote": "Sweat, smile, repeat! ",
                        "twitter_profile": "",
                        "jumbotron_url_ios": "https://workout-metric-images-prod.s3.amazonaws.com/0882f5fda8f74906b65fb3c17bdf2792",
                        "background": "I have been dancing since a very young age, so expressing myself unapologetically through music and movement is second nature. I can’t wait to channel this energy and connect with you in this way on the Bike. Get excited for big playlists and to be fully focused on the workout you deserve! ",
                        "film_link": "",
                        "web_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/787f8ba561764471abd386fc76f4d463",
                        "facebook_fan_page": "",
                        "name": "Leanne Hainsby",
                        "ios_instructor_list_display_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/73347e01a8534c1989b5d9e7770a9e24",
                        "bike_instructor_list_display_image_url": null,
                        "is_filterable": true,
                        "about_image_url": "https://workout-metric-images-prod.s3.amazonaws.com/42c2615890a0475db1e1fc197a1c1049",
                        "fitness_disciplines": [
                            "cycling"
                        ],
                        "short_bio": "Sweat, smile, repeat! ",
                        "ordered_q_and_as": [
                            [
                                "How Do You Motivate?",
                                "I believe that music is what drives us, so I plan to curate meaningful playlists that will push and uplift you. I also share my own personal experience living every day on the edge of my comfort zone, and I will invite you to do the same. I want you to feel supported but pushed so you get the most out of your time with me. "
                            ],
                            [
                                "Outside of Peloton",
                                "Outside of Peloton I love seeing new parts of the world, attending music festivals and rounding out my training through yoga and boxing. I enjoy spending time with my family and friends, and making time to be fully present with them. I’m always looking for a good piece of pizza or a green juice. Life’s all about balance!"
                            ],
                            [
                                "",
                                ""
                            ]
                        ],
                        "image_url": "https://workout-metric-images-prod.s3.amazonaws.com/4fe522646aa34c9c8225159ffc8e8da9",
                        "coach_type": "peloton_coach"
                    },
                    "home_peloton_id": "a3f0b16e345e4e9c8aee3b269fdd12c3",
                    "overall_rating_count": 2505,
                    "overall_rating_avg": 0.9912,
                    "pedaling_start_offset": 60,
                    "total_workouts": 4651,
                    "language": "english",
                    "is_explicit": false,
                    "has_pedaling_metrics": true,
                    "image_url": "https://s3.amazonaws.com/peloton-ride-images/ac213dfdd4659cf4c5dfa9c2feb4cf8bba1a7ef4/img_1565444301_fbaa5c8f880f4ec8bdb810cb786a9c1c.png",
                    "original_air_time": 1565437800,
                    "vod_stream_id": "34fc309bfdec4ac68c94cb5957638797-vod",
                    "class_type_ids": [
                        "7579b9edbdf9464fa19eb58193897a73"
                    ],
                    "fitness_discipline_display_name": "Cycling"
                },
                "fitness_discipline": "cycling"
            }
        ],
        "page": 0
    };

    // const [pelotonWorkoutOverviewData, setPelotonWorkoutOverviewData] = useState(initialPelotonWorkoutOverviewData);

    const initialStateData = {
        pelotonWorkoutOverviewData: {},
        isLoading: true,
        errorMessages: []
    };
    const [data, setData] = useState(initialStateData);



    const fetchPelotonWorkoutData = async () => {

        // const pelotonUserId = 'a5a7e230614842e98b6205b80fb79fa6';
        // const pelotonSessionId = '176b1e04d8054c70820d8981b613b0e1';
        //
        // // call to retrieve the user info
        const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/peloton/get-workout-summary`;  // ?limit=15&page=2
        // const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/${userId}`;
        // const url = `https://api.pelotoncycle.com/api/user/${pelotonUserId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created`;
        // // TODO: use BE API to fetch peloton data as browser request to Peloton directly is blocked by CORS policy
        //
        // // ex) https://api.pelotoncycle.com/api/user/{userId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created
        //

        const options = {
            url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
                // 'Cookie': `peloton_session_id=${pelotonSessionId}`
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
                errorMessages: [errorMessage]
            });
        });

        if (res) {
            console.log(`-------------  Peloton Workout Fetch - res.data  ---------------`);
            console.log(JSON.stringify(res.data, null, 4));

            setData({
                ...data,
                pelotonWorkoutOverviewData: res.data,
                isLoading: false
            });

            window.localStorage.setItem('pelotonWorkoutOverviewData', JSON.stringify(res.data));

        }

        window.localStorage.setItem('pelotonWorkoutOverviewData', JSON.stringify(initialPelotonWorkoutOverviewData));

        setData({
            ...data,
            pelotonWorkoutOverviewData: initialPelotonWorkoutOverviewData,
            isLoading: false
        });
    };

    useEffect(() => {

        fetchPelotonWorkoutData();

    }, []);


    const test_useEffect = () => {


        // window.localStorage.setItem('pelotonWorkoutOverviewData', JSON.stringify(pelotonWorkoutOverviewData));

        // TODO: make API calls to BE to get the metrics
        // ex) https://api.pelotoncycle.com/api/user/{userId}/workouts?joins=user,ride,ride.instructor&limit=20&page=0&sort_by=-created



/*
{
    "id": 37,
    "userId": "a5a7e230614842e98b6205b80fb79fa6",
    "username": "SpinninChris",
    "sessionId": "176b1e04d8054c70820d8981b613b0e1"
}

Headers
- Cookie : peloton_session_id=176b1e04d8054c70820d8981b613b0e1
 */

        // const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/peloton/retrieve-workout-history`;

        // TODO: update BE to accept parameters such as limit ?

        // TODO: create a search page with parameters ?


        // componentWillUnmount equivalent
        return () => {
            //
        }
    };     // empty array [] makes it call only once


    console.log(`PelotonApp window.location.pathname = ${window.location.pathname}`);

    return (
        data.isLoading ? <LinearProgress /> :
        <div>
            <NavTabs
                pelotonWorkoutOverviewData={data.pelotonWorkoutOverviewData}
            />

            {window.location.pathname === '/' && <PelotonMain pelotonWorkoutOverviewData={data.pelotonWorkoutOverviewData} />}
            {window.location.pathname !== '/' && routeResult || <div>404 NOT FOUND</div>}

            {data.errorMessages.length > 0 && <div className={classes.errorMessagesContainer}>{data.errorMessages.map((errorMessage, index) => (<SnackbarContent
                className={classes.errorMessage}
                message={errorMessage}
                key={index}
            />))}</div>}
        </div>
    );
};

export default PelotonApp;
