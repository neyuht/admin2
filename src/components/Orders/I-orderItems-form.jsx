import React from "react";

function OrderItemsForm({ name, quantity, unitPrice, index }) {
  return (
    <div
      key={index + "product-item"}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid #eee",
      }}
    >
      <td style={{ width: "180px" }}>
        <p>{name}</p>
      </td>
      <td>
        <p>{quantity}</p>
      </td>
      <td>
        <p>{Math.round(unitPrice)}</p>
      </td>
    </div>
  );
}

export default OrderItemsForm;
