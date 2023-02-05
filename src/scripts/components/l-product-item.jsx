import React from "react";

function ProductItem({
  id,
  productName,
  brand,
  price,
  quantity,
  status,
  onClick,
}) {
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
        <p>{productName}</p>
      </td>
      <td>{status === true ? <p>Available</p> : <p>Sold Out</p>}</td>
      <td>
        <p>{price}</p>
      </td>
      <td>
        <p>{quantity}</p>
      </td>
      <td className="product-list-description">
        <p>{brand}</p>
      </td>
    </tr>
  );
}

export default ProductItem;
