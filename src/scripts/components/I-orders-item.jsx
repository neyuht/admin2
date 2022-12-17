import React from "react";

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
        <p></p>
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
