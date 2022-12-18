import React, { useState, useEffect, useCallback } from "react";
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

function Orders() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(all_orders);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [data, setData] = useState([]);
  const [dataOrders, setDataOrders] = useState([]);
  const [price, setPrice] = useState(0);
  const [overlay, setOverlay] = useState();

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
    axiosClient.get(`${process.env.REACT_APP_URL}/orders`).then((response) => {
      const data = response.data;
      console.log(data.content[0]);
      setDataOrders(data.content);
    });
  }, []);

  const SumPrice = (orderItems) => {
    let sum = 0;
    Object.entries(orderItems).forEach((item) => {
      sum += item[1].unitPrice;
      return <span>{Math.round(sum)}</span>;
    });
  };

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
                  placeholder="Enter promotion"
                  // onChange={onSearch}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={onSearch} />
              </div>
              <div className="filter-product-search">
                <select name="" id="">
                  <option className="option-filter" value="all">
                    All
                  </option>
                  <option className="option-filter" value="done">
                    Done
                  </option>
                  <option className="option-filter" value="notYet">
                    Not Done Yet
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

          {dataOrders.length !== 0 ? (
            <div className="dashboard-content-footer">
              {pagination.map((item, index) => (
                <span
                  key={index}
                  className={item === page ? "active-pagination" : "pagination"}
                  onClick={() => __handleChangePage(item)}
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <div className="dashboard-content-footer">
              <span className="empty-table">No data</span>
            </div>
          )}
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
