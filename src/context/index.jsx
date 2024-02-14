"use client"

import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export function AppWrapper({ children }) {
    let [selectedDate, setSelectedDate] = useState(new Date());
    let [random, setRandom] = useState(0);
    return (
        <AppContext.Provider value={{
            selectedDate,
            setSelectedDate,
            random,
            setRandom
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}