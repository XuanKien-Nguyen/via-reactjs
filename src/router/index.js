import MainLayout from '../components/layout/admin';

// GeneralViews
import Login from '../components/pages/login';
import Register from '../components/pages/register'
import Home from '../components/pages/home';
import CreateProduct from '../components/pages/create-product';
import ProductDetails from '../components/pages/product-detail';
import HomePage from '../components/pages/common/homepage/HomePage';

import ADMIN from "../components/layout/admin";
import USER from "../components/layout/user";

export const dashboardRoutes = [
  {
    path: '/admin',
    component: Home,
    name: "Home Admin",
    icon: "shop",
    showAlways: true,
    layout: ADMIN
  },
  {
    path: '/create-product',
    component: CreateProduct,
    name: "Create Product",
    icon: "upload",
    showAlways: true,
    layout: ADMIN,
  },
  {
    path: '/product/:productSlug',
    component: ProductDetails,
    name: "Product details",
    icon: "team",
    showAlways: false,
    layout: ADMIN
  },
  {
    path: '/login',
    component: Login,
    name: "Login",
    noAuth: true,
    layout: USER
  },
  {
    path: '/register',
    component: Register,
    name: "Register",
    noAuth: true,
    layout: USER
  },
  {
    path: '/',
    component: HomePage,
    name: "Home",
    noAuth: true,
    layout: USER
  },

];
export const baseRoutes = [
];