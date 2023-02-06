import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import axiosClient from "../../scripts/helpers/config";
import DashboardHeader from "../../components/DashboardHeader";
function ChangePass() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    var pass = document.getElementById("pass").value;
    var passcf = document.getElementById("passcf").value;
    //Prevent page reload
    const data = {
      password: pass,
      passwordConfirmation: passcf,
    };
    console.log(data);
    axiosClient
      .put(`http://localhost:8080/api/v1/admin/users/changePass`, data)
      .then((res) => {
        alert(res.message);
        setTimeout(() => window.location.reload(), 3000);
      })
      .catch(() => {
        alert("Change password faild!!");
        setTimeout(() => window.location.reload(), 3000);
      });
  };
  const [admindata, setAdmindata] = useState([]);
  useEffect(() => {
    axiosClient
      .get(`http://localhost:8080/api/v1/admin/users/info`)
      .then((response) => {
        const data = response.data;
        setAdmindata(data);
        console.log(admindata);
      });
  }, []);
  const renderFormLogin = (
    <div className="form-change">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>
            <FontAwesomeIcon icon={faUser} />
            UserName{" "}
          </label>
          <input
            className="input-data"
            type="text"
            disabled="disabled"
            name="uname"
            placeholder={admindata.loginName}
            required
          />
        </div>
        <div className="input-container">
          <label>
            <FontAwesomeIcon icon={faLock} /> Password{" "}
          </label>
          <input className="input-data" type="password" id="pass" required />
        </div>
        <div className="input-container">
          <label>
            <FontAwesomeIcon icon={faLock} /> Comfirm Password{" "}
          </label>
          <input className="input-data" type="password" id="passcf" required />
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
