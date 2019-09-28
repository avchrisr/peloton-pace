import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
    AppBar, Button, FormControl, FormControlLabel, FormLabel, InputLabel, LinearProgress,
    MenuItem, Radio, RadioGroup, Select, SnackbarContent, TextField, Toolbar, Typography
} from '@material-ui/core';

import _ from 'lodash';
import axios from 'axios';

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

        margin: '2rem auto',

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


        // border: '1px solid blue'
    },
    buttons: {
        display: 'grid',
        gridTemplateColumns: '100px 100px',
        gridGap: '1rem',
        // margin: '2rem auto'
        // gridTemplateColumns: 'minmax(1fr, auto) minmax(1fr, auto)',
    },
    messagesContainer: {
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


    const isAuthenticated = window.localStorage.getItem('isAuthenticated');
    const userId = window.localStorage.getItem('userId');
    const userFirstname = window.localStorage.getItem('userFirstname');
    const jwt = window.localStorage.getItem('jwt');


    console.log(`UserProfile isAuthenticated = ${isAuthenticated}`);
    console.log(`UserProfile userId = ${userId}`);
    console.log(`UserProfile userFirstname = ${userFirstname}`);
    console.log(`UserProfile jwt = ${jwt}`);


    const initialState = {
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        dob: '',
        pelotonUsername: '',
        pelotonPassword: '',
        errorMessages: [],
        isSubmitting: false,
        responseMessage: ''
    };

    const [initialStateData, setInitialStateData] = useState(initialState);
    const [data, setData] = useState(initialState);

    const fetchUserInfo = async () => {
        // call to retrieve the user info
        const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/${userId}`;

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

            console.log('--------   User Profile Error Message   ----------');
            console.log(errorMessage);

            setData({
                ...data,
                errorMessages: [errorMessage]
            });
        });

        if (res) {
            console.log(`-------------  res.data  ---------------`);
            console.log(JSON.stringify(res.data, null, 4));


            res.data.password = '*******';
            if (_.isNil(res.data.dob)) {
                res.data.dob = '';
            }
            res.data.pelotonPassword = '*******';


            initialState.email = res.data.email;
            initialState.password = res.data.password;
            initialState.firstname = res.data.firstname;
            initialState.lastname = res.data.lastname;
            initialState.dob = res.data.dob;
            initialState.pelotonUsername = res.data.pelotonUsername;
            initialState.pelotonPassword = res.data.pelotonPassword;


            console.log('------   new  initialState   --------');
            console.log(initialState);

            setInitialStateData({
                ...initialState
            });

            setData({
                ...data,
                email: res.data.email,
                password: res.data.password,
                firstname: res.data.firstname,
                lastname: res.data.lastname,
                dob: res.data.dob,
                pelotonUsername: res.data.pelotonUsername,
                pelotonPassword: res.data.pelotonPassword
            });


            // TODO: password changing workflow is different
            // one way hashing does not allow to decode. show some arbitrary masked stars, and accept 'current password' and 'new password'
            // setPassword()
        }
    };

    useEffect(() => {

        fetchUserInfo();

    }, []);

    const handleInputValueChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // INPUT VALIDATION
        const errorMessages = [];

        if (_.isEmpty(data.email)) {
            errorMessages.push(`Email cannot be blank.`);
        }
        if (_.isEmpty(data.password)) {
            errorMessages.push(`Password cannot be blank.`);
        }
        if (_.isEmpty(data.firstname)) {
            errorMessages.push(`Firstname cannot be blank.`);
        }
        if (_.isEmpty(data.lastname)) {
            errorMessages.push(`Lastname cannot be blank.`);
        }
        if (_.isEmpty(data.pelotonUsername)) {
            errorMessages.push(`Peloton Username cannot be blank.`);
        }
        if (_.isEmpty(data.pelotonPassword)) {
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
            console.log('--------   UserProfile Submit Error Messages   ----------');
            console.log(errorMessages);

            setData({
                ...data,
                errorMessages
            });
            return;
        }

        // disable the button until search results comes back
        setData({
            ...data,
            isSubmitting: true,
            errorMessages: []
        });

        const url = `http://${REACT_APP_NGINX_HOSTNAME}:${REACT_APP_NGINX_PORT}/api/${REACT_APP_API_VERSION}/users/${userId}`;

        const requestBody = {};
        if (data.email !== initialStateData.email) {
            requestBody.email = data.email;
        }

        // TODO: password change workflow
        // requestBody.password = data.password;

        if (data.firstname !== initialStateData.firstname) {
            requestBody.firstname = data.firstname;
        }
        if (data.lastname !== initialStateData.lastname) {
            requestBody.lastname = data.lastname;
        }
        if (data.dob !== initialStateData.dob) {
            requestBody.dob = data.dob;
        }
        if (data.pelotonUsername !== initialStateData.pelotonUsername) {
            requestBody.pelotonUsername = data.pelotonUsername;
        }
        if (data.pelotonPassword !== initialStateData.pelotonPassword) {
            requestBody.pelotonPassword = data.pelotonPassword;
        }

        const options = {
            url,
            method: 'PATCH',
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

            console.log('--------   User Profile In Error Message 333   ----------');
            console.log(errorMessage);

            setData({
                ...data,
                errorMessages: [errorMessage],
                isSubmitting: false
            });
        });

        if (res) {
            console.log(`-------------  res.data  ---------------`);
            console.log(JSON.stringify(res.data, null, 4));

            setData({
                ...data,
                responseMessage: res.data.message,
                isSubmitting: false,
                errorMessages: []
            });
        }
    };

    const handleReset = () => {

        console.log('------   handleReset  initialStateData   --------');
        console.log(initialStateData);

        setData({
            ...initialStateData
        });
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

                <form>
                    <div className={classes.container}>
                        <div>
                            <TextField
                                label="Email"
                                helperText="Email to log into Peloton Pace"
                                value={data.email}
                                name="email"
                                onChange={handleInputValueChange}
                                margin="normal"
                                required
                            />
                        </div>
                        <div>
                            <TextField
                                label="DOB"
                                value={data.dob}
                                name="dob"
                                onChange={handleInputValueChange}
                                margin="normal"
                            />
                        </div>
                        <div>
                            <TextField
                                label="Password"
                                helperText="Password to log into Peloton Pace"
                                value={data.password}
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
                                value={data.pelotonUsername}
                                name="pelotonUsername"
                                onChange={handleInputValueChange}
                                margin="normal"
                                required
                            />
                        </div>
                        <div>
                            <TextField
                                label="Firstname"
                                value={data.firstname}
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
                                value={data.pelotonPassword}
                                name="pelotonPassword"
                                onChange={handleInputValueChange}
                                margin="normal"
                                required
                            />
                        </div>
                        <div>
                            <TextField
                                label="Lastname"
                                value={data.lastname}
                                name="lastname"
                                onChange={handleInputValueChange}
                                margin="normal"
                                required
                            />
                        </div>
                    </div>

                    <div className={classes.buttons}>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            fullWidth={false}
                            disabled={data.isSubmitting}
                            onClick={handleSubmit}
                        >Submit</Button>

                        <Button
                            color="secondary"
                            variant="contained"
                            fullWidth={false}
                            // disabled={isSearchButtonDisabled}
                            onClick={handleReset}
                        >Reset</Button>
                    </div>
                </form>

                {data.isSubmitting && <LinearProgress variant="query" />}

                {/*<div className={classes.errorMessage}>{errorMessages.map((errorMessage) => (<div>{errorMessage}</div>))}</div>*/}
                {data.errorMessages.length > 0 && <div className={classes.messagesContainer}>{data.errorMessages.map((errorMessage, index) => (<SnackbarContent
                    className={classes.errorMessage}
                    message={errorMessage}
                    key={index}
                />))}</div>}

                {data.responseMessage.length > 0 && <SnackbarContent
                    className={classes.messagesContainer}
                    message={data.responseMessage}
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
};

export default UserProfile;
