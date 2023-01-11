import React from "react";

function BrandItem({ id, name, createAt, onClick }) {
  return (
    <tr
      className={"promo-table-item"}
      key={id + "product-item"}
      onClick={(e) => {
        onClick(e, id);
      }}
    >
      <td>
        <p>#{id}</p>
      </td>
      <td>
        <p>{name}</p>
      </td>
      <td>
        <p>{createAt}</p>
      </td>
    </tr>
  );
}

export default BrandItem;
