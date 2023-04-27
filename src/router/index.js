// GeneralViews
import Login from '../components/pages/login';
import Register from '../components/pages/register'
import Home from '../components/pages/home';
import CreateProduct from '../components/pages/create-product';
import ProductDetails from '../components/pages/product-detail';
import HomePage from '../components/pages/homepage/HomePage';
import ProductPage from '../components/pages/product-page';

import admin from "../components/layout/admin";
import user from "../components/layout/user";
import {Fragment as blank} from 'react'
import NotFound from "../components/pages/not-found/404";
import UserInfo from "../components/pages/user-info";
import AccessDenied from "../components/pages/access-denied/403";
import Auth2fa from '../components/pages/auth2fa'

export const dashboardRoutes = [
    {
        path: '/admin',
        component: Home,
        name: "Home Admin",
        icon: "shop",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin']
    },
    {
        path: '/create-product',
        component: CreateProduct,
        name: "Create Product",
        icon: "upload",
        showAlways: true,
        exact: true,
        layout: admin,
        role: ['admin']
    },
    {
        path: '/product/:productSlug',
        component: ProductDetails,
        name: "Product details",
        icon: "team",
        exact: true,
        showAlways: false,
        layout: admin,
        role: ['admin']
    },
    {
        path: '/user-info',
        component: UserInfo,
        name: "User Info",
        icon: "team",
        exact: true,
        showAlways: false,
        layout: user,
        role: ['admin', 'customer', 'staff']
    },
];
export const baseRoutes = [
    {
        path: '/login',
        component: Login,
        name: "Login",
        noAuth: true,
        exact: true,
        layout: blank
    },
    {
        path: '/register',
        component: Register,
        name: "Register",
        noAuth: true,
        exact: true,
        layout: blank
    },
    {
        path: '/',
        component: HomePage,
        name: "Home",
        exact: true,
        noAuth: true,
        layout: user
    },
    {
        path: '/not-found',
        component: NotFound,
        name: "NotFound",
        noAuth: true,
        layout: user
    },
    {
        path: '/access-denied',
        component: AccessDenied,
        name: "AccessDenied",
        noAuth: true,
        layout: user
    },

    {
        path: '/auth-2fa',
        component: Auth2fa,
        name: "auth2fa",
        noAuth: true,
        layout: blank
    },
    {
        path: '/product-category',
        component: ProductPage,
        name: "Product Page",
        exact: true,
        noAuth: true,
        layout: user,
    },
];