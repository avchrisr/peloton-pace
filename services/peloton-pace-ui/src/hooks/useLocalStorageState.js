import React, { useEffect, useState } from 'react';
import _ from 'lodash';

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

        if (_.isObjectLike(state)) {
            window.localStorage.setItem(key, JSON.stringify(state));
        } else {
            window.localStorage.setItem(key, String(state));
        }

    }, [state]);

    return [state, setState];
};

export default UseLocalStorageState;


// (usage) const [todos, setTodos] = useLocalStorageState('todos', []);
