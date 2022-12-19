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

function Orders() {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(all_orders);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [data, setData] = useState([]);
  const [dataOrders, setDataOrders] = useState([]);
  const [price, setPrice] = useState(0);
  const [overlay, setOverlay] = useState();
  const [currentPages, setCurrentPages] = useState([]);
  const responsePagins = useRef([]);
  const lists = useRef([]);

  useEffect(() => {
    setPagination(calculateRange(all_orders, 5));
    setOrders(sliceData(all_orders, page, 5));
  }, []);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== "") {
      let search_results = orders.filter(
        (item) =>
          item.first_name.toLowerCase().includes(search.toLowerCase()) ||
          item.last_name.toLowerCase().includes(search.toLowerCase()) ||
          item.product.toLowerCase().includes(search.toLowerCase())
      );
      setOrders(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setOrders(sliceData(all_orders, new_page, 5));
  };

  const onSearch = () => {};

  const changePage = (step) => {
    let currentPage = +searchParams.get("page") + step;
    setSearchparams({
      page: currentPage,
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
        const _sizePagin = response.data.totalPage;
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
              <div className="filter-product-search">
                <Input
                  type={"text"}
                  name="search"
                  // value={filter}
                  placeholder="Enter user or Email"
                  // onChange={onSearch}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={onSearch} />
              </div>
              <div className="filter-product-search">
                <select name="" id="">
                  <option className="option-filter" value="all">
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
