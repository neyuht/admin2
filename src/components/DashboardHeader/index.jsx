import React from "react";

import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faLock,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";

function DashboardHeader() {
  function logout() {
    window.localStorage.clear();
    window.location.reload();
    alert("Logout successful");
  }
  return (
    <div className="dashbord-header-container">
      <div className="admin-pnl"># Admin Pannel</div>

      <div className="dashbord-header-right">
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
    </div>
  );
}

export default DashboardHeader;
