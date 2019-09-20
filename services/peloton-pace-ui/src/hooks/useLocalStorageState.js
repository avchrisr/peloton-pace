import React, { useEffect, useState } from 'react';

const UseLocalStorageState = (key, defaultVal) => {

    const [state, setState] = useState(() => {
        let val;
        try {
            val = JSON.parse(window.localStorage.getItem(key) || String(defaultVal));
        } catch (e) {
            val = defaultVal;
        }
        return val;
    });

    // update localStorage when state changes
    useEffect(() => {

        console.log(`--------  UseLocalStorageState | key = ${key} | state = ${state}`);

        window.localStorage.setItem(key, JSON.stringify(state));
    }, [state]);

    return [state, setState];
};

export default UseLocalStorageState;


// (usage) const [todos, setTodos] = useLocalStorageState('todos', []);
