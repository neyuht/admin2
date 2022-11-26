import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SideBar from "./components/Sidebar";
import sidebar_menu from "./constants/sidebar-menu";

import "./App.css";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <div className="dashboard-container">
        <SideBar menu={sidebar_menu} />

        <div className="dashboard-body">
          <Routes>

            <Route exact path="" element={<Categories />} />
            <Route exact path="/admin/orders" element={<Orders />} />
            <Route exact path="/admin/products" element={<Products />} />
            <Route exact path="/admin/categories" element={<Categories />} />
            <Route path = "/admin/login" element={<Login />}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
