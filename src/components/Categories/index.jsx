import React, { Component, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./style.css";
import Overlay from "../../components/Overlay/overlay";
import axiosClient from "../../scripts/helpers/config";
import Button from "../../scripts/components/button";
import CategoriesItem from "../../scripts/components/I-categories-item";
import Input from "../../scripts/components/input";
import FormDataItem from "../../scripts/components/form-data-item";
import showHide from "../../scripts/helpers/showHide";
import PopUpCategory from "./categories-overlay";

function CategoriesTab() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const lists = useRef([]);
  const [overlay, setOverlay] = useState();
  const [indexPagin, setIndexPagin] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [popup, setPopup] = useState(false);
  const responsePagins = useRef([]);
  const size = 8;
  const timmerId = useRef(null);
  const [currentPages, setCurrentPages] = useState([]);

  const getDataSearch = (value1) => {
    let obj = {};
    for (const [key, value] of searchParams.entries()) {
      obj = {
        [key]: value,
      };
    }

    // obj cũ và 1 param mới
    obj = {
      ...obj,
      ...value1,
    };

    // loại bỏ các param rỗng
    let newObj = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value) {
        newObj = {
          ...newObj,
          [key]: value,
        };
      }
    });

    setSearchparams({
      page: 1,
      ...newObj,
    });
  };

  const openSetting = async (e, id) => {
    const category = await axiosClient.get(
      `${process.env.REACT_APP_URL}/categories/${id}`
    );
    console.log(category);
    setOverlay(category.data);
  };

  const nextPage = (currentPage) => {
    const temps = lists.current.filter((item) => {
      return item.includes(currentPage);
    });
    if (temps.length != 1) {
      return temps[1];
    }
    return temps[0];
  };

  const computePagins = useMemo(() => {
    let currentPage = +searchParams.get("page");
    setCurrentPages(currentPage);
    if (currentPage <= 0) {
      currentPage = 1;
    } else if (
      currentPage > responsePagins.current[responsePagins.current.length - 1]
    ) {
      currentPage = responsePagins.current[responsePagins.current.length - 1];
    }
    const data = nextPage(currentPage) || [];
    return data;
  }, [searchParams, categories]);

  const changePage = (step) => {
    const currentPage = +searchParams.get("page") + step;
    let obj = {};
    for (const [key, value] of searchParams.entries()) {
      obj = {
        ...obj,
        [key]: value,
      };
    }
    const { page, ...rest } = obj;
    setSearchparams({
      page: currentPage,
      ...rest,
    });
  };

  const onSearch = async (e) => {
    const value = e.target.value;
    setFilter((prev) => ({
      ...prev,
      name: value,
    }));
    if (timmerId.current) clearTimeout(timmerId.current);
    timmerId.current = setTimeout(() => {
      const { name, ...rest } = filter;
      const params = {
        name: value,
        ...rest,
      };
      getDataSearch(params);
    }, 600);
  };

  useEffect(() => {
    let param = "?";
    for (const [key, value] of searchParams.entries()) {
      param += `${key}=${value}&`;
    }
    axiosClient
      .get(`http://localhost:8080/api/v1/admin/categories${param}`)
      .then((response) => {
        const data = response.data.content;
        const _sizePagin = response.data.totalPage;
        responsePagins.current = new Array(_sizePagin)
          .fill(1)
          .map((item, index) => index + 1);
        lists.current = [];
        for (
          let index = 0;
          index < responsePagins.current.length;
          index += 4 - 1
        ) {
          lists.current.push([
            responsePagins.current[index],
            responsePagins.current[index + 1],
            responsePagins.current[index + 2],
            responsePagins.current[index + 3],
          ]);
        }
        setCategories(data);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  }, [searchParams]);

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
                  <section className={"filter-product"}>
                    <div className="filter-product-search">
                      <Input
                        type={"text"}
                        name="search"
                        value={filter.code}
                        placeholder="Enter category"
                        onChange={onSearch}
                      />
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        onClick={onSearch}
                      />
                    </div>
                  </section>

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
                                onClick={openSetting}
                              />
                            );
                          }
                          return <></>;
                        })}
                      </tbody>
                    </table>
                  </section>
                  <ul className={"paginations"}>
                    <button
                      className="btn-pages button-pagination-move"
                      onClick={() => {
                        changePage(-1);
                      }}
                      disabled={searchParams.get("page") * 1 === 1}
                    >
                      prev
                    </button>
                    {computePagins.map(
                      (item, index) =>
                        item && (
                          <button
                            className={`buttons-pagination ${
                              +searchParams.get("page") === item
                                ? "buttons-pagination-active"
                                : ""
                            }`}
                            onClick={() => {
                              let obj = {};
                              for (const [
                                key,
                                value,
                              ] of searchParams.entries()) {
                                obj = {
                                  ...obj,
                                  [key]: value,
                                };
                              }
                              obj["page"] = item;

                              setSearchparams({
                                ...obj,
                              });
                            }}
                          >
                            {item}
                          </button>
                        )
                    )}
                    <button
                      className="btn-pages button-pagination-move"
                      onClick={() => {
                        changePage(1);
                      }}
                      disabled={
                        searchParams.get("page") * 1 ===
                        responsePagins.current[
                          responsePagins.current.length - 1
                        ]
                      }
                    >
                      next
                    </button>
                  </ul>
                </section>
              </section>
            </section>
            {overlay && (
              <Overlay onClick={setOverlay}>
                <PopUpCategory obj={overlay} />
              </Overlay>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default CategoriesTab;
