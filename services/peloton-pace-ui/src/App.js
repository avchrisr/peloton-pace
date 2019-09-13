import React, { useContext } from 'react';
import './App.css';

import NavTabs from './components/NavTabs';
import { RootContext } from './RootContext';
import SignIn from "./components/SignIn";
import SignUp from './components/SignUp';

export default function App() {
    const { authenticated, authBody } = useContext(RootContext);

    console.log(`authenticated = ${authenticated}`);
    console.log(`typeof authenticated = ${typeof authenticated}`);

    console.log(`window.location.href = ${window.location.href}`);              // http://localhost:3000/signup
    console.log(`window.location.pathname = ${window.location.pathname}`);      // /signup

    return (
        <div className="App">
            {authenticated !== 'false' && <div><NavTabs /></div>}
            {authenticated === 'false' && (window.location.pathname === '/signup' ? <SignUp /> : <SignIn />)}
        </div>
    );
}
