import DashboardIcon from "../assets/icons/dashboard.svg";
import IconChart from "../assets/icons/icon-chart.svg";
import ShippingIcon from "../assets/icons/shipping.svg";
import ProductIcon from "../assets/icons/product.svg";
import UserIcon from "../assets/icons/user.svg";
import IconLabel from '../assets/icons/icon-label.svg'

const sidebar_menu = [
  {
    id: 1,
    icon: IconChart,
    path: "/",
    title: "Home",
  },
  {
    id: 2,
    icon: DashboardIcon,
    path: "/admin/categories",
    title: "Category",
  },
  {
    id: 3,
    icon: IconLabel,
    path: "/admin/brands",
    title: "Brands",
  },
  {
    id: 4,
    icon: ProductIcon,
    path: "/admin/products",
    title: "Products",
  },
  {
    id: 5,
    icon: UserIcon,
    path: "/admin/users",
    title: "Users",
  },
  {
    id: 6,
    icon: ShippingIcon,
    path: "/admin/promotion",
    title: "Promo",
  },
];

export default sidebar_menu;
