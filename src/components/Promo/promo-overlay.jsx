import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useEffect, useState } from "react";
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
import showHide from "../../scripts/helpers/showHide";

const percents = new Array(101).fill(1).map((item, index) => ({
  title: index,
  value: index,
}));

const statuss = new Array(2).fill(1).map((item, index) => ({
  title: `${Boolean(index) ? "Available" : "Expired"}`,
  value: `${index}`,
}));

function PopUpPromo({
  cx,
  id,
  code,
  amount,
  percent,
  maxAmount,
  status,
  startDate,
  endDate,
}) {
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [codeUpdate, setCode] = useState(code);
  const [percentUpdate, setPercent] = useState(percent);
  const [amountUpdate, setAmount] = useState(amount);
  const [maxAmountUpdate, setMaxAmount] = useState(maxAmount);
  const [expireUpdate, setExpires] = useState(() => {
    const date = new Date(endDate);
    const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    const month =
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  });

  const [startDateUpdate, setStartDate] = useState(() => {
    const date = new Date(startDate);
    const day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    const month =
      date.getMonth() + 1 >= 10
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  });
  const [statusUpdate, setStatus] = useState(status);

  const onSubmit = (event) => {
    event.preventDefault();
    const obj = {
      code: codeUpdate,
      percent: parseInt(percentUpdate),
      amount: amountUpdate,
      maxAmount: maxAmountUpdate,
      startDate: startDateUpdate,
      endDate: expireUpdate,
    };

    changeStyleElementByObject(obj, "boxShadow", "0 0 0 0.3mm");
    let result = validate(obj);
    if (result.error) {
      return;
    }

    result = validateCode(codeUpdate);
    if (result.error) {
      return;
    }

    result = validateNumber({
      amount,
      maxAmount,
    });
    if (result.error) {
      return;
    }
    result = validateOperator({
      amount,
      maxAmount,
    });
    if (result.error) {
      return;
    }

    axiosClient
      .put(`${process.env.REACT_APP_URL}/promotion/${id}`, obj)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  };

  const onDelete = useCallback((id) => {
    axiosClient
      .delete(`${process.env.REACT_APP_URL}/promotion/${id}`)
      .then((res) => {
        window.location.reload();
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  }, []);

  return (
    <form
      action="#"
      className="form-wrapper"
      onSubmit={onSubmit}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h2 className="heading">Promotion</h2>
      <section className="form-data">
        <FormDataItem label="code" id="code">
          <Input
            type="text"
            name="code"
            value={codeUpdate}
            placeholder="Enter code.."
            onChange={(event) => {
              setCode(event.target.value);
            }}
          />
        </FormDataItem>
        <div className={"form-group"}>
          <FormDataItem label="percent" id="percent">
            <Select
              datas={percents}
              name="percent"
              value={percentUpdate}
              onChange={(event) => {
                setPercent(event.target.value);
              }}
            />
          </FormDataItem>
          <FormDataItem label="status" id="status">
            <Select
              datas={statuss}
              name="status"
              value={statusUpdate}
              onChange={(event) => {
                setStatus(event.target.value);
              }}
            />
          </FormDataItem>
        </div>
        <div className={"form-group"}>
          <FormDataItem label="amount" id="amount">
            <Input
              type="text"
              name="amount"
              value={amountUpdate}
              placeholder="Enter amount.."
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
          </FormDataItem>
          <FormDataItem label="max amount" id="maxAmount">
            <Input
              type="text"
              name="maxAmount"
              value={maxAmountUpdate}
              placeholder="Enter max amount.."
              onChange={(event) => {
                setMaxAmount(event.target.value);
              }}
            />
          </FormDataItem>
        </div>
        <div className={"form-group"}>
          <FormDataItem label="startDate" id="startDate">
            <input
              type="date"
              name="startDate"
              value={startDateUpdate}
              onChange={(event) => {
                setStartDate(event.target.value);
              }}
            />
          </FormDataItem>
          <FormDataItem label="endDate" id="endDate">
            <input
              type="date"
              name="endDate"
              value={expireUpdate}
              onChange={(event) => {
                setExpires(event.target.value);
              }}
            />
          </FormDataItem>
        </div>
      </section>
      <div className={"form-cta"}>
        <Button type="submit" title="submit" onClick={onSubmit} />
        <Button
          type="button"
          title="delete"
          onClick={(e) => {
            onDelete(id);
          }}
        />
      </div>
    </form>
  );
}

export default PopUpPromo;
