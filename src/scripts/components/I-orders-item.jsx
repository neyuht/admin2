import React from "react";
import User from "../../assets/icons/user.png";
import DoneIcon from "../../assets/icons/done.svg";
import CancelIcon from "../../assets/icons/cancel.svg";
import Pending from "../../assets/icons/pending.svg";

function OrderItems({
  id,
  createdAt,
  status,
  image,
  firstName,
  lastName,
  total,
  onClick,
}) {
  return (
    <tr
      key={id}
      className="list-order-itemsz"
      onClick={(e) => {
        onClick(e, id);
      }}
    >
      <td>
        <span>{id}</span>
      </td>
      <td>
        <span></span>
        <span>{new Date(createdAt).toLocaleDateString("en-GB")}</span>
      </td>
      <td>
        {status === 1 ? (
          <div>
            <img
              src={DoneIcon}
              alt="paid-icon"
              className="dashboard-content-icon"
            />
            <span>Success</span>
          </div>
        ) : status === 2 ? (
          <div>
            <img
              src={CancelIcon}
              alt="canceled-icon"
              className="dashboard-content-icon"
            />
            <span>Canceled</span>
          </div>
        ) : status === 0 ? (
          <div>
            <img
              src={Pending}
              alt="pending-icon"
              className="dashboard-content-icon"
            />
            <span>Pending</span>
          </div>
        ) : null}
      </td>
      <td>
        <div>
          {image ? (
            <img
              src={image}
              className="dashboard-content-avatar"
              alt={firstName + " " + lastName}
            />
          ) : (
            <img
              src={User}
              className="dashboard-content-avatar"
              alt={firstName + " " + lastName}
            />
          )}

          <span>
            {firstName} {lastName}
          </span>
        </div>
      </td>
      <td>{total}</td>
    </tr>
  );
}

export default OrderItems;
