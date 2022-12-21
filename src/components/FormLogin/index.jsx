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
    adminLogin(data)
      .then((res) => {
        localStorage.setItem("token", "Bearer " + res.data.data);
        document.getElementById("noti").innerHTML =
          "Successful login please wait!!";
        document.getElementById("noti").style.backgroundColor = "#008545b0";
        setTimeout(() => window.location.reload(), 3000);
      })
      .catch((err) => {
        document.getElementById("noti").innerHTML =
          "Login Faild! Incorrect account or password!!";
        document.getElementById("noti").style.backgroundColor = "#a4000087";
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
          required
        />

        <label for="password"></label>
        <input
          class="input-data"
          type="password"
          placeholder="Password"
          id="password"
          required
        />
        <div className="setnoti" id="noti"></div>
        <div className="khoang"></div>
        <button class="btn-login" type="button" onClick={click}>
          Login System
        </button>
      </form>
    </div>
  );
}
