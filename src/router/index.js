import MainLayout from '../components/layout';
// GeneralViews
import Login from '../components/pages/Login';
import Home from '../components/pages/Home';
import CreateProduct from '../components/pages/CreateProduct';
import ProductDetails from '../components/pages/ProductDetails';

export const dashboardRoutes = [
  {
    path: '/',
    component: Home,
    name: "Home",
    icon: "shop",
    showAlways: true,
  },
  {
    path: '/create-product',
    component: CreateProduct,
    name: "Create Product",
    icon: "upload",
    showAlways: true,
  },
  {
    path: '/product/:productSlug',
    component: ProductDetails,
    name: "Product details",
    icon: "team",
    showAlways: false,
  },
];
export const baseRoutes = [
  {
    path: '/login',
    component: Login,
    name: "Dashboard",
    noAuth: true,
  },
  {
    path: '/',
    component: MainLayout,
    name: "Main Layout",
  },
];