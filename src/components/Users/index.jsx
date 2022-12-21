import FormDataItem from "../../scripts/components/form-data-item";
import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import Select from "../../scripts/components/select";
import Overlay from "../Overlay/overlay";
import UserItems from "../../scripts/components/I-users-item";
import UserOverlay from "./users-overlay";
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

function UsersTab() {
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
  const [filter, setFilter] = useState({
    query: "",
  });
  const [search, setSearch] = useSearchParams({});
  const [indexPagin, setIndexPagin] = useState(1);
  const [users, setUsers] = useState([]);
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
  }, [searchParams, users]);

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
      query: value,
    }));
    if (timmerId.current) clearTimeout(timmerId.current);
    timmerId.current = setTimeout(() => {
      const { query, ...rest } = filter;
      const params = {
        query: value,
        ...rest,
      };
      getDataSearch(params);
    }, 600);
  };

  const openSetting = async (e, id) => {
    const promo = users.find((promo) => promo.id === id);
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
      .get(`${process.env.REACT_APP_URL}/users${param}`)
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
        setUsers(data);
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
              <form action="#" className={"form-wrapper"}>
                <h2 className={"heading"}>Users</h2>
                <section className={"form-data"}>
                  <FormDataItem label="First Name" id="code">
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
                  <FormDataItem label="Last Name" id="percent">
                    <Select
                      datas={percents}
                      name="percent"
                      value={percent}
                      onChange={(event) => {
                        setPercent(event.target.value);
                      }}
                    />
                  </FormDataItem>
                  <FormDataItem label="Email" id="status">
                    <Select
                      datas={statuss}
                      name="status"
                      value={status}
                      onChange={(event) => {
                        setStatus(event.target.value);
                      }}
                    />
                  </FormDataItem>
                  <div className={"form-group"}>
                    <FormDataItem label="Phone" id="amount">
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
              </form>
            </section>
          </Overlay>
        )}
        <div className="dashboard-content-header">
          <h2>Users List</h2>
        </div>
        <section className={"section-list"}>
          <section className={"list-promo"}>
            <section className={"filter-product"}>
              <div className="filter-product-search">
                <Input
                  type={"text"}
                  name="search"
                  value={filter.query}
                  placeholder="Enter name or email"
                  onChange={onSearch}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={onSearch} />
              </div>
            </section>
            <section className={"table-promo"}>
              <table>
                <thead>
                  <tr>
                    <th>Images</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    if (
                      indexPagin * size - size <= index &&
                      index < size * indexPagin
                    ) {
                      return (
                        <UserItems
                          id={user.id}
                          images={user.image}
                          firstName={user.firstName}
                          lastName={user.lastName}
                          email={user.email}
                          phone={user.phone}
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
          <UserOverlay {...overlay} />
        </Overlay>
      )}
    </section>
  );
}

export default UsersTab;
