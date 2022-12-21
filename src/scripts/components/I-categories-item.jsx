import React from "react";

function CategoriesItem({ id, name, createAt, updateAt, deleteAt, onClick }) {
  return (
    <tr
      className={"promo-table-item"}
      key={id + "product-item"}
      onClick={(e) => {
        onClick(e, id);
      }}
    >
      <td>
        <p>{id}</p>
      </td>
      <td>
        <p>{name}</p>
      </td>
      <td>
        <p>{createAt}</p>
      </td>
      <td>
        <p>{updateAt}</p>
      </td>
    </tr>
  );
}

export default CategoriesItem;
