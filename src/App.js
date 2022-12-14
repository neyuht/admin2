import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SideBar from "./components/Sidebar";
import sidebar_menu from "./constants/sidebar-menu";

import "./App.css";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import ViewProfile from "./pages/ViewProfile";
import ChangePass from "./pages/ChangePass";
import Login from "./pages/Login";
import Pesudo from "./pages/Promotion/promotion";
import Promo from "./components/Promo";
import LoginForm from "./components/FormLogin";
import { isAdmin } from "./service/authService";
function App() {
  useEffect(() => {
    isAdmin().then((res) => {
      console.log(res);
      if (res.statusCode == 401) {
        setToken(false);
      } else {
        setToken(true);
      }
    });
  }, []);

  const [token, setToken] = useState();
  if (!token) {
    return <LoginForm setToken={setToken} />;
  }
  return (
    <Router>
      <div className="dashboard-container">
        <SideBar menu={sidebar_menu} />

        <div className="dashboard-body">
          <Routes>
            <Route exact path="/" element={<Categories />} />
            <Route exact path="/admin/orders" element={<Orders />} />
            <Route exact path="/admin/products" element={<Products />} />
            <Route exact path="/admin/categories" element={<Categories />} />
            <Route exact path="/admin/view" element={<ViewProfile />} />
            <Route exact path="/admin/change-pass" element={<ChangePass />} />
            <Route
              exact
              path="/admin/promo"
              element={
                <Pesudo>
                  {" "}
                  <Promo />{" "}
                </Pesudo>
              }
            />
            <Route exact path="/admin/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
