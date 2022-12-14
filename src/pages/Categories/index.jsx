import React, { Component } from "react";
// Table from react-bootstrap
import { Table } from "react-bootstrap";
import { calculateRange, sliceData } from "../../utils/table-pagination";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
// To make rows collapsible
import CategoryMd from "../../components/ModalPro/CategoryMd";
import { useEffect, useState } from "react";
import { getAllCategory } from "../../service/categoryService";
import "../styles.css";
import DashboardHeader from "../../components/DashboardHeader";

function Categories() {
  const [data, setData] = useState([]);

  const callAPI = async (callback) => {
    const res = await getAllCategory();
    callback(res.data.data);
  };
  const [orders, setOrders] = useState(data);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  useEffect(() => {
    setPagination(calculateRange(data, 5));
    setOrders(sliceData(data, page, 5));
    console.log(data.length);;
  }, []);
  useEffect(() => {
    callAPI(setData);
  }, []);
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setOrders(sliceData(data, new_page, 5));
  };

  return (
    <>
      <div className="dashboard-content">
        <div className="dashboard-content-container">
          <div className="dashboard-content-header">
            <h2>Category List</h2>
          </div>
          <div>
            <CategoryMd />
          </div>
          <table className="list-category-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>CATEGORY NAME</th>
                <th>CREATED AT</th>
                <th>UPDATE AT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>
                    <span className="rowct">{row.id}</span>
                  </td>
                  <td>
                    <span className="rowct">{row.name}</span>
                  </td>
                  <td>
                    <span className="rowct">{row.createdAt}</span>
                  </td>
                  <td>
                    <span className="rowct">{row.updatedAt}</span>
                  </td>
                  <td>
                    <button className="rowedit">
                      {" "}
                      <FontAwesomeIcon icon={faEdit} />
                      &nbsp; Edit &nbsp;&nbsp;
                    </button>
                    <button className="rowremove">
                      {" "}
                      <FontAwesomeIcon icon={faRemove} />
                      &nbsp; Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length !== 0 ? (
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

export default Categories;
