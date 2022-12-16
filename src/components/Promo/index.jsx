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
} from "../../scripts/helpers/validation";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import Buttons from "react-bootstrap/Button";
import "./style.css";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { adminLogin } from "../../service/authService";
import { changeStyleElementByObject } from "../../scripts/helpers/styles-change";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const percents = new Array(101).fill(1).map((item, index) => ({
  title: index,
  value: index,
}));

const statuss = new Array(2).fill(1).map((item, index) => ({
  title: `${Boolean(index)}`,
  value: `${Boolean(index)}`,
}));

const size = 8;

function Promo() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(0);
  const [amount, setAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useSearchParams({});
  const [indexPagin, setIndexPagin] = useState(1);
  const [promotions, setPromotions] = useState([]);
  const [pagins, setPagins] = useState([1]);
  const [timer, setTimer] = useState("");
  const [overlay, setOverlay] = useState();
  const [popup, setPopup] = useState(false);
  const responsePagins = useRef([]);
  const lists = useRef([]);

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
    let currentPage = +searchParams.get("page") + step;
    setSearchparams({
      page: currentPage,
    });
  };

  const computePagins = useMemo(() => {
    let currentPage = +searchParams.get("page");
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
      status,
    };

    changeStyleElementByObject(obj, "boxShadow", "0 0 0 0.3mm");
    let result = validate(obj);
    if (result.error) {
      return;
    }

    result = validateCode(code);
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
      .post(`${process.env.REACT_APP_URL}/promotion`, {
        id: 0,
        type: 0,
        ...obj,
      })
      .then((res) => {
        const _temps = [
          ...promotions,
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSearch = async (e) => {
    const text = e.target.value;
    if (timer) clearTimeout(timer);
    const _timer = setTimeout(() => {
      const url = `${process.env.REACT_APP_URL}/promotion${
        text ? "?code=" + text : ""
      }`;
      axiosClient
        .get(url)
        .then((response) => {
          const datas = response.data.content;
          setPromotions(datas);
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
      promotions.length % size === 0
        ? promotions.length / size === 0
          ? 1
          : promotions.length / size
        : parseInt(promotions.length / size) + 1;
    return new Array(sizeButton).fill(1);
  }, [promotions]);

  const openSetting = async (e, id) => {
    const promo = promotions.find((promo) => promo.id === id);
    setOverlay(promo);
  };

  const popupAddPromo = useCallback(() => {
    setPopup((prev) => !prev);
  }, []);

  useEffect(() => {
    axiosClient
      .get(`${process.env.REACT_APP_URL}/promotion`)
      .then((response) => {
        const _sizePagin = response.data.totalPage;
        responsePagins.current = new Array(_sizePagin)
          .fill(1)
          .map((item, index) => index + 1);
        for (
          let index = 0;
          index < responsePagins.current.length;
          index += size - 1
        ) {
          lists.current.push([
            responsePagins.current[index],
            responsePagins.current[index + 1],
            responsePagins.current[index + 2],
            responsePagins.current[index + 3],
          ]);
        }
        setPromotions(response.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
                  value={filter}
                  placeholder="Enter promotion"
                  onChange={onSearch}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={onSearch} />
              </div>
              <div className="filter-product-search">
                <select name="" id="">
                  <option className="option-filter" value="all">
                    All
                  </option>
                  <option className="option-filter" value="done">
                    Available
                  </option>
                  <option className="option-filter" value="notYet">
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
                            new Date(promotion.endDate)
                              .toLocaleString("en-GB")
                              .split(",")[0] ===
                            new Date().toLocaleString("en-GB").split(",")[0]
                              ? "Expired"
                              : "Available"
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
          <PopUpPromo {...overlay} />
        </Overlay>
      )}
    </section>
  );
}

export default Promo;
