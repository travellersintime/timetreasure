import React, { createContext, useState, useContext } from 'react';

const ActiveRouteContext = createContext();

export const useActiveRoute = () => useContext(ActiveRouteContext);

export const ActiveRouteProvider = ({ children }) => {
    const [routeInfo, setRouteInfo] = useState({ route: 'MessageFeed', params: {} });
    const setActiveRoute = (route, params = {}) => {
        setRouteInfo({route, params});
    };

    return (
        <ActiveRouteContext.Provider value={{ activeRoute: routeInfo, setActiveRoute }}>
            {children}
        </ActiveRouteContext.Provider>
    );
};
