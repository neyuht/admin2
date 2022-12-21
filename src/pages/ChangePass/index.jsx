import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import DashboardHeader from "../../components/DashboardHeader";
function ChangePass() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const renderFormLogin = (
    <div className="form-change">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>
            <FontAwesomeIcon icon={faUser} /> Username{" "}
          </label>
          <input
            className="input-data"
            type="text"
            disabled="disabled"
            name="uname"
            placeholder="username"
            required
          />
        </div>
        <div className="input-container">
          <label>
            <FontAwesomeIcon icon={faLock} /> Password{" "}
          </label>
          <input className="input-data" type="password" name="pass" required />
        </div>
        <div className="input-container">
          <label>
            <FontAwesomeIcon icon={faLock} /> Comfirm Password{" "}
          </label>
          <input className="input-data" type="password" name="pass" required />
        </div>
        <div className="button-container">
          <button class="btn-change" type="button" onClick={handleSubmit}>
            Change
          </button>
        </div>
      </form>
    </div>
  );
  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>Change Password</h2>
        </div>

        <div className="login-form">
          {isSubmitted ? (
            <div>Noti: Login is successfully!</div>
          ) : (
            renderFormLogin
          )}
        </div>
      </div>
    </div>
  );
}

export default ChangePass;
