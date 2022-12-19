import React from "react";
import User from "../../assets/icons/user.png";

function RecentItems({ image, firstName, lastName, email, phone, index }) {
  return (
    <tr
      key={index + "promo-table-item"}
      style={{
        border: "1px solid #eee",
      }}
    >
      <td>
        {image ? (
          <img
            src={image}
            className="dashboard-content-avatar"
            alt={firstName + " " + lastName}
          />
        ) : (
          <img
            src={User}
            className="dashboard-content-avatar"
            alt={firstName + " " + lastName}
          />
        )}
      </td>
      <td style={{ width: "300px" }}>
        <p>{email}</p>
      </td>
      <td style={{ width: "200px" }}>
        <p>
          {firstName} {lastName}
        </p>
      </td>
      <td>
        <p>123123</p>
      </td>
    </tr>
  );
}

export default RecentItems;
