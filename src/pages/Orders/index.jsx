import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader";

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
    console.log(event.target.value);
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

  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">
        <div className="total-details">
          <Total 
            number = {'1,540'}
            month =  {false}
            description = {'Customers'}
            icon = {iconCustomers}
          />
            <Total 
            number = {'12,000'}
            month =  {true}
            description = {'Products Sold'}
            icon = {iconBoxest}
          />
            <Total 
            number = {'17,800'}
            month =  {true}
            description = {'Orders'}
            icon = {iconOrders}
          />
            <Total 
            number = {'20,800'}
            month =  {true}
            description = {'Earning'}
            icon = {iconDollar}
          />
        </div>

        <ChartBar />

        <div className="list-orders">
          <div className="dashboard-content-header">
            <h2>Orders List</h2>
            <div className="dashboard-content-search">
              <input
                type="text"
                value={search}
                placeholder="Search.."
                className="dashboard-content-input"
                onChange={(e) => __handleSearch(e)}
              />
            </div>
          </div>

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
