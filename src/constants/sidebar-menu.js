import DashboardIcon from "../assets/icons/dashboard.svg";
import ShippingIcon from "../assets/icons/shipping.svg";
import ProductIcon from "../assets/icons/product.svg";
import UserIcon from "../assets/icons/user.svg";

const sidebar_menu = [
  {
    id: 1,
    icon: DashboardIcon,
    path: "/admin/categories",
    title: "Category",
  },
  {
    id: 2,
    icon: ProductIcon,
    path: "/admin/products",
    title: "Products",
  },
  {
    id: 3,
    icon: ShippingIcon,
    path: "/admin/orders",
    title: "List Oder",
  },
  {
    id: 4,
    icon: UserIcon,
    path: "/admin/promo",
    title: "Promo",
  },
  {
    id: 5,
    icon: ProductIcon,
    path: "/admin/login",
    title: "Login",
  },
];

export default sidebar_menu;
