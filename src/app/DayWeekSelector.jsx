"use client"

import { useAppContext } from '@/context';
import { getMonthYear, getSelectKey, getWeekTabs } from '@/utils/WeekDays';
import { Button, Tab, Tabs } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import Datepicker from 'react-tailwindcss-datepicker'

export default function DayWeekSelector() {
    const { setSelectedDate, stockRandom, orderRandom, borrowRandom } = useAppContext();
    const [weekCounter, setWeekCounter] = useState(0);
    const [pickedDate, setPickedDate] = useState({
        startDate: null,
        endDate: null
    });
    const [tabs, setTabs] = useState(() => getWeekTabs(weekCounter));
    const [selectedKey, setSelectedKey] = useState(() => getSelectKey(pickedDate));
    const [monthYear, setMonthYear] = useState(() => getMonthYear(tabs));

    const handleValueChange = (newValue) => {
        console.log("newValue:", newValue);
        setPickedDate(newValue);
    }

    useEffect(() => {
        setTabs(() => getWeekTabs(0, pickedDate?.startDate));
        setSelectedKey(() => getSelectKey(pickedDate));
    }, [pickedDate]);

    useEffect(() => {
        setMonthYear(() => getMonthYear(tabs));
    }, [tabs]);

    const prevWeekHandler = () => {
        setWeekCounter((prev) => prev + 1);
        setTabs(() => getWeekTabs(weekCounter + 1));
    }

    const nextWeekHandler = () => {
        if (weekCounter != 0) {
            setWeekCounter((prev) => prev - 1);
            setTabs(() => getWeekTabs(weekCounter - 1));
            setSelectedKey(() => getSelectKey(pickedDate));
        }
    }

    useEffect(() => {
        const filteredTab = tabs.filter(tab => tab?.id == selectedKey).map(tab => tab?.date);
        setSelectedDate(filteredTab[0]);
    }, [selectedKey]);


    useEffect(() => {
        setPickedDate({
            startDate: null,
            endDate: null
        })
        setTabs(() => getWeekTabs(0, pickedDate?.startDate));
        setSelectedKey(() => getSelectKey(pickedDate));
    }, [stockRandom, orderRandom, borrowRandom]);


    return (
        <>
            <div className="flex w-full justify-between">
                <div className="ml-3"><p className="text-md text-gray-600 font-bold">{monthYear}</p></div>
                <div className="mr-3">
                    <Datepicker
                        inputClassName="w-full h-[30px] rounded-md p-2 border-2 border-[#00a69c] z-9999"
                        useRange={false}
                        asSingle={true}
                        value={pickedDate}
                        maxDate={new Date()}
                        onChange={handleValueChange}
                    />
                </div>
            </div>
            <div className="py-2 px-4 flex justify-between items-center z-0 mb-1 mt-1">
                <Button size="sm" className="bg-[#00a69c] text-white font-medium" startContent={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                    </svg>
                }
                    onPress={prevWeekHandler}
                >
                    Prev Week
                </Button>
                <Tabs aria-label="Dynamic tabs"
                    color="primary" size='sm'
                    //className="ml-[200px] mr-[200px]"
                    items={tabs}
                    classNames={{
                        cursor: "bg-[#00a69c]",
                    }}
                    selectedKey={selectedKey}
                    onSelectionChange={setSelectedKey}
                >
                    {(item) => (
                        <Tab key={item.id} title={
                            <span>{item.label}</span>
                        }
                        >
                        </Tab>
                    )}
                </Tabs>
                <Button size="sm" className="bg-[#00a69c] text-white font-medium" endContent={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                }
                    isDisabled={weekCounter == 0 ? true : false}
                    onPress={nextWeekHandler}
                >
                    Next Week
                </Button>
            </div>
        </>
    )
}
