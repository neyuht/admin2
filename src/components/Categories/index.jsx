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
import PopUpCategory from "./categories-overlay";
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
function Categories() {
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
  const size = 8;
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
    console.log(result);
    if (result.error) {
      return;
    }
    axiosClient
      .post(`${process.env.REACT_APP_URL}/categories`, {
        id: 0,
        type: 0,
        ...obj,
      })
      .then((res) => {
        const _temps = [
          ...categories,
          {
            ...res.data,
          },
        ];

        const sizePagin =
          _temps.length % size === 0
            ? _temps.length / size
            : parseInt(_temps.length / size) + 1;
        const _tempsPagin = new Array(sizePagin).fill(1);
        setPagins(_tempsPagin);
        setCategories(_temps);
        setNameCategory("");
        setStatus(true);
        setPopup(false);
        console.log("Success");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axiosClient
      .get(`${process.env.REACT_APP_URL}/categories`)
      .then((response) => {
        setCategories(response.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const onSearch = async (e) => {
    const text = e.target.value;
    if (timer) clearTimeout(timer);
    const _timer = setTimeout(() => {
      const url = `${process.env.REACT_APP_URL}/categories${
        text ? "?nameCategories=" + text : ""
      }`;
      console.log("URL", url);
      axiosClient
        .get(url)
        .then((response) => {
          const datas = response.data.content;
          setCategories(datas);
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 600);
    setTimer(_timer);
    setFilter(text);
    setSearch({
      code: text,
    });
  };
  const arrButton = useMemo(() => {
    const sizeButton =
      categories.length % size === 0
        ? categories.length / size === 0
          ? 1
          : categories.length / size
        : parseInt(categories.length / size) + 1;
    return new Array(sizeButton).fill(1);
  }, [categories]);

  const callAPI = async (callback) => {
    const res = await getAllCategory();
    callback(res.data.data);
  };
  const openSetting = async (e, id) => {
    const category = categories.find((promo) => promo.id === id);
    setOverlay(category);
  };

  useEffect(() => {
    callAPI(setData);
  }, []);

  const PopUpNewCategory = useCallback(() => {
    setPopup((prev) => !prev);
  }, []);

  return (
    <>
      <div className="dashboard-content">
        <div className="dashboard-content-container">
          <section className={"promo-wrapper"}>
            <section className={"container-main"}>
              {popup && (
                <Overlay onClick={PopUpNewCategory}>
                  <section
                    className={"section-form"}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <form
                      action="#"
                      className={"form-wrapper"}
                      onSubmit={onSubmit}
                    >
                      <h2 className={"heading"}>Add New Categories</h2>
                      <section className={"form-data"}>
                        <FormDataItem id="categories">
                          <Input
                            type="text"
                            name="categories"
                            value={categories}
                            placeholder="Category Name"
                            onChange={(event) => {
                              setNameCategory(event.target.value);
                            }}
                          />
                        </FormDataItem>
                      </section>
                      <Button type="submit" title="submit" onClick={onSubmit} />
                    </form>
                  </section>
                </Overlay>
              )}
              <div className="dashboard-content-header">
                <h2>Categories List</h2>
                <Buttons
                  type="button"
                  title="submit"
                  variant="primary"
                  onClick={PopUpNewCategory}
                >
                  New Categories
                </Buttons>
              </div>
              <section className={"section-list"}>
                <section className={"list-promo"}>
                  {/* <Buttons variant="primary" onClick={popupAddPromo}>
              Add New Product
            </Buttons> */}

                  <section className={"filter-product"}>
                    <Input
                      type={"text"}
                      name="search"
                      value={filter}
                      placeholder="Enter Category Name"
                      onChange={onSearch}
                    />
                  </section>
                  <section className={"table-promo"}>
                    <table>
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>NAME</th>
                          <th>CREATE AT</th>
                          <th>UPDATE AT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category, index) => {
                          return (
                            <CategoryItem
                              stt={categories.stt}
                              nameCategory={categories.nameCategory}
                              createAt={categories.createAt}
                              updateAt={categories.updateAt}
                              onClick={openSetting}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </section>
                  <ul className={"paginations"}>
                    {arrButton.map((item, index) => (
                      <li
                        className={`${"pagin-item"} ${`${
                          indexPagin === index + 1 ? "active" : ""
                        }`}`}
                      >
                        <Button
                          type={"text"}
                          title={index + 1}
                          onClick={() => {
                            setIndexPagin(index + 1);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              </section>
            </section>
            {overlay && (
              <Overlay onClick={setOverlay}>
                <PopUpCategory {...overlay} />
              </Overlay>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Categories;
