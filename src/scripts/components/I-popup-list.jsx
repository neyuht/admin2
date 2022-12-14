import React from "react";
import User from "../../assets/icons/user.png";

function RecentItems({
  image,
  firstName,
  id,
  lastName,
  email,
  date,
  phone,
  index,
  roles,
  username,
  description,
}) {
  return roles === "user" ? (
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
        <p>{phone}</p>
      </td>
    </tr>
  ) : (
    <tr
      key={index + "promo-table-item"}
      style={{
        border: "1px solid #eee",
      }}
    >
      <td>{id}</td>
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
      <td>{new Date(date).toLocaleDateString("en-GB")}</td>
      <td style={{ width: "200px" }}>
        <p>{username}</p>
      </td>
      <td style={{ width: "400px" }}>
        <p>{description}</p>
      </td>
    </tr>
  );
}

export default RecentItems;
