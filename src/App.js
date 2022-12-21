import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SideBar from "./components/Sidebar";
import sidebar_menu from "./constants/sidebar-menu";

import "./App.css";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import CategoriesTab from "./components/Categories";
import ViewProfile from "./pages/ViewProfile";
import ChangePass from "./pages/ChangePass";
import Login from "./pages/Login";
import Pesudo from "./pages/Promotion/promotion";
import Promo from "./components/Promo";
import LoginForm from "./components/FormLogin";
import { isAdmin } from "./service/authService";
import {
  faCircleUser,
  faLock,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import UsersTab from "./components/Users";
import Users from "./pages/Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  useEffect(() => {
    isAdmin().then((res) => {
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
  const logout = () => {
    localStorage.clear();
    alert("Logout succsecfuly");
    window.location.reload(false);
  };
  return (
    <Router>
      <div className="dashboard-container">
        <SideBar menu={sidebar_menu} />

        <div className="dashboard-body">
          <div className="dashboard-header">
            <div class="dropdown">
              <button class="dropbtn">
                {" "}
                <img
                  className="dashbord-header-avatar"
                  src="https://reqres.in/img/faces/9-image.jpg"
                />
              </button>
              <div class="dropdown-content">
                <div className="text-username">An Thuyen</div>
                <br />
                <div className="text-role">Admin</div>
                <hr />
                <a href="/admin/view">
                  {" "}
                  <FontAwesomeIcon icon={faCircleUser} /> &nbsp; View Profile
                </a>
                <a href="/admin/change-pass">
                  <FontAwesomeIcon icon={faLock} /> &nbsp; Change Password
                </a>
                <a className="logout-hv" onClick={logout}>
                  <FontAwesomeIcon icon={faToggleOff} /> &nbsp;Logout
                </a>
              </div>
            </div>
          </div>
          <Routes>
            <Route exact path="/" element={<Orders />} />
            <Route
              exact
              path="/admin/categories"
              element={
                <Categories>
                  <CategoriesTab />
                </Categories>
              }
            />
            <Route
              exact
              path="/admin/users"
              element={
                <Users>
                  {" "}
                  <UsersTab />{" "}
                </Users>
              }
            />
            <Route exact path="/admin/products" element={<Products />} />
            <Route
              exact
              path="/admin/categories"
              element={
                <Categories>
                  <CategoriesTab />
                </Categories>
              }
            />
            <Route exact path="/admin/view" element={<ViewProfile />} />
            <Route exact path="/admin/change-pass" element={<ChangePass />} />
            <Route
              exact
              path="/admin/promotion"
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
