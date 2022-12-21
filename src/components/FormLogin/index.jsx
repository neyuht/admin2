import { adminLogin } from "../../service/authService";
import React, { useState, useEffect } from "react";
import "./style.css";

export default function LoginForm() {
  const click = (event) => {
    event.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    //Prevent page reload
    const data = {
      email: username,
      password: password,
    };
    console.log(data);
    adminLogin(data).then((res) => {
      console.log(res);
      localStorage.setItem("token", "Bearer " + res.data.data);
      if (localStorage.getItem("token") == "") {
        alert("Login fff");
      } else {
        alert("Login succsecfuly");
      }
      window.location.reload(false);
    });
  };

  return (
    <div className="login-wrapper">
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
      </div>
      <form className="form-login">
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
        <button class="btn-login" type="button" onClick={click}>
          Login
        </button>
      </form>
    </div>
  );
}
