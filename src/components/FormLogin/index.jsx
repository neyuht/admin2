import React from "react";
import { adminLogin } from "../../service/authService";

import "./style.css";

export default function LoginForm() {
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
      alert("Login succsecfuly");
      window.location.reload(false);
    });
  };

  return (
    <div className="login-wrapper">
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
      </div>
      <form className="form-login" onClick={handleSubmit}>
        <h3>Please Login</h3>

        <label for="username"></label>
        <input
          class="input-data"
          type="text"
          placeholder="Email or Phone"
          id="username"
        />

        <label for="password"></label>
        <input
          class="input-data"
          type="password"
          placeholder="Password"
          id="password"
        />
        <div className="khoang"></div>
        <button class="btn-login" type="button">
          Submit
        </button>
      </form>
    </div>
  );
}
