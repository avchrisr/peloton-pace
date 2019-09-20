import React, { createContext, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/styles';

import { navigate, useRoutes } from 'hookrouter';

import { Button, ButtonGroup } from '@material-ui/core';

import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';

import TemplateSearch from "./TemplateSearch";
import UserProfile from "./UserProfile";
import PelotonApp from "./PelotonApp";
import PelotonMain from "./PelotonMain";
import PelotonWorkouts from "./PelotonWorkouts";
import PelotonWorkoutList from './PelotonWorkoutList';
import PelotonWorkoutDetail from './PelotonWorkoutDetail';

import { RootContext } from "../RootContext";

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

export const TemplateSearchContext = createContext();


const routes = {
    '/': () => <PelotonApp />,
    '/template-search': () => <TemplateSearch />,
    '/user-profile': () => <UserProfile a={true}/>,
    '/peloton-main': () => <PelotonMain />,
    '/peloton-workouts': () => <PelotonWorkouts />,
    '/peloton-workout-list/:month': ({month}) => <PelotonWorkoutList month={month} />,
    '/peloton-workout-detail/:workoutId': ({workoutId}) => <PelotonWorkoutDetail workoutId={workoutId} />
};

const Provider = ({children}) => {

    const [type, setType] = useState('either');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [version, setVersion] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameFieldDisabled, setUsernameFieldDisabled] = useState(false);
    const [isPartialTitleMatch, setPartialTitleMatch] = useState(false);
    const [isSearchButtonDisabled, setSearchButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const value = {
        type, setType,
        title, setTitle,
        author, setAuthor,
        version, setVersion,
        username, setUsername,
        isUsernameFieldDisabled, setUsernameFieldDisabled,
        isPartialTitleMatch, setPartialTitleMatch,
        isSearchButtonDisabled, setSearchButtonDisabled,
        errorMessage, setErrorMessage,
        searchResults, setSearchResults,
        page, setPage, rowsPerPage, setRowsPerPage };

    return (
        <TemplateSearchContext.Provider value={value}>
            {children}
        </TemplateSearchContext.Provider>
    );
};

const NavTabs = (props) => {

    console.log('----------   NavTabs props   -------------');
    console.log(props);


    const routeResult = useRoutes(routes);
    const classes = useStyles();

    // const { authenticated, setAuthenticated, authBody, setAuthBody, userId, setUserId } = useContext(RootContext);


    // console.log(`authenticated = ${authenticated}`);
    // console.log(`authBody = ${authBody}`);


    const lastWorkoutDate = new Date(props.pelotonWorkoutListData.data[0].user.last_workout_at * 1000);        // 1568079303000
    const userCreatedDate = new Date(props.pelotonWorkoutListData.data[0].user.created_at * 1000);

    console.log('-------   last workout date   -------------');
    console.log(lastWorkoutDate);

    const handleLogOut = (event) => {
        // setAuthenticated('false');
        // setAuthBody('');
        // setUserId('');
        navigate('/', true);
    };

    const handleNavigation = (navScope) => {
        // if navScope === 'user-profile'
        // call props.fetchUserProfileData function

        if (navScope === 'user-profile') {
            props.fetchUserProfileData({userId: props.userId});
            props.setNavScope(navScope);
        }

    };

    return (
        <Provider>
            <div>
                <ButtonGroup
                    color="primary"
                    fullWidth
                    size="large"
                    variant="outlined"
                >
                    <Button onClick={() => navigate('/template-search', true)}>Search Templates</Button>
                    {/* <Button onClick={() => navigate('/user-profile', true)}>User Profile</Button> */}
                    {/* <Button onClick={() => navigate('/peloton-home', true)}>Peloton Home</Button> */}
                    {/* <Button onClick={() => navigate('/peloton-workouts', true)}>Peloton Workouts</Button> */}


                    <Button onClick={() => props.setNavScope('main', true)}>Peloton Main</Button>
                    <Button onClick={() => props.setNavScope('workouts')}>Peloton Workouts</Button>
                    <Button onClick={() => handleNavigation('user-profile')}>User Profile</Button>
                </ButtonGroup>

                {props.authenticated === 'true' &&
                <div className={classes.profileBar}>
                    <div style={{lineHeight: '2rem'}}><Button size="large" variant="text">{props.userId}</Button> <span>Last Workout At: {lastWorkoutDate.toDateString()} | Since {userCreatedDate.toDateString()}</span></div>
                    <Button onClick={() => handleLogOut()} variant="outlined">Log Out</Button>

                    {/* <div>{authBody}</div> */}
                </div>}

                {/* {routeResult} */}

                {/*{routeResult || <NotFoundPage />}*/}
            </div>
        </Provider>
    );
};

// export default React.memo(NavTabs);

export default NavTabs;
