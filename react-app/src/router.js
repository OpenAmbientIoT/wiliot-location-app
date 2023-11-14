import React from "react";

// import Admin from './components/main/Admin/Admin';
//change:Vyshakh
import Admin from './components/main/Admin/Admin';
import User from './components/main/User/User';
import Asset from './components/main/assets/Assets';
import Configuration from './components/configuration/Configuration';

import {createBrowserRouter,} from "react-router-dom";


export const routes = [
    {
        path: '/',
        element: <Admin/>,
    },
    {
        path: '/admin/view',
        element: <Admin/>,
    },
    {
        path: '/user/view',
        element: <User/>,
    },
    {
        path: '/assets',
        element: <Asset/>,
    },
    {
        path: '/configuration',
        element: <Configuration/>,
    },
]

const router = createBrowserRouter(routes);


export default router
