import React from "react";
import axiosClient from "../../scripts/helpers/config";
import { useEffect, useState } from "react";
import "../styles.css";

function ViewProfile() {
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
  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>View Profile</h2>
        </div>

        <div className="wapper">
          <div className="admin-left">
            <div className="avatar-admin">
              <img src="https://reqres.in/img/faces/9-image.jpg" alt="" />
              <div className="fullname">Tran An Thuyen</div>
            </div>
          </div>
          <div className="admin-right">
            <div className="left">
              <label>Login Name</label>
              <div className="buttom-text">{admindata.loginName}</div>
            </div>
            <div className="right">
              <label>CreateAt</label>
              <div className="buttom-text">
                {new Date(admindata.createdAt).toLocaleDateString("en-GB")}
              </div>
            </div>
            <div className="left">
              <label>ID</label>
              <div className="buttom-text">#{admindata.id}</div>
            </div>
            <div className="right">
              <label>UpdateAt</label>
              <div className="buttom-text">
                {new Date(admindata.updatedAt).toLocaleDateString("en-GB")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
