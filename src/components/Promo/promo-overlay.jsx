import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useState } from "react";
import { validateDataForm } from "../../scripts/helpers/validation";
import Select from "../../scripts/components/select";
import axiosClient from "../../scripts/helpers/config";
import React from 'react';

const percents = new Array(101).fill(1).map((item, index) => ({
  title: index,
  value: index,
}));

const statuss = new Array(2).fill(1).map((item, index) => ({
  title: `${Boolean(index)}`,
  value: `${Boolean(index)}`,
}));

function PopUpPromo({ cx, id, code, amount, percent, maxAmount, status, startDate, endDate, onClick }) {
  const [codeUpdate, setCode] = useState(code);
  const [percentUpdate, setPercent] = useState(percent);
  const [amountUpdate, setAmount] = useState(amount);
  const [maxAmountUpdate, setMaxAmount] = useState(maxAmount);
  const [expireUpdate, setExpires] = useState(() => {
    const date = new Date(endDate);
    const day= date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();
    const month = date.getMonth() + 1 >= 10  ?  date.getMonth() + 1 : "0"+ (date.getMonth() + 1);
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  });

  const [startDateUpdate, setStartDate] = useState(() => {
    const date = new Date(startDate);
    const day= date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();
    const month = date.getMonth() + 1 >= 10  ?  date.getMonth() + 1 : "0"+ (date.getMonth() + 1);
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
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
    const valid = validateDataForm(obj);

    if (valid) {
      axiosClient.put(`${process.env.REACT_APP_URL}/promotion/${id}`,obj)
      .then(res => {
        console.log("success",res);

        window.location.reload()
      })
      .catch(err => {
        console.log(err);
      })
    }
  };

  const onDelete = useCallback((id) => {
    axiosClient.delete(`${process.env.REACT_APP_URL}/promotion/${id}`)
            .then(res => {
              window.location.reload()
            })
  }, []);

  return (
    <section
      className="overlay"
      onClick={(e) => {
        onClick();
      }}
    >
      <form
        action="#"
        className="form-wrapper"
        onSubmit={onSubmit}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <h2 className="heading">add promotion</h2>
        <section className="form-data">
          <FormDataItem label="code" id="code">
            <Input
              type="text"
              name="codeUpdate"
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
                name="percentUpdate"
                value={percentUpdate}
                onChange={(event) => {
                  setPercent(event.target.value);
                }}
              />
            </FormDataItem>
            <FormDataItem label="status" id="status">
              <Select
                datas={statuss}
                name="statusUpdate"
                value={statusUpdate}
                onChange={(event) => {
                  console.log(event.target.value);
                  setStatus(event.target.value);
                }}
              />
            </FormDataItem>
          </div>
          <div className={"form-group"}>
            <FormDataItem label="amount" id="amount">
              <Input
                type="text"
                name="amountUpdate"
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
                name="maxAmountUpdate"
                value={maxAmountUpdate}
                placeholder="Enter max amount.."
                onChange={(event) => {
                  setMaxAmount(event.target.value);
                }}
              />
            </FormDataItem>
          </div>
          <div className={"form-group"}>
            {
              console.log(startDateUpdate)
            }
            <FormDataItem label="startDate" id="startDate">
              <input
                type="date"
                name="startDateUpdate"
                value={startDateUpdate}
                onChange={(event) => {
              setStartDate(event.target.value);
                }}
              />
            </FormDataItem>
            <FormDataItem label="expire" id="expire">
              <input
                type="date"
                name="expireUpdate"
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
    </section>
  );
}

export default PopUpPromo;
