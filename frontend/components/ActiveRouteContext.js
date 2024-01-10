import React, { createContext, useState, useContext } from 'react';

const ActiveRouteContext = createContext();

export const useActiveRoute = () => useContext(ActiveRouteContext);

export const ActiveRouteProvider = ({ children }) => {
    const [activeRoute, setActiveRoute] = useState('MessageFeed');

    return (
        <ActiveRouteContext.Provider value={{ activeRoute, setActiveRoute }}>
            {children}
        </ActiveRouteContext.Provider>
    );
};
