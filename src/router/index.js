// GeneralViews
import Login from '../components/pages/login';
import Register from '../components/pages/register'
import HomePage from '../components/pages/homepage/HomePage';
import Category from '../components/pages/category';
import CategoryManager from '../components/pages/category-manager'
import ProductManager from '../components/pages/product-manager';
import UserManager from '../components/pages/user-manager';
import PartnerManager from '../components/pages/partner-manager';
import RechargeSuccessManager from '../components/pages/recharge-success-manager';
import PurchaseManager from '../components/pages/purchase-manager'
import BalanceHistoryManager from '../components/pages/balance-history-manager'

import admin from "../components/layout/admin";
import user from "../components/layout/user";
import {Fragment as blank} from 'react'
import NotFound from "../components/pages/not-found/404";
import UserInfo from "../components/pages/user-info";
import AccessDenied from "../components/pages/access-denied/403";

import ResetPassword from '../components/pages/reset-password'

export const dashboardRoutes = [
    {
        path: '/admin/category-manager',
        component: CategoryManager,
        name: "Quản lý danh mục",
        icon: "folder",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin', 'staff']
    },
    {
        path: '/admin/product-manager',
        component: ProductManager,
        name: "Quản lý sản phẩm",
        icon: "file",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin', 'staff']
    },
    {
        path: '/admin/user-manager',
        component: UserManager,
        name: "Quản lý người dùng",
        icon: "user",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin', 'staff']
    },
    {
        path: '/admin/partner-manager',
        component: PartnerManager,
        name: "Quản lý cộng tác viên",
        icon: "team",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin', 'staff']
    },
    {
        path: '/admin/recharge-success-manager',
        component: RechargeSuccessManager,
        name: "Quản lý nạp thành công",
        icon: "bank",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin', 'staff']
    },
    {
        path: '/admin/purchase-manager',
        component: PurchaseManager,
        name: "Quản lý đơn hàng",
        icon: "shop",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin', 'staff']
    },
    {
        path: '/admin/balance-manager',
        component: BalanceHistoryManager,
        name: "Quản lý thay đổi số dư",
        icon: "file-sync",
        exact: true,
        showAlways: true,
        layout: admin,
        role: ['admin', 'staff']
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