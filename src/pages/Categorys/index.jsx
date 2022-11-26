import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader";

import all_categorys from "../../constants/category";
import { calculateRange, sliceData } from "../../utils/table-pagination";
import { Table } from "react-bootstrap";
import "../styles.css";
import DoneIcon from "../../assets/icons/done.svg";
import CancelIcon from "../../assets/icons/cancel.svg";
import RefundedIcon from "../../assets/icons/refunded.svg";

function Categorys() {
  const [search, setSearch] = useState("");
  const [categorys, setCategorys] = useState(all_categorys);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);

  useEffect(() => {
    setPagination(calculateRange(all_categorys, 5));
    setCategorys(sliceData(all_categorys, page, 5));
  }, []);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== "") {
      let search_results = categorys.filter(
        (item) =>
          item.first_name.toLowerCase().includes(search.toLowerCase()) ||
          item.last_name.toLowerCase().includes(search.toLowerCase()) ||
          item.product.toLowerCase().includes(search.toLowerCase())
      );
      setCategorys(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setCategorys(sliceData(all_categorys, new_page, 5));
  };

  return (
    <>
      <div className="dashboard-content">
        <DashboardHeader btnText="." />
        <div className="dashboard-content-container">
          <div className="dashboard-content-header">
            <h2>Categorys List</h2>
          </div>
          <table>
            <thead>
              <th>Name</th>
              <th>Create</th>
              <th>STATUS</th>
              <th>aaa</th>
            </thead>

            {categorys.length !== 0 ? (
              <tbody>
                {categorys.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <span>{order.name}</span>
                    </td>
                    <td>
                      <span>{order.create}</span>
                    </td>

                    <td>
                      <span>{order.status}</span>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
          {categorys.length !== 0 ? (
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
    </>
  );
}

export default Categorys;
