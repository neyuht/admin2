import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";

const SideBarItem = ({ item, active }) => {
  return (
    <Link
      to={item.path}
      className={active ? "sidebar-item-active" : "sidebar-item"}
    >
      <div className="sidebar-content">
        <img
          src={item.icon}
          alt={`icon-${item.icon}`}
          className="sidebar-item-icon"
        />
        <span className="sidebar-item-label">{item.title}</span>
      </div>
      <div className="sidebar-details">
        <span className="sidebar-radius sidebar-top"></span>
        <span className="sidebar-radius sidebar-bottom"></span>
      </div>
    </Link>
  );
};
export default SideBarItem;
