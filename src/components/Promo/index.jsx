import FormDataItem from "../../scripts/components/form-data-item";
import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import Select from "../../scripts/components/select";
import Overlay from "../Overlay/overlay";
import PromoItem from "../../scripts/components/l-promo-item";
import PopUpPromo from "./promo-overlay";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  validate,
  validateNumber,
  validateOperator,
  validateCode,
  validateDate,
} from "../../scripts/helpers/validation";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import Buttons from "react-bootstrap/Button";
import "./style.css";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { clearStyle } from "../../scripts/helpers/styles-change";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import showHide from "../../scripts/scripts/helpers/flashMessage";
import FlashMessage from "../FlashMessage/flashMessage";

const percents = new Array(101).fill(1).map((item, index) => ({
  title: index,
  value: index,
}));

const statuss = new Array(2).fill(1).map((item, index) => ({
  title: `${Boolean(index) ? "Expired" : "Available"}`,
  value: `${index}`,
}));

const size = 8;

function Promo() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(true);
  const [filter, setFilter] = useState({
    code: "",
    status: "",
  });
  const [indexPagin, setIndexPagin] = useState(1);
  const [promotions, setPromotions] = useState([]);
  const [pagins, setPagins] = useState([1]);
  const [timer, setTimer] = useState("");
  const [overlay, setOverlay] = useState();
  const [popup, setPopup] = useState(false);
  const responsePagins = useRef([]);
  const lists = useRef([]);
  const [currentPages, setCurrentPages] = useState([]);
  const timmerId = useRef(null);

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
  }, [searchParams, promotions]);

  const onSubmit = (event) => {
    event.preventDefault();
    const obj = {
      code,
      percent: parseInt(percent),
      amount,
      maxAmount,
      startDate: (() => {
        if (startDate) {
          const date = new Date(startDate);

          return `${
            date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
          }-${
            date.getMonth() + 1 >= 10
              ? date.getMonth() + 1
              : `0${date.getMonth()}`
          }-${date.getFullYear()}`;
        }
        return "";
      })(),
      endDate: (() => {
        if (endDate) {
          const date = new Date(endDate);

          return `${
            date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
          }-${
            date.getMonth() + 1 >= 10
              ? date.getMonth() + 1
              : `0${date.getMonth()}`
          }-${date.getFullYear()}`;
        }
        return "";
      })(),
      status,
    };

    clearStyle(obj);
    const isEmpty = validate(obj);
    const isCode = validateCode(code);
    const isNumber = validateNumber({
      amount,
      maxAmount,
    });
    const isLT0 = validateOperator({
      amount,
      maxAmount,
    });
    const isDate = validateDate(obj.startDate, obj.endDate);
    if (
      isCode.error ||
      isDate.error ||
      isEmpty.error ||
      isNumber.error ||
      isLT0.error
    ) {
      return;
    }
    axiosClient
      .post(`${process.env.REACT_APP_URL}/promotion`, {
        id: 0,
        type: 0,
        ...obj,
      })
      .then((res) => {
        const _temps = [
          {
            ...res.data,
            startDate: (() => {
              const date = new Date(startDate);
              return `${
                date.getMonth() + 1 >= 10
                  ? date.getMonth() + 1
                  : `0${date.getMonth()}`
              }-${
                date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
              }-${date.getFullYear()}`;
            })(),
            endDate: (() => {
              const date = new Date(endDate);
              return `${
                date.getMonth() + 1 >= 10
                  ? date.getMonth() + 1
                  : `0${date.getMonth()}`
              }-${
                date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
              }-${date.getFullYear()}`;
            })(),
          },
          ...promotions,
        ];

        const sizePagin =
          _temps.length % size === 0
            ? _temps.length / size
            : parseInt(_temps.length / size) + 1;
        const _tempsPagin = new Array(sizePagin).fill(1);
        setPagins(_tempsPagin);
        setPromotions(_temps);
        setCode("");
        setPercent(0);
        setAmount("");
        setMaxAmount("");
        setEndDate("");
        setStartDate("");
        setStatus(true);
        setPopup(false);
        showHide(true, "success", "Add successfully", setFlash);
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
    obj = {
      ...obj,
      ...value1,
    };
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
      code: value,
    }));
    if (timmerId.current) clearTimeout(timmerId.current);
    timmerId.current = setTimeout(() => {
      const { code, ...rest } = filter;
      const params = {
        code: value,
        ...rest,
      };
      getDataSearch(params);
    }, 600);
  };

  const openSetting = async (e, id) => {
    const promo = promotions.find((promo) => promo.id === id);
    setOverlay(promo);
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
      .get(`${process.env.REACT_APP_URL}/promotion${param}`)
      .then((response) => {
        console.log(response);
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
        setPromotions(data);
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
                <h2 className={"heading"}>add promotion</h2>
                <section className={"form-data"}>
                  <FormDataItem label="code" id="code">
                    <Input
                      type="text"
                      name="code"
                      value={code}
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
                        value={percent}
                        onChange={(event) => {
                          setPercent(event.target.value);
                        }}
                      />
                    </FormDataItem>
                    <FormDataItem label="status" id="status">
                      <Select
                        datas={statuss}
                        name="status"
                        value={status}
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
                        value={amount}
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
                        value={maxAmount}
                        placeholder="Enter max amount.."
                        onChange={(event) => {
                          setMaxAmount(event.target.value);
                        }}
                      />
                    </FormDataItem>
                  </div>
                  <div className={"form-group"}>
                    <FormDataItem label="startDate" id="startDate">
                      <Input
                        type="date"
                        name="startDate"
                        value={startDate}
                        onChange={(event) => {
                          setStartDate(event.target.value);
                        }}
                      />
                    </FormDataItem>
                    <FormDataItem label="endDate" id="endDate">
                      <Input
                        type="date"
                        name="endDate"
                        value={endDate}
                        onChange={(event) => {
                          setEndDate(event.target.value);
                        }}
                      />
                    </FormDataItem>
                  </div>
                </section>
                <Button type="submit" title="submit" onClick={onSubmit} />
              </form>
            </section>
          </Overlay>
        )}
        <div className="dashboard-content-header">
          <h2>Promotion List</h2>
          <Buttons
            type="button"
            title="submit"
            variant="primary"
            onClick={popupAddPromo}
          >
            Add New Promotion
          </Buttons>
        </div>
        <section className={"section-list"}>
          <section className={"list-promo"}>
            <section className={"filter-product"}>
              <div className="filter-product-search">
                <Input
                  type={"text"}
                  name="search"
                  value={filter.code}
                  placeholder="Enter promotion"
                  onChange={onSearch}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={onSearch} />
              </div>
              <div className="filter-product-search">
                <select
                  name=""
                  id=""
                  value={filter.status}
                  onChange={(event) => {
                    const params = {
                      ...filter,
                      status: event.target.value,
                    };
                    setFilter(params);
                    getDataSearch(params);
                  }}
                >
                  <option className="option-filter" value="">
                    All
                  </option>
                  <option className="option-filter" value="1">
                    Available
                  </option>
                  <option className="option-filter" value="0">
                    Expire
                  </option>
                </select>
              </div>
            </section>
            <section className={"table-promo"}>
              <table>
                <thead>
                  <tr>
                    <th>code</th>
                    <th>percent</th>
                    <th>amount</th>
                    <th>max amount</th>
                    <th>start Date</th>
                    <th>expires</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion, index) => {
                    if (
                      indexPagin * size - size <= index &&
                      index < size * indexPagin
                    ) {
                      return (
                        <PromoItem
                          id={promotion.id}
                          code={promotion.code}
                          percent={promotion.percent}
                          amount={promotion.amount}
                          maxAmount={promotion.maxAmount}
                          startDate={new Date(
                            promotion.startDate
                          ).toLocaleDateString("en-GB")}
                          expire={new Date(
                            promotion.endDate
                          ).toLocaleDateString("en-GB")}
                          status={
                            promotion.status === 0 ? "Expired" : "Available"
                          }
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
          <PopUpPromo {...overlay} />
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

export default Promo;
