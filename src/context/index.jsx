"use client"

import { createContext, useContext, useState } from "react";

const AppContext = createContext({});

export function AppWrapper({ children }) {
    let [selectedDate, setSelectedDate] = useState(new Date());
    const [stockRandom, setStockRandom] = useState(0);
    const [orderRandom, setOrderRandom] = useState(0);
    const [borrowRandom, setBorrowRandom] = useState(0);
    return (
        <AppContext.Provider value={{
            selectedDate,
            setSelectedDate,
            stockRandom,
            setStockRandom,
            orderRandom,
            setOrderRandom,
            borrowRandom,
            setBorrowRandom
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}