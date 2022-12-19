import React from "react";

function ProductItem({ id, productName, amount, category, status, onClick }) {
  return (
    <tr
      className={"promo-table-item"}
      key={id + "product-item"}
      onClick={(e) => {
        onClick(e, id);
      }}
    >
      <td>
        <p>{productName}</p>
      </td>
      <td>{status === 1 ? <p>Available</p> : <p>Sold Out</p>}</td>
      <td>
        <p>{amount}</p>
      </td>
      <td>
        <p>{category}</p>
      </td>
    </tr>
  );
}

export default ProductItem;
