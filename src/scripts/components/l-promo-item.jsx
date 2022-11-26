import React from 'react';

function PromoItem({ id, code, percent, amount, maxAmount, startDate, expire, status, onClick }) {
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
        <p>{percent}</p>
      </td>
      <td>
        <p>{amount}</p>
      </td>
      <td>
        <p>{maxAmount}</p>
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

export default PromoItem;
