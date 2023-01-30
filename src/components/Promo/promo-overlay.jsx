import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useState } from "react";
import Select from "../../scripts/components/select";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import {
  changeStyleElementByObject,
  clearStyle,
} from "../../scripts/helpers/styles-change";
import showHide from "../../scripts/helpers/showHide";
import { convertDate } from "../../scripts/helpers/convert";
import {
  validation,
  validationDate,
  checkDate,
} from "../../scripts/helpers/validation2";
import { regex } from "../../scripts/helpers/constants";

const percents = new Array(101).fill(1).map((item, index) => ({
  title: index,
  value: index,
}));

const statuss = new Array(2).fill(1).map((item, index) => ({
  title: `${Boolean(index) ? "Available" : "Expired"}`,
  value: `${index}`,
}));

function PopUpPromo({ obj }) {
  const { id, code, amount, status, startDate, endDate } = obj;
  const startConvert = convertDate(startDate);
  const endConvert = convertDate(endDate);

  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [codeUpdate, setCode] = useState(code);
  const [amountUpdate, setAmount] = useState(amount);
  const [expireUpdate, setExpires] = useState(endConvert);

  const [startDateUpdate, setStartDate] = useState(startConvert);
  const [statusUpdate, setStatus] = useState(status);
  const onSubmit = (event) => {
    event.preventDefault();
    const obj = {
      code: codeUpdate,
      amount: amountUpdate,
      status: `${statusUpdate}`,
      startDate: startDateUpdate,
      endDate: expireUpdate,
    };

    clearStyle(obj);
    const regexT = {
      code: [
        {
          type: regex.regexCheckMaxLength,
          message: "At least 6 characters",
        },
        {
          type: regex.regexFirstCharacter,
          message: "First capital letter",
        },
      ],
      amount: [
        {
          type: regex.regexGreaterThan0,
          message: "More than 0",
        },
      ],
    };
    const empty = validation(obj, regexT);
    let errField = { error: false };

    if (empty.error) {
      errField = {
        ...errField,
        error: true,
        ...empty.field,
      };
    }

    if (startConvert !== startDateUpdate || endConvert !== expireUpdate) {
      const sDate = {
        field: "startDate",
        value: startDateUpdate,
      };
      const eDate = {
        field: "endDate",
        value: expireUpdate,
      };
      const { error: sErr, ...sRest } = validationDate(sDate);
      const { error: eErr, ...eRest } = validationDate(eDate);
      const { error: exErr, ...exRest } = checkDate(sDate, eDate);
      if (eErr) {
        errField = {
          ...errField,
          error: true,
          ...eRest,
        };
      }

      if (sErr) {
        errField = {
          ...errField,
          error: true,
          ...sRest,
        };
      }

      if (exErr) {
        errField = {
          ...errField,
          error: true,
          ...exRest,
        };
      }
    }

    const { error, ...rest } = errField;
    if (errField.error) {
      changeStyleElementByObject({ ...rest }, "boxShadow", "0 0 0 0.3mm red");
      return;
    }
    console.log("Update");

    axiosClient
      .put(`${process.env.REACT_APP_URL}/promotion/${id}`, {
        ...obj,
        status: statusUpdate,
      })
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
          <FormDataItem label="status" id="status">
            <Select
              datas={statuss}
              name="status"
              value={statusUpdate ? "1" : "0"}
              onChange={(event) => {
                const parInt = parseInt(event.target.value);
                setStatus(Boolean(parInt));
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
