import React from "react";

function ProductItem({
  id,
  productName,
  productsVariant,
  description,
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
      <td>{status === 1 ? <p>Available</p> : <p>Sold Out</p>}</td>
      <td>
        <p style={{ paddingLeft: "50px  " }}>{productsVariant.length}</p>
      </td>
      <td className="product-list-description">
        <p>{description}</p>
      </td>
    </tr>
  );
}

export default ProductItem;
