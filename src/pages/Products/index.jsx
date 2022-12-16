import React, { useState, useEffect } from "react";
import { sliceData } from "../../utils/table-pagination";
import "../styles.css";
import FormProducts from "../../components/Form-product/index";

function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);

  useEffect(() => {
    // getAllProduct("").then((res) => {
    //   setProducts(res.data.data.content);
    // });
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
        <div className="dashboard-content-container">
          <FormProducts></FormProducts>
        </div>
      </div>
    </>
  );
}

export default Products;
