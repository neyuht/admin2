import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { adminLogin } from "../../service/authService";

import "./style.css";

export default function LoginForm() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //Prevent page reload
    const data = {
      email: username,
      password: password,
    };
    adminLogin(data).then((res) => {
      localStorage.setItem("token", "Bearer " + res.data.data);
      console.log(localStorage.getItem("token"));
      window.location.reload(false);
    });
    console.log(data);
  };

  return (
    <div className="login-wrapper">
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
      </div>
      <form onClick={handleSubmit}>
        <h3>Please Login</h3>

        <label for="username">Username</label>
        <input type="text" placeholder="Email or Phone" id="username" />

        <label for="password">Password</label>
        <input type="password" placeholder="Password" id="password" />

        <button class="btn-login" type="button">
          Submit
        </button>
      </form>
    </div>
  );
}
