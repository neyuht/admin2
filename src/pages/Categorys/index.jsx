import React, { Component } from "react";
// Table from react-bootstrap
import { Table } from "react-bootstrap";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// To make rows collapsible
import CategoryMd from "../../components/ModalPro/CategoryMd";
export class Categorys extends Component {
  render() {
    return (
      <>
        <CategoryMd />
      </>
    );
  }
}

export default Categorys;
