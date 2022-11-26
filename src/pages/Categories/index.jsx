import React, { Component } from "react";
// Table from react-bootstrap
import { Table } from "react-bootstrap";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// To make rows collapsible
import CategoryMd from "../../components/ModalPro/CategoryMd";
import { useEffect, useState } from "react";
import {getAllCategory} from "../../service/categoryService"
import "../styles.css";
import DashboardHeader from "../../components/DashboardHeader";

  function Categories() {
    const [data, setData] = useState([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect( async () => {
   const res = await getAllCategory()
   setData(res.data.data)
  },[])


    return(
      <>
       <div className="dashboard-content">
      <DashboardHeader btnText="New Order" />

      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>Orders List</h2>

          </div>
          <CategoryMd />
      <table>
      <thead>
            <tr>
              <th>STT</th>
              <th> Name</th>
              <th>Created at</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <span>{row.id}</span>
                    </td>
                      <span>{row.name}</span>

                      <span>{row.createdAt}</span>

                    <td>

                    </td>
                  </tr>
                ))}
          </tbody>
      </table>
          </div>
          </div>
    </>
    )
  }




export default Categories;