import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import all_orders from "../../constants/orders";
import { calculateRange, sliceData } from "../../utils/table-pagination";
import ChartBar from "../../components/Orders/ChartBar";
import iconCustomers from "../../assets/icons/icon-customers.svg";
import iconBoxest from "../../assets/icons/icon-boxest.svg";
import iconDollar from "../../assets/icons/icon-dollar.svg";
import iconOrders from "../../assets/icons/icon-orders.svg";
import Total from "../../components/Orders/Total";
import axiosClient from "../../scripts/helpers/config";
import Input from "../../scripts/components/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import OrderItems from "../../scripts/components/I-orders-item";
import Overlay from "../../components/Overlay/overlay";
import OrderOverlay from "../../components/Orders/orders-overlay";
import { useSearchParams } from "react-router-dom";
import showHide from "../../scripts/helpers/showHide";

function Orders() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [filter, setFilter] = useState({
    username: "",
    status: "",
    endDate: "",
    startDate: "",
    min: "",
    max: "",
  });
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
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
    console.log("filter", filter);
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
    let sum = 0;
    for (const [key, value] of searchParams.entries()) {
      if (key === "endDate" || key === "startDate") {
        const date = new Date(value);
        const timestamp = Math.floor(date.getTime() / 1000);
        param += `${key}=${timestamp}&`;
      } else {
        param += `${key}=${value}&`;
      }
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
            <section className={"filter-product"}>
              <div className="filter-total">
                <div className="filter-total-left">
                  <label htmlFor="">Enter end date and start date</label>
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
              <span className="line"></span>
              <div className="filter-total">
                <div className="filter-total-left">
                  <label htmlFor="">Enter min and max price</label>
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
              <span className="line"></span>
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
              <span className="line"></span>
              <div>
                <label htmlFor="">Sort by status</label>
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
                  </select>
                </div>
              </div>
            </section>
          </div>

          <section className="table-promo">
            <table>
              <thead>
                <th>ID</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>COSTUMER</th>
                <th>REVENUE</th>
              </thead>

              {dataOrders.length !== 0 ? (
                <tbody>
                  {dataOrders.map((order, index) => (
                    <OrderItems
                      id={order.id}
                      createdAt={order.createdAt}
                      status={order.status}
                      image={order.user.image}
                      firstName={order.user.firstName}
                      lastName={order.user.lastName}
                      total={order.total}
                      onClick={openSetting}
                    />
                  ))}
                </tbody>
              ) : null}
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
          {dataOrders.length === 0 ? (
            <div className="dashboard-content-footer">
              <span className="empty-table">No data</span>
            </div>
          ) : null}
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
