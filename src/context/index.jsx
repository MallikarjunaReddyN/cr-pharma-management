"use client"

import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export function AppWrapper({ children }) {
    let [selectedDate, setSelectedDate] = useState(new Date());
    return (
        <AppContext.Provider value={{
            selectedDate,
            setSelectedDate,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}