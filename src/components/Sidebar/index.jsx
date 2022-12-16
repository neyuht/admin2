import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SideBarItem from "./sidebar-item";

import "./styles.css";
import logo from "../../assets/images/white-logo.png";

function SideBar({ menu }) {
  const location = useLocation();

  const [active, setActive] = useState(1);

  useEffect(() => {
    menu.forEach((element) => {
      if (location.pathname === element.path) {
        setActive(element.id);
      }
    });
  }, [location.pathname]);

  const __navigate = (id) => {
    setActive(id);
  };

  const showHideMenu = (e) => {
    const logo = document.querySelector(".icon-logo-brand");
    const label = document.querySelectorAll(".sidebar-item-label");
    const width1 = document.querySelector(
      ".sidebar-item-active .sidebar-content"
    );
    const width2 = document.querySelectorAll(".sidebar-content");
    const menuBar = document.querySelector(".menu-bar");
    const sidebar = document.querySelector(".sidebar");

    if (menuBar.classList.contains("selected")) {
      label.forEach((item) => {
        item.classList.remove("hide");
      });
      logo.classList.remove("hide");
      menuBar.classList.remove("selected");
      sidebar.style.width = "320px";
      width1.style.width = "250px";
      width2.forEach((item) => {
        item.style.width = "250px";
      });
    } else {
      logo.classList.add("hide");
      menuBar.classList.add("selected");
      width1.style.width = "80px";
      width2.forEach((item) => {
        item.style.width = "80px";
      });
      label.forEach((item) => {
        item.classList.add("hide");
      });
      sidebar.style.width = "150px";
    }
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-p">
        <div className="sidebar-container">
          <div className="sidebar-logo-container">
            <div className="menu-bar" onClick={showHideMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <img src={logo} className="icon-logo-brand" alt="logo" />
          </div>

          <div className="sidebar-container">
            <div className="sidebar-items">
              {menu.map((item, index) => (
                <div
                  className="sidebar-box"
                  key={index}
                  onClick={() => __navigate(item.id)}
                >
                  <SideBarItem active={item.id === active} item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
