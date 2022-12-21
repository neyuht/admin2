import React, { Component, useCallback } from "react";

// Table from react-bootstrap
import { Table } from "react-bootstrap";
import { calculateRange, sliceData } from "../../utils/table-pagination";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
// To make rows collapsible

import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllCategory } from "../../service/categoryService";
import "./style.css";
import DashboardHeader from "../../components/DashboardHeader";
import Overlay from "../../components/Overlay/overlay";

import {
  validateDataForm,
  validate,
  validateNumber,
  validateOperator,
  validateCode,
} from "../../scripts/helpers/validation";
import axiosClient from "../../scripts/helpers/config";
import Button from "../../scripts/components/button";
import CategoriesItem from "../../scripts/components/I-categories-item";
import Input from "../../scripts/components/input";
import Buttons from "react-bootstrap/Button";
import FormDataItem from "../../scripts/components/form-data-item";
import Select from "../../scripts/components/select";
import { changeStyleElementByObject } from "../../scripts/helpers/styles-change";
function CategoriesTab() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const lists = useRef([]);
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
  const responsePagins = useRef([]);
  const size = 8;

  useEffect(() => {
    axiosClient
      .get(`http://localhost:8080/api/v1/public/categories`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setCategories(data);
      });
  }, []);

  const arrButton = useMemo(() => {
    const sizeButton =
      categories.length % size === 0
        ? categories.length / size === 0
          ? 1
          : categories.length / size
        : parseInt(categories.length / size) + 1;
    return new Array(sizeButton).fill(1);
  }, [categories]);

  return (
    <>
      <div className="dashboard-content">
        <div className="dashboard-content-container">
          <section className={"promo-wrapper"}>
            <section className={"container-main"}>
              {popup && (
                <Overlay>
                  <section
                    className={"section-form"}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <form action="#" className={"form-wrapper"}>
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
                      <Button type="submit" title="submit" />
                    </form>
                  </section>
                </Overlay>
              )}
              <div className="dashboard-content-header">
                <h2>Categories List</h2>
              </div>
              <section className={"section-list"}>
                <section className={"list-promo"}>
                  {/* <Buttons variant="primary" onClick={popupAddPromo}>
              Add New Product
            </Buttons> */}

                  <section className={"table-promo"}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>NAME</th>
                          <th>CREATE AT</th>
                          <th>UPDATE AT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category, index) => {
                          if (
                            indexPagin * size - size <= index &&
                            index < size * indexPagin
                          ) {
                            return (
                              <CategoriesItem
                                id={category.id}
                                name={category.name}
                                createAt={new Date(
                                  category.createdAt
                                ).toLocaleDateString("en-GB")}
                                updateAt={new Date(
                                  category.updatedAt
                                ).toLocaleDateString("en-GB")}
                              />
                            );
                          }
                          return <></>;
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
            {overlay && <Overlay onClick={setOverlay}></Overlay>}
          </section>
        </div>
      </div>
    </>
  );
}

export default CategoriesTab;
