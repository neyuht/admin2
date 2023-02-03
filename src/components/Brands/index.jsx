import FormDataItem from "../../scripts/components/form-data-item";
import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import Overlay from "../Overlay/overlay";
import BrandItem from "../../scripts/components/I-brand-item";
import PopUpBrand from "./brand-overlay";
import { useEffect, useMemo, useRef, useState } from "react";
import { validate } from "../../scripts/helpers/validation";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import Buttons from "react-bootstrap/Button";
import "./style.css";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { clearStyle } from "../../scripts/helpers/styles-change";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import showHide from "../../scripts/helpers/showHide";
import FlashMessage from "../FlashMessage/flashMessage";

const size = 8;

function Brand() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [name, setName] = useState("");
  const [filter, setFilter] = useState({
    code: "",
    status: "",
  });
  const [indexPagin, setIndexPagin] = useState(1);
  const [brands, setBrands] = useState([]);
  const [pagins, setPagins] = useState([1]);
  const [timer, setTimer] = useState("");
  const [overlay, setOverlay] = useState();
  const [popup, setPopup] = useState(false);
  const responsePagins = useRef([]);
  const lists = useRef([]);
  const [currentPages, setCurrentPages] = useState([]);
  const timmerId = useRef(null);
  const [isFilter, setIsFilter] = useState(false);

  const nextPage = (currentPage) => {
    const temps = lists.current.filter((item) => {
      return item.includes(currentPage);
    });
    if (temps.length != 1) {
      return temps[1];
    }
    return temps[0];
  };

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
  }, [searchParams, brands]);

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
      .post(`${process.env.REACT_APP_URL}/brands`, {
        id: 0,
        type: 0,
        ...obj,
      })
      .then((res) => {
        const _temps = [
          ...brands,
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
        setBrands(_temps);
        setName("");
        setPopup(false);
        window.location.reload();
      })
      .catch((err) => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  };

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

  const openSetting = async (e, id) => {
    const promo = await axiosClient.get(
      `${process.env.REACT_APP_URL}/brands/${id}`
    );
    console.log("api", promo.data);
    setOverlay(promo.data);
  };

  const popupAddPromo = useCallback(() => {
    setPopup((prev) => !prev);
  }, []);

  useEffect(() => {
    let param = "?";
    for (const [key, value] of searchParams.entries()) {
      param += `${key}=${value}&`;
    }
    axiosClient
      .get(`${process.env.REACT_APP_URL}/brands${param}`)
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
        setBrands(data);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  }, [searchParams]);

  return (
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
              <form action="#" className={"form-wrapper"} onSubmit={onSubmit}>
                <h2 className={"heading"}>Add brand</h2>
                <section className={"form-data"}>
                  <FormDataItem label="Brand's Name" id="code">
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
          <h2>Brands List</h2>
          <Buttons
            type="button"
            title="submit"
            variant="primary"
            onClick={popupAddPromo}
          >
            Add New Brand
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
                    <label htmlFor="">Search by brand's name</label>
                    <div className="filter-product-search">
                      <Input
                        type={"text"}
                        name="search"
                        value={filter.name}
                        placeholder="Enter brand"
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
                    onClick={() => {}}
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
                    <th>id</th>
                    <th>name</th>
                    <th>create at</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand, index) => {
                    if (
                      indexPagin * size - size <= index &&
                      index < size * indexPagin
                    ) {
                      return (
                        <BrandItem
                          id={brand.id}
                          name={brand.name}
                          createAt={new Date(
                            brand.createdAt
                          ).toLocaleDateString("en-GB")}
                          onClick={openSetting}
                        />
                      );
                    }
                    return <></>;
                  })}
                </tbody>
              </table>
              {brands.length === 0 ? (
                <div className="dashboard-content-footer">
                  <span className="empty-table" style={{ paddingTop: "10px" }}>
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
                        for (const [key, value] of searchParams.entries()) {
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
                  responsePagins.current[responsePagins.current.length - 1]
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
          <PopUpBrand obj={overlay} />
        </Overlay>
      )}
      {flash.action && (
        <FlashMessage
          rules={flash.type}
          message={flash.message}
          state={flash}
          onClick={setTimeout((event) => {
            showHide(false, "", "", setFlash);
          }, 3000)}
        />
      )}
    </section>
  );
}

export default Brand;
