import React, { useContext, useEffect, useState } from 'react';
import './App.css';

import PelotonApp from './components/PelotonApp';
import { RootContext } from './RootContext';
import SignIn from "./components/SignIn";
import SignUp from './components/SignUp';
import useLocalStorageState from './hooks/useLocalStorageState';

const App = (props) => {

    console.log('--------------   App props   -------------');
    console.log(props);

    // const { authenticated, authBody, userId } = useContext(RootContext);

    const prevAuth = window.localStorage.getItem('authenticated') || 'false';
    const prevAuthBody = window.localStorage.getItem('authBody') || '';
    const prevUserId = window.localStorage.getItem('userId') || '';

    // const [authenticated, setAuthenticated] = useState(prevAuth);
    // const [authBody, setAuthBody] = useState(prevAuthBody);
    // const [userId, setUserId] = useState(prevUserId);

    const [authenticated, setAuthenticated] = useLocalStorageState('authenticated', 'false');
    const [authBody, setAuthBody] = useLocalStorageState('authBody', '');
    const [userId, setUserId] = useLocalStorageState('userId', '');

    // useEffect(() => {
    //     window.localStorage.setItem('authenticated', authenticated);
    // }, [authenticated]);
    //
    // useEffect(() => {
    //     window.localStorage.setItem('authBody', authBody);
    // }, [authBody]);
    //
    // useEffect(() => {
    //     console.log(`------   useEffect  --  setting userId = ${userId}`);
    //     window.localStorage.setItem('userId', userId);
    // }, [userId]);


    const setMyAuthenticated = (value) => {

        console.log(`setMyAuthenticated value = ${value}`);

        setAuthenticated(value);
    };

    console.log(`App authenticated = ${authenticated}`);
    console.log(`typeof authenticated = ${typeof authenticated}`);

    console.log(`App authBody = ${authBody}`);
    console.log(`App userId = ${userId}`);
    console.log(`App typeof userId = ${typeof userId}`);
    console.log(`App userId.length = ${userId.length}`);


    console.log(`window.location.href = ${window.location.href}`);              // http://localhost:3000/signup
    console.log(`window.location.pathname = ${window.location.pathname}`);      // /signup

    return (
        <div className="App">
            {userId > 0 && <div><PelotonApp
                authenticated={authenticated}
                authBody={authBody}
                userId={userId} />
            </div>}
            {userId === '' && (window.location.pathname === '/signup' ? <SignUp /> :
                <SignIn
                    setAuthenticated={setAuthenticated}
                    setAuthBody={setAuthBody}
                    setUserId={setUserId}
                />)}
        </div>
    );
};

export default App;
