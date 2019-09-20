import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    AppBar, Button, FormControl, FormControlLabel, FormLabel, InputLabel, LinearProgress,
    MenuItem, Radio, RadioGroup, Select, SnackbarContent, TextField, Toolbar, Typography
} from '@material-ui/core';

import _ from 'lodash';
import axios from 'axios';

import { RootContext } from "../RootContext";

const isOnlyNumbersRegEx = /^\d+$/;

const REACT_APP_NGINX_HOSTNAME = process.env.REACT_APP_NGINX_HOSTNAME || 'localhost';
const REACT_APP_NGINX_PORT = process.env.REACT_APP_NGINX_PORT || '9090';                // 3001
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
    root: {
        width: '1000px',
        flexGrow: 1,
        margin: '2rem auto',


        border: '1px solid blue'
    },
    buttons: {
        display: 'grid',
        gridTemplateColumns: '100px 100px',
        gridGap: '1rem',
        marginTop: '2rem'
        // gridTemplateColumns: 'minmax(1fr, auto) minmax(1fr, auto)',
    },
    errorMessagesContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridRowGap: '10px',
        marginTop: '20px'

        // border: '1px solid red',
    },
    errorMessage: {
        backgroundColor: '#e74c3c'
    }
});

const UserProfile = (props) => {
    const classes = useStyles();

    console.log('----------   user profile props   -------------');
    console.log(props);



    // const { authenticated, setAuthenticated, authBody, setAuthBody, userId, setUserId } = useContext(RootContext);

    const authBodyJson = JSON.parse(props.authBody);
    console.log('----------   user profile top JWT   -------------');
    console.log(authBodyJson.jwt);

    const [email, setEmail] = useState(props.email);
    const [password, setPassword] = useState(props.password);
    const [firstname, setFirstname] = useState(props.firstname);
    const [lastname, setLastname] = useState(props.lastname);
    const [dob, setDob] = useState(props.dob);
    const [pelotonUsername, setPelotonUsername] = useState(props.pelotonUsername);
    const [pelotonPassword, setPelotonPassword] = useState(props.pelotonPassword);



    // TODO: figure out why email is not getting set here.  or try passing the setter from higher level? (PelotonApp.js)?


    console.log(`props.email = ${props.email}`);
    console.log(`typeof props.email = ${typeof props.email}`);

    console.log(`email = ${email}`);


    const [emailOriginal, setEmailOriginal] = useState('');
    const [passwordOriginal, setPasswordOriginal] = useState('');
    const [firstnameOriginal, setFirstnameOriginal] = useState('');
    const [lastnameOriginal, setLastnameOriginal] = useState('');
    const [dobOriginal, setDobOriginal] = useState('');
    const [pelotonUsernameOriginal, setPelotonUsernameOriginal] = useState('');
    const [pelotonPasswordOriginal, setPelotonPasswordOriginal] = useState('');

    const [emailChanged, setEmailChanged] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [firstnameChanged, setFirstnameChanged] = useState(false);
    const [lastnameChanged, setLastnameChanged] = useState(false);
    const [dobChanged, setDobChanged] = useState(false);
    const [pelotonUsernameChanged, setPelotonUsernameChanged] = useState(false);
    const [pelotonPasswordChanged, setPelotonPasswordChanged] = useState(false);

    const [isLoading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [submitResponseMessage, setSubmitResponseMessage] = useState('');

    // const fetchUserInfo = async () => {
    //     // call to retrieve the user info
    //     const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/${userId}`;

    //     const options = {
    //         url,
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + authBodyJson.jwt
    //         },
    //         // data: requestBody,
    //         timeout: 5000,
    //         // auth: {
    //         //     username: environment.username,
    //         //     password: environment.password
    //         // }
    //     };

    //     console.log(`URL = ${url}`);
    //     console.log(`userId = ${userId}`);


    //     const res = await axios(options).catch((err) => {
    //         console.log(`-------------  AXIOS ERROR  ---------------`);
    //         console.log(err);
    //         console.log(JSON.stringify(err, null, 4));
    //         console.log(`-------------  ERROR RESPONSE  ---------------`);
    //         console.log(err.response);

    //         const errorMessage = _.get(err, 'response.data.message') || _.get(err, 'message');

    //         console.log('--------   User Profile Error Message   ----------');
    //         console.log(errorMessage);

    //         setErrorMessages([errorMessage]);
    //     });

    //     if (res) {
    //         console.log(`-------------  res.data  ---------------`);
    //         console.log(JSON.stringify(res.data, null, 4));


    //         res.data.dob = '1990-01-05';
    //         res.data.pelotonUsername = 'SpinninChris';
    //         res.data.pelotonPassword = '*******';



    //         setEmailOriginal(res.data.email);
    //         // setPasswordOriginal(res.data.password);
    //         setFirstnameOriginal(res.data.firstname);
    //         setLastnameOriginal(res.data.lastname);
    //         // setDobOriginal(res.data.dob);
    //         setPelotonUsernameOriginal(res.data.pelotonUsername);
    //         setPelotonPasswordOriginal(res.data.pelotonPassword);

    //         setEmail(res.data.email);
    //         // setPassword(res.data.password);
    //         setFirstname(res.data.firstname);
    //         setLastname(res.data.lastname);
    //         // setDob(res.data.dob);
    //         setPelotonUsername(res.data.pelotonUsername);
    //         setPelotonPassword(res.data.pelotonPassword);

    //         // TODO: password changing workflow is different
    //         // one way hashing does not allow to decode. show some arbitrary masked stars, and accept 'current password' and 'new password'
    //         // setPassword()

    //         setSubmitResponseMessage(res.data.message);
    //     }
    // };

    // useEffect(() => {

    //     fetchUserInfo();

    // }, []);

    // useEffect(() => {

    //     console.log('---------  user profile useEffect called  ----------');

    //     if (userId) {
    //         // fetchUserInfo();
    //     }

    // }, [userId]);



    const handleInputValueChange = (event) => {
        switch (event.target.name) {
            case 'email':
                setEmail(event.target.value.trim());
                setEmailChanged(true);
                break;
            case 'password':
                setPassword(event.target.value.trim());
                setPasswordChanged(true);
                break;
            case 'firstname':
                setFirstname(event.target.value.trim());
                setFirstnameChanged(true);
                break;
            case 'lastname':
                setLastname(event.target.value.trim());
                setLastnameChanged(true);
                break;
            case 'dob':
                setDob(event.target.value);
                setDobChanged(true);
                break;
            case 'pelotonUsername':
                setPelotonUsername(event.target.value.trim());
                setPelotonUsernameChanged(true);
                break;
            case 'pelotonPassword':
                setPelotonPassword(event.target.value.trim());
                setPelotonPasswordChanged(true);
                break;
            default:
                console.log(`Error - Unrecognized event.target.name = ${event.target.name}`);
                break;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // INPUT VALIDATION
        const errorMessages = [];

        if (_.isEmpty(email)) {
            errorMessages.push(`Email cannot be blank.`);
        }
        if (_.isEmpty(password)) {
            errorMessages.push(`Password cannot be blank.`);
        }
        if (_.isEmpty(firstname)) {
            errorMessages.push(`Firstname cannot be blank.`);
        }
        if (_.isEmpty(lastname)) {
            errorMessages.push(`Lastname cannot be blank.`);
        }
        if (_.isEmpty(pelotonUsername)) {
            errorMessages.push(`Peloton Username cannot be blank.`);
        }
        if (_.isEmpty(pelotonPassword)) {
            errorMessages.push(`Peloton Password cannot be blank.`);
        }

        // {
        //     templateIdsArray = templateIds.split(',');

        //     templateIdsArray.forEach((id) => {
        //         id = id.trim();
        //         if (!isOnlyNumbersRegEx.test(id) || !_.isInteger(_.toFinite(id))) {
        //             errorMessages.push(`"${id}" is not a valid template ID as it is not an integer number.`);
        //         } else if (id === systemTemplateId) {
        //             errorMessages.push(`Template ID being copied from, and Template ID being replaced cannot be the same.`);
        //         } else {
        //             templateIdsToCopy.push(parseInt(id));
        //         }
        //     });

        //     if (templateIdsArray.length > 1 && toType === 'system' && createOrReplaceSystemTemplate === 'replace') {
        //         errorMessages.push(`When copying multiple User templates to System, it must be "Create New System Template"`);
        //     }
        // }

        if (errorMessages.length > 0) {
            console.log('--------   Sign In Error MessageS   ----------');
            console.log(errorMessages);

            setErrorMessages(errorMessages);
            return;
        }

        // disable the button until search results comes back
        setLoading(true);
        setErrorMessages([]);


        // setTimeout(() => {
        //     handleReset();
        // }, 4000);



        const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/{id}`;

        const requestBody = {};

        if (emailChanged) {
            requestBody.email = email;
        }
        if (passwordChanged) {
            requestBody.password = password;
        }
        if (firstnameChanged) {
            requestBody.firstname = firstname;
        }
        if (lastnameChanged) {
            requestBody.lastname = lastname;
        }
        if (dobChanged) {
            requestBody.dob = dob;
        }
        if (pelotonUsernameChanged) {
            requestBody.pelotonUsername = pelotonUsername;
        }
        if (pelotonPasswordChanged) {
            requestBody.pelotonPassword = pelotonPassword;
        }

        const options = {
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authBodyJson.jwt
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

            console.log('--------   User Profile In Error Message 333   ----------');
            console.log(errorMessage);

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
        setEmail(emailOriginal);
        setPassword(passwordOriginal);
        setFirstname(firstnameOriginal);
        setLastname(lastnameOriginal);
        setDob(dobOriginal);
        setPelotonUsername(pelotonUsernameOriginal);
        setPelotonPassword(pelotonPasswordOriginal);

        setLoading(false);
        setErrorMessages([]);
    };

    return (
        <div>
            <div>
                <AppBar position="relative">
                    <Toolbar>
                        {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
                        {/*    <MenuIcon />*/}
                        {/*</IconButton>*/}
                        <Typography variant="h5" className={classes.title}>
                            User Profile
                        </Typography>
                        {/*<Button color="inherit">Login</Button>*/}
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.root}>
                {/* firstname, lastname, email, password, dob, peloton_username, peloton_password */}

                <div className={classes.container}>
                    <div>
                        <TextField
                            label="Email"
                            helperText="Email to log into Peloton Pace"
                            value={email}
                            name="email"
                            onChange={handleInputValueChange}
                            margin="normal"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="DOB"
                            value={dob}
                            name="dob"
                            onChange={handleInputValueChange}
                            margin="normal"
                        />
                    </div>
                    <div>
                        <TextField
                            label="Password"
                            helperText="Password to log into Peloton Pace"
                            value={password}
                            name="password"
                            onChange={handleInputValueChange}
                            margin="normal"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Peloton Username"
                            helperText="Your Peloton Digital username"
                            value={pelotonUsername}
                            name="pelotonUsername"
                            onChange={handleInputValueChange}
                            margin="normal"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Firstname"
                            value={firstname}
                            name="firstname"
                            onChange={handleInputValueChange}
                            margin="normal"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Peloton Password"
                            helperText="Your Peloton Digital password"
                            value={pelotonPassword}
                            name="pelotonPassword"
                            onChange={handleInputValueChange}
                            margin="normal"
                            required
                        />
                    </div>
                    <div>
                        <TextField
                            label="Lastname"
                            value={lastname}
                            name="lastname"
                            onChange={handleInputValueChange}
                            margin="normal"
                            required
                        />
                    </div>
                </div>

                <div className={classes.buttons}>
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth={false}
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >Submit</Button>

                    <Button
                        color="secondary"
                        variant="contained"
                        fullWidth={false}
                        // disabled={isSearchButtonDisabled}
                        onClick={() => handleReset()}
                    >Reset</Button>
                </div>

                {isLoading && <LinearProgress variant="query" />}

                {/*<div className={classes.errorMessage}>{errorMessages.map((errorMessage) => (<div>{errorMessage}</div>))}</div>*/}
                {errorMessages.length > 0 && <div className={classes.errorMessagesContainer}>{errorMessages.map((errorMessage, index) => (<SnackbarContent
                    className={classes.errorMessage}
                    message={errorMessage}
                    key={index}
                />))}</div>}

                {submitResponseMessage.length > 0 && <SnackbarContent
                    className={classes.snackbar}
                    message={submitResponseMessage}
                />}


                {/*<Snackbar*/}
                {/*    anchorOrigin={{*/}
                {/*        vertical: 'bottom',*/}
                {/*        horizontal: 'left',*/}
                {/*    }}*/}
                {/*    open={open}*/}
                {/*    autoHideDuration={6000}*/}
                {/*    onClose={handleClose}*/}
                {/*>*/}
                {/*    <MySnackbarContentWrapper*/}
                {/*        onClose={handleClose}*/}
                {/*        variant="success"*/}
                {/*        message="This is a success message!"*/}
                {/*    />*/}
                {/*</Snackbar>*/}

            </div>
        </div>
    );
}

export default UserProfile;
