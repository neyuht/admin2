import React from "react";

function CategoryItem({
  id,
  code,
  amount,
  startDate,
  expire,
  status,
  onClick,
}) {
  return (
    <tr
      className={"promo-table-item"}
      key={id + "promo-item"}
      onClick={(e) => {
        onClick(e, id);
      }}
    >
      <td>
        <p>{code}</p>
      </td>
      <td>
        <p>{amount}</p>
      </td>
      <td>
        <p>{startDate}</p>
      </td>
      <td>
        <p>{expire}</p>
      </td>
      <td>
        <p>{status}</p>
      </td>
    </tr>
  );
}

export default CategoryItem;
