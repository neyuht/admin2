import DashboardIcon from "../assets/icons/dashboard.svg";
import ShippingIcon from "../assets/icons/shipping.svg";
import ProductIcon from "../assets/icons/product.svg";
import UserIcon from "../assets/icons/user.svg";

const sidebar_menu = [
  {
    id: 1,
    icon: DashboardIcon,
    path: "/categorys",
    title: "Category",
  },
  {
    id: 2,
    icon: ProductIcon,
    path: "/products",
    title: "Products",
  },
  {
    id: 3,
    icon: ShippingIcon,
    path: "/orders",
    title: "List Oder",
  },
  {
    id: 4,
    icon: UserIcon,
    path: "/promo",
    title: "Promo",
  },
];

export default sidebar_menu;
