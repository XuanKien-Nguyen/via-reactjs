// GeneralViews
import Login from '../components/pages/login';
import Register from '../components/pages/register'
import Home from '../components/pages/home';
import CreateProduct from '../components/pages/create-product';
import ProductDetails from '../components/pages/product-detail';
import HomePage from '../components/pages/homepage/HomePage';
import Category from '../components/pages/category';

import admin from "../components/layout/admin";
import user from "../components/layout/user";
import {Fragment as blank} from 'react'
import NotFound from "../components/pages/not-found/404";
import UserInfo from "../components/pages/user-info";
import AccessDenied from "../components/pages/access-denied/403";

import ResetPassword from '../components/pages/reset-password'

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
        name: "Thông tin người dùng",
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
        name: "Đăng nhập",
        noAuth: true,
        exact: true,
        layout: blank
    },
    {
        path: '/register',
        component: Register,
        name: "Đăng ký",
        noAuth: true,
        exact: true,
        layout: blank
    },
    {
        path: '/',
        component: HomePage,
        name: "Trang chủ",
        exact: true,
        noAuth: true,
        layout: user
    },
    {
        path: '/not-found',
        component: NotFound,
        name: "Không tìm thấy trang",
        noAuth: true,
        layout: user
    },
    {
        path: '/access-denied',
        component: AccessDenied,
        name: "Từ chối truy cập",
        noAuth: true,
        layout: user
    },
    {
        path: '/categories',
        component: Category,
        name: "Sản phẩm",
        noAuth: true,
        layout: user,
    },
    {
        path: '/reset-password',
        component: ResetPassword,
        name: 'Thiết lập lại mật khẩu',
        noAuth: true,
        layout: user,
    },
];