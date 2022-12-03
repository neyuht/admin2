import React, { useCallback, useEffect, useRef, useState } from "react";
import Category from "./Category";
import DetailsTable from "./Details/details";
import * as request from "../../utils/http";
import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import { validate } from "../../scripts/helpers/validation";
import { changeStyleElementByObject } from "../../scripts/helpers/styles-change";
import Buttons from "react-bootstrap/Button";
import ProductItem from "../../scripts/components/l-product-item";
import "./style.css";
import { useMemo } from "react";
import Overlay from "../Overlay/overlay";
import axiosClient from "../../scripts/helpers/config";

const size = 5;

function FormProducts({ fields }) {
  const [filter, setFilter] = useState("");
  const [indexPagin, setIndexPagin] = useState(1);
  const [isCheck, setIsChecked] = useState(false);
  const [products, setProducts] = useState([]);
  const name = useRef("");
  const status = useRef("");
  const category = useRef("");
  const quantity = useRef("");
  const description = useRef("");
  const image = useRef("");
  const unitPrice = useRef("");
  const [detailsInfo, setDetailsInfo] = useState([]);
  const [popup, setPopup] = useState(false);

  const computePagins = useMemo(() => {
    const sizePagin =
      products.length % size === 0
        ? products.length / size
        : parseInt(products.length / size) + 1;
    const _tempsPagin = new Array(sizePagin === 0 ? 1 : sizePagin).fill(1);
    return _tempsPagin;
  }, [products]);

  const onChange = () => {
    setIsChecked(!isCheck);
  };

  const createNewProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const myForm = document.forms["formAddProduct"];
    const name = myForm["name"].value.trim();
    const status = myForm["status"].value.trim();
    const categoryId = myForm["category"].value;
    const description = myForm["description"].value.trim();
    const image = myForm["image"].files[0];
    // selectCategory,
    let obj = {
      name,
      status,
      description,
      categoryId,
    };
    const empty = validate(obj);
    const emptyLength = Object.keys(empty).length;
    if (emptyLength) {
      changeStyleElementByObject(empty, "boxShadow", "0 0 0.5mm red");
      console.log(empty);
      return;
    }
    const respone = await axiosClient.post(
      `http://localhost:8080/api/v1/admin/products`,
      {
        ...obj,
        productVariantList: [
          {
            quantity: 0,
            unitPrice: 0,
            description: "string",
            productId: 0,
            imageId: 0,
          },
        ],
      }
    );
    const { id } = respone.data;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("destination", "images");
    formData.append("create_thumbnail", true);
    const response2 = await axiosClient.post(
      `${process.env.REACT_APP_URL}/images?id=${id}&type=2`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setProducts([...products, { ...obj, id }]);
    // const id = 1;
    // send request image id = 1, type = 2, image = list anh
  };

  const resetProduct = (e) => {
    document.forms[1].reset();
  };

  const handleDelete = useCallback((id) => {}, []);

  const handleUpdate = useCallback((id) => {}, []);
  const handleSearch = useCallback((event) => {}, []);

  const openSetting = useCallback((e, id) => {
    console.log(id);
  }, []);

  // call api
  useEffect(() => {}, []);

  return (
    <main className={"main-wrapper"}>
      <section className={"container-main"}>
        {popup && (
          <Overlay
            onClick={() => {
              setPopup(false);
            }}
          >
            <section className={"section-form"}>
              <form
                name="formAddProduct"
                action=""
                className={"form-products"}
                onSubmit={createNewProduct}
                enctype="multipart/form-data"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className={"form-information"}>
                  <div className={"form-content"}>
                    <div className={"form-group"}>
                      <label htmlFor="">Name</label>
                      <input
                        ref={name}
                        type="text"
                        className={"products-input products-input products-name"}
                        name="name"
                        placeholder="Name"
                      />
                    </div>

                    <div className={"form-group-two"}>
                      <div>
                        <label htmlFor="">Quantity</label>
                        <input
                          ref={quantity}
                          type="text"
                          className={"products-input products-input products-quantity"}
                          name="name"
                          placeholder="Quantity"
                        />
                      </div>

                      <div>
                        <label htmlFor="">Price</label>
                        <input
                          ref={unitPrice}
                          type="text"
                          className={"products-input products-input products-price"}
                          name="name"
                          placeholder="Price"
                        />
                      </div>
                    </div>

                    <div className={"form-group-two"}>
                      <div className={"form-status"} id="productStatus">
                        <label htmlFor="">Status</label>
                        <select
                          ref={status}
                          name="status"
                          id=""
                          className={"products-status"}
                        >
                          <option value="0">Available</option>
                          <option value="1">Sold Out</option>
                        </select>
                      </div>

                      <div className={"form-category"} id="productCategory">
                        <label htmlFor="">Category</label>
                        {<Category />}
                      </div>
                    </div>

                    <div className={"form-group"}>
                      <label htmlFor="">Description</label>
                      <textarea
                        name="description"
                        ref={description}
                        type="text"
                        className={"products-description"}
                        placeholder="Product's Description"
                      />
                    </div>

                      <label htmlFor="">Details</label>
                      <DetailsTable
                        detailsInfo={detailsInfo}
                        setDetailsInfo={setDetailsInfo}
                      />
                  </div>

                  <div className={"form-img"}>
                    <div className={"form-group"}>
                      <div className={"images"}></div>
                      <input
                        ref={image}
                        name="image"
                        type="file"
                        className={"products-name"}
                        accept="image/png, image/jpeg"
                        multiple
                      />
                    </div>
                  </div>
                </div>

                <div className={"form-cta"}>
                  <button
                    type="button"
                    className={"btn btn-create"}
                    onClick={createNewProduct}
                  >
                    Create
                  </button>
                </div>
              </form>
            </section>
          </Overlay>
        )}
        <section className={"section-list"}>
          <section className={"list-promo"}>
            <Buttons
              type="button"
              title="submit"
              variant="primary"
              onClick={() => {
                setPopup(true);
              }}
            >
              Add New Product
            </Buttons>

            <section className={"filter-promo"}>
              <h2 className="heading">list promotion</h2>
              <Input
                type={"text"}
                name="search"
                value={filter}
                placeholder="Enter promotion"
                // onChange={onSearch}
              />
            </section>
            <section className={"table-promo"}>
              <table>
                <thead>
                  <tr>
                    <th>Product's Name</th>
                    <th>Status</th>
                    <th>amount</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    if (
                      index >= indexPagin * size - size &&
                      index < indexPagin * size
                    ) {
                      return (
                        <ProductItem id={product.id} onClick={openSetting} />
                      );
                    }
                    return <></>;
                  })}
                </tbody>
              </table>
            </section>
            <ul className={"paginations"}>
              {computePagins.map((item, index) => (
                <li
                  className={`${"pagin-item"} ${`${
                    indexPagin === index + 1 ? "active" : ""
                  }`}`}
                >
                  <Button
                    type={"text"}
                    title={index + 1}
                    onClick={() => {
                      setIndexPagin(index + 1);
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>
        </section>
      </section>
    </main>
  );
}

export default FormProducts;
