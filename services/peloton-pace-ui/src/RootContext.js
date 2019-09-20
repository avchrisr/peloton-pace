// import React, { createContext, useContext, useEffect, useState } from 'react';
//
// export const RootContext = createContext();
//
// export default ({children}) => {
//
//     const prevAuth = window.localStorage.getItem('authenticated') || 'false';
//     const prevAuthBody = window.localStorage.getItem('authBody') || '';
//     const prevUserId = window.localStorage.getItem('userId') || '';
//     const [authenticated, setAuthenticated] = useState(prevAuth);
//     const [authBody, setAuthBody] = useState(prevAuthBody);
//     const [userId, setUserId] = useState(prevUserId);
//
//
//
//     useEffect(() => {
//         window.localStorage.setItem('authenticated', authenticated);
//     }, [authenticated]);
//
//     useEffect(() => {
//         window.localStorage.setItem('authBody', authBody);
//     }, [authBody]);
//
//     useEffect(() => {
//         window.localStorage.setItem('userId', userId);
//     }, [userId]);
//
//
//     const authContext = {
//         authenticated, setAuthenticated,
//         authBody, setAuthBody,
//         userId, setUserId
//     };
//
//     return (
//         <RootContext.Provider value={authContext}>
//             {children}
//         </RootContext.Provider>
//     );
// };
