import React, { Component, useCallback } from "react";

// Table from react-bootstrap
import { Table } from "react-bootstrap";
import { calculateRange, sliceData } from "../../utils/table-pagination";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
// To make rows collapsible
import CategoryMd from "../../components/ModalPro/CategoryMd";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllCategory } from "../../service/categoryService";
import "../styles.css";
import DashboardHeader from "../../components/DashboardHeader";
import Overlay from "../../components/Overlay/overlay";
import PopUpPromo from "../../components/Form-product/product-overlay";
import {
  validateDataForm,
  validate,
  validateNumber,
  validateOperator,
  validateCode,
} from "../../scripts/helpers/validation";
import axiosClient from "../../scripts/helpers/config";
import Button from "../../scripts/components/button";
import CategoryItem from "../../scripts/components/l-promo-item";
import Input from "../../scripts/components/input";
import Buttons from "react-bootstrap/Button";
import FormDataItem from "../../scripts/components/form-data-item";
import Select from "../../scripts/components/select";
import { changeStyleElementByObject } from "../../scripts/helpers/styles-change";
function PopUpCategory({ cx, id, nameCategory }) {
  const [stt, setStt] = useState("");
  const [nameCategory, setNameCategory] = useState("");
  const [createAt, setCreateAt] = useState("");
  const [updateAt, setUpdateAt] = useState("");
  const [data, setData] = useState([]);
  const [overlay, setOverlay] = useState();
  const [indexPagin, setIndexPagin] = useState(1);
  const [categories, setCategories] = useState([]);
  const [timer, setTimer] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useSearchParams({});
  const [pagins, setPagins] = useState([1]);
  const [status, setStatus] = useState(true);
  const [popup, setPopup] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    const obj = {
      nameCategory,
    };
    changeStyleElementByObject(obj, "boxShadow", "0 0 0 0.3mm");
    let result = validate(obj);
    if (result.error) {
      return;
    }
    result = validateDataForm(nameCategory);
    if (result.error) {
      return;
    }
    axiosClient
      .put(`${process.env.REACT_APP_URL}/categories/${id}`, obj)
      .then((res) => {
        console.log("success", res);

        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onDelete = useCallback((id) => {
    axiosClient
      .delete(`${process.env.REACT_APP_URL}/categories/${id}`)
      .then((res) => {
        window.location.reload();
      });
  }, []);
  const onUpdate = useCallback((id) => {
    axiosClient
      .update(`${process.env.REACT_APP_URL}/categories/${id}`)
      .then((res) => {
        window.location.reload();
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
      <h2 className="heading">Add Category</h2>
      <section className="form-data">
        <FormDataItem label="Category Name" id="nameCategory">
          <Input
            type="text"
            name="nameCategory"
            value={categories}
            placeholder="Category Name"
            onChange={(event) => {
              setNameCategory(event.target.value);
            }}
          />
        </FormDataItem>
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
        <Button
          type="button"
          title="update"
          onClick={(e) => {
            onUpdate(id);
          }}
        />
      </div>
    </form>
  );
}
export default PopUpCategory;
