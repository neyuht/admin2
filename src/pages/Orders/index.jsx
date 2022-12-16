import React, { useState, useEffect } from "react";
import all_orders from "../../constants/orders";
import { calculateRange, sliceData } from "../../utils/table-pagination";
import DoneIcon from "../../assets/icons/done.svg";
import CancelIcon from "../../assets/icons/cancel.svg";
import RefundedIcon from "../../assets/icons/refunded.svg";
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

function Orders() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(all_orders);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);

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
                <th>PRODUCT</th>
                <th>REVENUE</th>
              </thead>

              {orders.length !== 0 ? (
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>
                        <span>{order.id}</span>
                      </td>
                      <td>
                        <span>{order.date}</span>
                      </td>
                      <td>
                        <div>
                          {order.status === "Paid" ? (
                            <img
                              src={DoneIcon}
                              alt="paid-icon"
                              className="dashboard-content-icon"
                            />
                          ) : order.status === "Canceled" ? (
                            <img
                              src={CancelIcon}
                              alt="canceled-icon"
                              className="dashboard-content-icon"
                            />
                          ) : order.status === "Refunded" ? (
                            <img
                              src={RefundedIcon}
                              alt="refunded-icon"
                              className="dashboard-content-icon"
                            />
                          ) : null}
                          <span>{order.status}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <img
                            src={order.avatar}
                            className="dashboard-content-avatar"
                            alt={order.first_name + " " + order.last_name}
                          />
                          <span>
                            {order.first_name} {order.last_name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span>{order.product}</span>
                      </td>
                      <td>
                        <span>${order.price}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : null}
            </table>
          </section>

          {orders.length !== 0 ? (
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
    </div>
  );
}

export default Orders;
