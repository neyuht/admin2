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
import OrderItemsForm from "./I-orderItems-form";

function OrderOverlay({ data }) {
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
          <div className={"form-group"}>
            <div>
              <label htmlFor="">Status</label>
              {data.status === 1 ? (
                <p>Success</p>
              ) : data.status === 2 ? (
                <p>Canceled</p>
              ) : data.status === 0 ? (
                <p>Pending</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="">Status</label>
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
              style={{ height: "80px" }}
              value={data.description}
            />
          </div>
          <div className="form-group" style={{ marginTop: "20px" }}>
            {console.log(data.orderItems)}
            <span>
              <strong>Total: </strong>
            </span>
            <span>123123123</span>
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
      </section>
    </form>
  );
}

export default OrderOverlay;
