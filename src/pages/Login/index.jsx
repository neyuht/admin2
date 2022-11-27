import React, { useState, useEffect } from "react";

import all_products from "../../constants/products";
import { calculateRange, sliceData } from "../../utils/table-pagination";
import "../styles.css";
import { adminLogin } from "../../service/authService";

function Login() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(all_products);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const data = {
      email: "admin",
      password: "123456",
    };
    adminLogin(data).then((res) => {
      localStorage.setItem("token", "Bearer " + res.data.data);
      console.log(localStorage.getItem("token"));
    });
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
    setProducts(sliceData(all_products, new_page, 7));
  };

  return (
    <>
      <h1>Logged in</h1>
    </>
  );
}

export default Login;
