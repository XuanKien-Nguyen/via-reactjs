import MainLayout from '../components/layout/admin';

// GeneralViews
import Login from '../components/pages/login';
import Register from '../components/pages/register'
import Home from '../components/pages/home';
import CreateProduct from '../components/pages/create-product';
import ProductDetails from '../components/pages/product-detail';
import HomePage from '../components/pages/homepage/HomePage';

import admin from "../components/layout/admin";
import user from "../components/layout/user";
import {Fragment as blank} from 'react'
import NotFound from "../components/pages/404";
import UserInfo from "../components/pages/user-info";

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
    role: ['admin', 'customer']
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
    path: '/404',
    component: NotFound,
    name: "NotFound",
    exact: true,
    noAuth: true,
    layout: user
  },
];