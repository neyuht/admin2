import React, { useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./style.css";
import Buttons from "react-bootstrap/Button";
import Overlay from "../../components/Overlay/overlay";
import axiosClient from "../../scripts/helpers/config";
import Button from "../../scripts/components/button";
import CategoriesItem from "../../scripts/components/I-categories-item";
import Input from "../../scripts/components/input";
import FormDataItem from "../../scripts/components/form-data-item";
import showHide from "../../scripts/helpers/showHide";
import PopUpCategory from "./categories-overlay";
import { clearStyle } from "../../scripts/helpers/styles-change";
import { validate } from "../../scripts/helpers/validation";

function CategoriesTab() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [name, setName] = useState("");
  const lists = useRef([]);
  const [overlay, setOverlay] = useState();
  const [pagins, setPagins] = useState([1]);
  const [indexPagin, setIndexPagin] = useState(1);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("");
  const [popup, setPopup] = useState(false);
  const responsePagins = useRef([]);
  const size = 8;
  const timmerId = useRef(null);
  const [currentPages, setCurrentPages] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

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

  const onSubmit = (event) => {
    event.preventDefault();
    const obj = {
      name,
    };

    clearStyle(obj);
    const isEmpty = validate(obj);

    if (isEmpty.error) {
      return;
    }
    axiosClient
      .post(`${process.env.REACT_APP_URL}/categories`, {
        id: 0,
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
        setName("");
        setPopup(false);
        window.location.reload();
      })
      .catch((err) => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  };

  const popupAddPromo = useCallback(() => {
    setPopup((prev) => !prev);
  }, []);

  const openSetting = async (e, id) => {
    const category = await axiosClient.get(
      `${process.env.REACT_APP_URL}/categories/${id}`
    );
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
    setFilter(value);

    if (timmerId.current) clearTimeout(timmerId.current);
    timmerId.current = setTimeout(() => {
      const params = {
        name: value,
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
                <Overlay onClick={popupAddPromo}>
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
                      <h2 className={"heading"}>Add category</h2>
                      <section className={"form-data"}>
                        <FormDataItem label="Category's Name" id="code">
                          <Input
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Enter brand's name.."
                            onChange={(event) => {
                              setName(event.target.value);
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
                  onClick={popupAddPromo}
                >
                  Add New Category
                </Buttons>
              </div>
              <section className={"section-list"}>
                <section className={"list-promo"}>
                  <section className={"filter-button"}>
                    <Buttons
                      type="button"
                      title="submit"
                      variant="secondary"
                      onClick={() => {
                        setIsFilter((prev) => !prev);
                      }}
                      style={{ color: "#fff", fontWeight: "bold" }}
                    >
                      <FontAwesomeIcon
                        icon={faFilter}
                        style={{ paddingRight: "10px" }}
                      />
                      Filter
                    </Buttons>
                  </section>
                  {isFilter && (
                    <section
                      className={"filter-product filter-product-p"}
                      style={{
                        margin: "20px 0",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                    >
                      <div className={"filter-products-search"}>
                        <div>
                          <label>Search by category's name</label>
                          <div className="filter-product-search">
                            <Input
                              type={"text"}
                              name="search"
                              value={filter}
                              placeholder="Enter category"
                              onChange={onSearch}
                            />
                            <FontAwesomeIcon
                              icon={faMagnifyingGlass}
                              onClick={onSearch}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="line"></span>
                      <div className={"filter-products-cta"}>
                        <Buttons
                          type="button"
                          title="submit"
                          variant="info"
                          onClick={() => {
                            setFilter("");
                            setSearchparams({});
                          }}
                          style={{ color: "#fff" }}
                        >
                          Clear search
                        </Buttons>
                      </div>
                    </section>
                  )}
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
                    {categories.length === 0 ? (
                      <div className="dashboard-content-footer">
                        <span
                          className="empty-table"
                          style={{ paddingTop: "10px" }}
                        >
                          No data
                        </span>
                      </div>
                    ) : null}
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
