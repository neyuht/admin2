import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import ChartBar from "../../components/Orders/ChartBar";
import iconCustomers from "../../assets/icons/icon-customers.svg";
import iconBoxest from "../../assets/icons/icon-boxest.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Buttons from "react-bootstrap/Button";
import iconDollar from "../../assets/icons/icon-dollar.svg";
import iconOrders from "../../assets/icons/icon-orders.svg";
import Total from "../../components/Orders/Total";
import axiosClient from "../../scripts/helpers/config";
import Input from "../../scripts/components/input";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import OrderItems from "../../scripts/components/I-orders-item";
import Overlay from "../../components/Overlay/overlay";
import OrderOverlay from "../../components/Orders/orders-overlay";
import { useSearchParams } from "react-router-dom";
import showHide from "../../scripts/helpers/showHide";

const initFiler = {
  username: "",
  status: "",
  endDate: "",
  startDate: "",
  min: "",
  max: "",
  phone: "",
  email: "",
  id: "",
};

function Orders() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [filter, setFilter] = useState(initFiler);
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [isFilter, setIsFilter] = useState(false);
  const timmerId = useRef(null);
  const [data, setData] = useState([]);
  const [dataOrders, setDataOrders] = useState([]);
  const [overlay, setOverlay] = useState();
  const responsePagins = useRef([]);
  const lists = useRef([]);

  /**
   * Get data when searching
   * @param {*} value1
   */
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

  /**
   * Event search
   * @param {*} event
   */
  const onSearch = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
    // debounce: có đang gõ hay ko
    if (timmerId.current) clearTimeout(timmerId.current);
    // dừng lại rồi mới gửi request
    timmerId.current = setTimeout(() => {
      const { ...rest } = filter;
      const params = {
        ...rest,
        [key]: value,
      };
      getDataSearch(params);
    }, 600);
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
    if (currentPage <= 0) {
      currentPage = 1;
    } else if (
      currentPage > responsePagins.current[responsePagins.current.length - 1]
    ) {
      currentPage = responsePagins.current[responsePagins.current.length - 1];
    }
    const data = nextPage(currentPage) || [];
    return data;
  }, [searchParams, dataOrders]);

  const [totalRevenue, setTotalRevenue] = useState([]);
  const [customerCount, setCustomerCount] = useState([]);
  const [earning, setEarning] = useState([]);
  const [productSold, setProductSold] = useState([]);
  const [orderSold, setOrderSold] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [lowestSelling, setLowestSelling] = useState([]);

  const openSetting = useCallback(
    (e, id) => {
      const product = dataOrders.find((order) => order.id === id);
      setOverlay(product);
    },
    [dataOrders]
  );

  useEffect(() => {
    axiosClient
      .get(`${process.env.REACT_APP_URL}/orders/statistical`)
      .then((response) => {
        const data = response.data;
        setBestSelling(data.bestSelling);
        setTotalRevenue(data.totalRevenue);
        setCustomerCount(data.customerCount);
        setEarning(data.earning);
        setProductSold(data.productSold);
        setOrderSold(data.orderSold);
        setLowestSelling(data.lowestSelling);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  }, []);

  useEffect(() => {
    let param = "?";
    for (const [key, value] of searchParams.entries()) {
      param += `${key}=${value}&`;
    }
    axiosClient
      .get(`${process.env.REACT_APP_URL}/orders${param}`)
      .then((response) => {
        const data = response.data.content;
        const _sizePagin = response.data.totalPages;
        responsePagins.current = new Array(_sizePagin)
          .fill(1)
          .map((item, index) => index + 1);
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
        setDataOrders(data);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  }, [searchParams]);

  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">
        <div className="total-details">
          <Total
            number={customerCount}
            month={false}
            description={"Customers"}
            icon={iconCustomers}
          />
          <Total
            number={productSold}
            month={true}
            description={"Products Sold"}
            icon={iconBoxest}
          />
          <Total
            number={orderSold}
            month={true}
            description={"Orders"}
            icon={iconOrders}
          />
          <Total
            number={earning}
            month={true}
            description={"Earning"}
            icon={iconDollar}
          />
        </div>

        <ChartBar
          data={totalRevenue}
          data2={bestSelling}
          data3={lowestSelling}
          datas={data}
        />

        <div className="list-orders">
          <div className="dashboard-content-header">
            <h2>Orders List</h2>
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
          </div>
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
                <div className="filter-total">
                  <div className="filter-total-left">
                    <label htmlFor="">Search by end date and start date</label>
                    <div className="filter-product-search filter-input-date">
                      <Input
                        type="date"
                        name="startDate"
                        value={filter.startDate}
                        onChange={onSearch}
                      />
                    </div>
                    <div
                      className="filter-product-search filter-input-date"
                      style={{ marginTop: "8px" }}
                    >
                      <Input
                        type="date"
                        name="endDate"
                        value={filter.endDate}
                        onChange={onSearch}
                      />
                    </div>
                  </div>
                  <div className="filter-total-right">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={() => {
                        getDataSearch(filter);
                      }}
                    />
                  </div>
                </div>

                <div className="filter-total">
                  <div className="filter-total-left">
                    <label htmlFor="">Search by min and max total price</label>
                    <div className="filter-product-search filter-input-date">
                      <Input
                        type={"number"}
                        name="min"
                        value={filter.min}
                        placeholder="Enter min price"
                        onChange={onSearch}
                      />
                    </div>
                    <div
                      className="filter-product-search filter-input-date"
                      style={{ marginTop: "8px" }}
                    >
                      <Input
                        type={"number"}
                        name="max"
                        value={filter.max}
                        placeholder="Enter max price"
                        onChange={onSearch}
                      />
                    </div>
                  </div>
                  <div className="filter-total-right">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={() => {
                        getDataSearch(filter);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="">Search by username</label>
                  <div className="filter-product-search">
                    <Input
                      type={"text"}
                      name="name"
                      value={filter.name}
                      placeholder="Enter username"
                      onChange={onSearch}
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={() => {
                        getDataSearch(filter);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="">Search by id of orders</label>
                  <div className="filter-product-search">
                    <Input
                      type={"text"}
                      name="id"
                      value={filter.id}
                      placeholder="Enter order's id"
                      onChange={onSearch}
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={() => {
                        getDataSearch(filter);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="">Search by phone</label>
                  <div className="filter-product-search">
                    <Input
                      type={"text"}
                      name="phone"
                      value={filter.phone}
                      placeholder="Enter phone"
                      onChange={onSearch}
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={() => {
                        getDataSearch(filter);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="">Search by email</label>
                  <div className="filter-product-search">
                    <Input
                      type={"email"}
                      name="email"
                      value={filter.email}
                      placeholder="Enter email"
                      onChange={onSearch}
                    />
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      onClick={() => {
                        getDataSearch(filter);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="">Sort by status of orders</label>
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
                        Success
                      </option>
                      <option className="option-filter" value="0">
                        Pending
                      </option>
                      <option className="option-filter" value="2">
                        Canceled
                      </option>
                      <option className="option-filter" value="3">
                        Waiting for payment
                      </option>
                    </select>
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
                    setFilter(initFiler);
                    setSearchparams({});
                  }}
                  style={{ color: "#fff" }}
                >
                  Clear search
                </Buttons>
              </div>
            </section>
          )}

          <section className="table-promo">
            <table>
              <thead>
                <th>ID</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>COSTUMER</th>
                <th>REVENUE</th>
                <th>METHOD PAYMENT</th>
              </thead>
              {dataOrders.length !== 0 ? (
                <tbody>
                  {Array.isArray(dataOrders) ? (
                    dataOrders.map((order, index) => (
                      <OrderItems
                        id={order.id}
                        createdAt={order.createdAt}
                        status={order.status}
                        image={order.user.image}
                        firstName={order.user.firstName}
                        lastName={order.user.lastName}
                        total={order.total}
                        payment={order.paymentMethod}
                        onClick={openSetting}
                      />
                    ))
                  ) : (
                    <OrderItems
                      id={dataOrders.id}
                      createdAt={dataOrders.createdAt}
                      status={dataOrders.status}
                      image={dataOrders.user.image}
                      firstName={dataOrders.user.firstName}
                      lastName={dataOrders.user.lastName}
                      total={dataOrders.total}
                      payment={dataOrders.paymentMethod}
                      onClick={openSetting}
                    />
                  )}
                </tbody>
              ) : null}
            </table>
            {dataOrders.length === 0 ? (
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
                      const currentFiller = searchParams.get("name");
                      const pyaload = currentFiller
                        ? {
                            page: item,
                            name: currentFiller,
                          }
                        : {
                            page: item,
                          };
                      setSearchparams(pyaload);
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
        </div>
      </div>
      {overlay && (
        <Overlay onClick={setOverlay}>
          <OrderOverlay data={overlay} />
        </Overlay>
      )}
    </div>
  );
}

export default Orders;
