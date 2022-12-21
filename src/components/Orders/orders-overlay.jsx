import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useState } from "react";
import {
  validate,
  validateCode,
  validateNumber,
  validateOperator,
} from "../../scripts/helpers/validation";
import Select from "../../scripts/components/select";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import { changeStyleElementByObject } from "../../scripts/helpers/styles-change";
import User from "../../assets/icons/user.png";
import OrderItemsForm from "../../scripts/components/I-orderItems-form";
import showHide from "../../scripts/helpers/showHide";

function OrderOverlay({ data }) {
  const [update, setUpdate] = useState(data);
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .put(`${process.env.REACT_APP_URL}/orders/${data.id}`, update)
      .then((res) => {
        window.location.reload();
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  };

  return (
    <form
      action="#"
      className="form-wrapper"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h2 className="heading">Orders</h2>
      <section className="form-data">
        <div className="information-left">
          <div className={"form-infor"}>
            <div className="infor-user-orders">
              <figure className="ava-user-orders">
                <img src={User} alt="" />
              </figure>
              <p>{data.user.firstName + " " + data.user.lastName}</p>
            </div>
            <div className="infor-orders">
              <span>ID: #{data.id}</span>
            </div>
          </div>
          <div className={"form-group form-group-infor"}>
            <FormDataItem label="Status" id="status">
              <select
                name="status"
                id=""
                className={"products-status"}
                value={update.status}
                onChange={(e) => {
                  const value = e.target.value;
                  setUpdate((prev) => {
                    return {
                      ...prev,
                      status: value,
                    };
                  });
                }}
              >
                <option value="0">Pending</option>
                <option value="2">Canceled</option>
                <option value="1">Success</option>
              </select>
            </FormDataItem>
            <div>
              <label htmlFor="">Date</label>
              <p>{data.createdAt}</p>
            </div>
          </div>
          <div className={"form-group description-update"}>
            <label>Description</label>
            <textarea
              name="description"
              type="text"
              className={"products-description-update"}
              placeholder="Product's Description"
              disabled
              style={{ height: "80px" }}
              value={data.description}
            />
          </div>
          <div className="form-group" style={{ marginTop: "20px" }}>
            <span>
              <strong>Total: </strong>
            </span>
            <span>{data.total}</span>
          </div>
        </div>
        <div className="list-order-items">
          <table>
            <thead>
              <th>Product's Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </thead>
          </table>
          <div className="table-order-items">
            {data.orderItems.map((order, index) => (
              <OrderItemsForm
                name={order.productVariant.displayName}
                quantity={order.quantity}
                unitPrice={order.productVariant.unitPrice}
                index={index}
              />
            ))}
          </div>
        </div>
        <div>
          <Button type="submit" title="Update" onClick={onSubmit} />
        </div>
      </section>
    </form>
  );
}

export default OrderOverlay;
