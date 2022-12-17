import React from "react";
import userImage from "../../assets/icons/user.png";
function UserItems({ id, images, firstName, lastName, email, phone, onClick }) {
  return (
    <tr
      className={"promo-table-item"}
      key={id + "promo-item"}
      onClick={(e) => {
        onClick(e, id);
      }}
    >
      <td>
        {images ? (
          <img className="avatar-user-list" src={images} alt="" />
        ) : (
          <img className="avatar-user-list" src={userImage} alt="" />
        )}
      </td>
      <td>
        <p>{firstName}</p>
      </td>
      <td>
        <p>{lastName}</p>
      </td>
      <td>
        <p>{email}</p>
      </td>
      <td>
        <p>{phone}</p>
      </td>
    </tr>
  );
}

export default UserItems;
