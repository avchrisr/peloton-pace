import React, { useReducer } from 'react';
import './App.css';

import PelotonApp from './components/PelotonApp';
import SignIn from "./components/SignIn";
import SignUp from './components/SignUp';
import useLocalStorageState from './hooks/useLocalStorageState';

export const AuthContext = React.createContext();

export const ReducerActionTypes = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT'
};

const initialState = {
    isAuthenticated: false,
    userId: null,
    username: null,
    userFirstname: null,
    jwt: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case ReducerActionTypes.LOGIN:
            window.localStorage.setItem('isAuthenticated', 'true');
            window.localStorage.setItem('userId', action.payload.userId);
            window.localStorage.setItem('username', action.payload.username);
            window.localStorage.setItem('userFirstname', action.payload.userFirstname);
            window.localStorage.setItem('jwt', action.payload.jwt);

            return {
                ...state,
                isAuthenticated: true,
                userId: action.payload.userId,
                username: action.payload.username,
                userFirstname: action.payload.userFirstname,
                jwt: action.payload.jwt
            };
        case ReducerActionTypes.LOGOUT:
            window.localStorage.clear();
            return {
                ...state,
                isAuthenticated: false,
                userId: null,
                username: null,
                userFirstname: null,
                jwt: null
            };
        default:
            return state;
    }
};

const App = (props) => {

    console.log('--------------   App props   -------------');
    console.log(props);

    const [state, dispatch] = useReducer(reducer, initialState);

    console.log(`window.location.href = ${window.location.href}`);              // http://localhost:3000/signup
    console.log(`window.location.pathname = ${window.location.pathname}`);      // /signup

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            <div className="App">
                {window.localStorage.getItem('isAuthenticated') === 'true' ? <PelotonApp /> : window.location.pathname === '/sign-up' ? <SignUp /> : <SignIn />}
            </div>
        </AuthContext.Provider>
    );
};

export default App;
