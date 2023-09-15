// adding special data to local storage

import { useState, useEffect } from "react";

const useLocalStorage = (storageKey, fallbackState) => {
    const [value, setValue] = useState(
        JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
    );
    
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(value === undefined ? null : value));
    }, [value, storageKey]);
    
    return [value, setValue];
};

export {useLocalStorage};