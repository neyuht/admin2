import React, { useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader";

import ModalProduct from "../../components/ModalPro/ModalProduct";

// import all_products from "../../constants/products";
import {getAllProduct} from "../../service/productService"
import { calculateRange, sliceData } from "../../utils/table-pagination";
import { Table } from "react-bootstrap";
import "../styles.css";
import DoneIcon from "../../assets/icons/done.svg";
import CancelIcon from "../../assets/icons/cancel.svg";
import RefundedIcon from "../../assets/icons/refunded.svg";

function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);

  useEffect(() => {
    getAllProduct("").then(res=>{
      setProducts(res.data.data.content)
      console.log(res.data.data.content)

    })
  }, []);

  // Search
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== "") {
      let search_results = products.filter(
        (item) =>
          item.first_name.toLowerCase().includes(search.toLowerCase()) ||
          item.last_name.toLowerCase().includes(search.toLowerCase()) ||
          item.product.toLowerCase().includes(search.toLowerCase())
      );
      setProducts(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  // Change Page
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setProducts(sliceData(products, new_page, 7));
  };

  return (
    <>
      <div className="dashboard-content">
        <DashboardHeader btnText="." />
        <div className="dashboard-content-container">
          <div className="dashboard-content-header">
            <h2>Products List</h2>
          </div>
          <table>
            <thead>
              <th>Name</th>
              <th>Create</th>
              <th>STATUS</th>
              <th>Action</th>
            </thead>

            {products.length !== 0 ? (
              <tbody>
                {products.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <span>{order.name}</span>
                    </td>
                    <td>
                      <span>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    </td>

                    <td>
                      <span>{order.status == 1 ? "Pending" : "Done"}</span>
                    </td>
                    <td>
<<<<<<< HEAD
                      <ModalProduct />
=======
                      <ModalView data={order.productVariants}/>
>>>>>>> ee57d3825c06967f486698dcf3e2c2e80dacd0a8
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
          {products.length !== 0 ? (
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

export default Products;
