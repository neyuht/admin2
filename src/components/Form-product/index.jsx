import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Category from "./Category";
import Details from "./Details/details";
import http, * as request from "../../utils/http";
import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import { validate } from "../../scripts/helpers/validation";
import Buttons from "react-bootstrap/Button";
import ProductItem from "../../scripts/components/l-product-item";
import "./style.css";
import { useMemo } from "react";
import Overlay from "../Overlay/overlay";
import axiosClient from "../../scripts/helpers/config";
import convertArrayToString from "../../scripts/helpers/convert";
import PopUpProduct from "./product-overlay";
import iconPlus from "../../assets/icons/icon-plus.svg";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlashMessage from "../FlashMessage/flashMessage";
import { clearStyle } from "../../scripts/helpers/styles-change";
import { Form } from "react-bootstrap";
const size = 4;

function FormProducts({ fields }) {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [filter, setFilter] = useState({
    name: "",
    status: "",
  });
  const [statePagin, setStatePagin] = useState({
    size: 4,
    step: 1,
    currentIndex: +searchParams.get("page"),
    start: 0,
    end: 3,
  });
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
  const [overlay, setOverlay] = useState();
  const responsePagins = useRef([]);
  const lists = useRef([]);
  const [currentPages, setCurrentPages] = useState([]);
  const timmerId = useRef(null);
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [popupImport, setPopupImport] = useState(false);

  /**
   *  Code c???a detail
   */
  const [countForm, setCountForm] = useState(1);
  const [variant, setVariant] = useState({});
  const renderForm = useMemo(() => {
    return new Array(countForm).fill(1);
  }, [countForm]);
  const handleAddDetail = useCallback((obj) => {
    setVariant((prev) => ({
      ...prev,
      ...obj,
    }));
  }, []);

  /**
   * nh???n v??o currentPage (page hi???n t???i)
   * @param {*} currentPage
   * @returns
   */
  const nextPage = (currentPage) => {
    // list l?? arr [a,b,c,d]
    const temps = lists.current.filter((item) => {
      return item.includes(currentPage);
    });
    if (temps.length != 1) {
      return temps[1];
    }
    return temps[0];
  };

  /**
   * n??t next v?? prev b???ng l???y page url -/+ step
   * @param {*} step
   */
  const changePage = (step) => {
    const currentPage = +searchParams.get("page") + step;
    let obj = {};
    for (const [key, value] of searchParams.entries()) {
      obj = {
        ...obj,
        [key]: value,
      };
    }
    const { page, ...rest } = obj;
    setSearchparams({
      page: currentPage,
      ...rest,
    });
  };

  /**
   * l???y page hi???n t???i tr??n url
   * n???u ko truy???n l??n th?? c?? default s???n
   */
  const computePagins = useMemo(() => {
    let currentPage = +searchParams.get("page");
    // param url < 0 -> v??? page=1
    if (currentPage <= 0) {
      currentPage = 1;
      // n???u param url > total page -> page cu???i c??ng
    } else if (
      currentPage > responsePagins.current[responsePagins.current.length - 1]
    ) {
      currentPage = responsePagins.current[responsePagins.current.length - 1];
    }
    const data = nextPage(currentPage) || [];
    return data;
  }, [searchParams, products]);

  const createNewProduct = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = document.forms["formAddProduct"];
    const name = form["name"].value;
    const category = form["category"].value;
    const status = form["status"].value;
    const images = Array.from(form["images"].files);
    console.log("test", images);
    const description2 = form["description2"].value;
    const variantRq = Object.values(variant).map((obj) => ({
      ...obj,
      description: convertArrayToString(obj.description),
    }));

    const data = {
      name,
      status,
      description: description2,
      categoryId: category,
      productVariantList: variantRq,
    };
    const { productVariantList, description, ...obj } = data;
    clearStyle({
      name: obj.name,
      description2: description,
      images,
    });
    const result = validate({
      ...obj,
      description2: description,
      images,
    });
    if (result.error) {
      return;
    }
    if (!productVariantList.length) {
      alert("Vui long nhap variant");
      return;
    }
    const response = await http.post(
      `${process.env.REACT_APP_URL}/products`,
      data
    );
    if (response.status === 200) {
      const { id } = response.data.data;
      const newProducts = [response.data.data, ...products];
      setProducts(newProducts);
      const bodyFormData = new FormData();
      Object.values(images).forEach((images) => {
        bodyFormData.append("images", images);
      });
      bodyFormData.append("type", "3");
      bodyFormData.append("id", id + "");
      console.log("1", bodyFormData);
      const response2 = await axiosClient
        .post(
          `${process.env.REACT_APP_URL}/images/upload-multiple/`,
          bodyFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .catch(() => {
          showHide(true, "errors", "Oops, something when wrong", setFlash);
        });
      window.location.reload();
    }
  };

  /**
   * truy???n v??o obj (ch???a key, value c???n filter)
   * for: duy???t qua param ???? c?? tr??n url -> l??u v??o 1 obj
   * @param {*} value1
   */
  const getDataSearch = (value1) => {
    let obj = {};
    for (const [key, value] of searchParams.entries()) {
      obj = {
        [key]: value,
      };
    }

    // obj c?? v?? 1 param m???i
    obj = {
      ...obj,
      ...value1,
    };

    // lo???i b??? c??c param r???ng
    let newObj = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value) {
        newObj = {
          ...newObj,
          [key]: value,
        };
      }
    });

    setSearchparams({
      page: 1,
      ...newObj,
    });
  };

  const sendExcel = () => {
    const file = document.querySelector(".modal-import-excel input");
    const bodyFormData = new FormData();
    bodyFormData.append("file", file.files[0]);
    console.log(file.files);
    axiosClient
      .post(`${process.env.REACT_APP_URL}/products/import`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        showHide(true, "errors", "Oops, something when wrong", setFlash);
      });
  };

  /**
   * Event search products
   * @param {e} event
   */
  const onSearch = (event) => {
    const value = event.target.value;
    setFilter((prev) => ({
      ...prev,
      name: value,
    }));
    if (timmerId.current) clearTimeout(timmerId.current);
    timmerId.current = setTimeout(() => {
      const { name, ...rest } = filter;
      const params = {
        name: value,
        ...rest,
      };
      getDataSearch(params);
    }, 600);
  };

  /**
   * Open form products to update, delete
   */
  const openSetting = useCallback((e, id) => {
    axiosClient
      .get(`http://localhost:8080/api/v1/public/products/${id}`)
      .then((response) => {
        setOverlay(response.data);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something when wrong", setFlash);
      });
  }, []);

  const showHide = (action, type, message) => {
    const state = {
      action,
      type,
      message,
    };
    setFlash({
      ...state,
    });
  };

  // call api
  useEffect(() => {
    let param = "?";
    for (const [key, value] of searchParams.entries()) {
      param += `${key}=${value}&`;
    }
    axiosClient
      .get(`${process.env.REACT_APP_URL}/products${param}`)
      .then((response) => {
        const data = response.data.content;
        const _sizePagin = response.data.totalPage;
        // t???o m???t arr l???n v???i length < total page
        responsePagins.current = new Array(_sizePagin)
          .fill(1)
          .map((item, index) => index + 1);
        lists.current = [];
        // filter qua r???i add th??m c??c m???ng nh??? ???? ??c filter
        for (
          let index = 0;
          index < responsePagins.current.length;
          index += size - 1
        ) {
          lists.current.push([
            responsePagins.current[index],
            responsePagins.current[index + 1],
            responsePagins.current[index + 2],
            responsePagins.current[index + 3],
          ]);
        }

        setProducts(data);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something when wrong", setFlash);
      });
  }, [searchParams]);

  console.log(responsePagins.current, lists.current);

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
                <div className={"form-information"} style={{ width: "855px" }}>
                  <div className={"form-content"}>
                    <div className={"form-data-item"}>
                      <label htmlFor="">Name</label>
                      <input
                        ref={name}
                        type="text"
                        className={"products-input products-name"}
                        name="name"
                        placeholder="Name"
                      />
                    </div>
                    <div
                      className={"form-group-two"}
                      style={{ width: "515px" }}
                    >
                      <div className={"form-category"} id="productCategory">
                        <label htmlFor="">Brand</label>
                        {<Category />}
                      </div>
                    </div>
                    <div
                      className={"form-group-two"}
                      style={{ width: "515px" }}
                    >
                      <div className={"form-status"} id="productStatus">
                        <label htmlFor="">Status</label>
                        <select
                          ref={status}
                          name="status"
                          id=""
                          className={"products-status"}
                        >
                          <option value="1">Available</option>
                          <option value="0">Sold Out</option>
                        </select>
                      </div>

                      <div className={"form-category"} id="productCategory">
                        <label htmlFor="">Category</label>
                        {<Category />}
                      </div>
                    </div>
                    <div className="details-box-two" style={{ height: "95px" }}>
                      <div className={"form-group"} style={{ width: "50%" }}>
                        <label htmlFor="">Price</label>
                        <input
                          type="number"
                          min={0}
                          name="unitPrice"
                          placeholder="unitPrice"
                          className="products-input"
                        />
                      </div>
                      <div className={"form-group"} style={{ width: "50%" }}>
                        <label htmlFor="">Quantity</label>
                        <input
                          type="number"
                          min={0}
                          name="quantity"
                          placeholder="quantity"
                          className="products-input"
                        />
                      </div>
                    </div>

                    <div className={"form-group"}>
                      <label htmlFor="">Description</label>
                      <textarea
                        name="description2"
                        ref={description}
                        type="text"
                        className={"products-description"}
                        placeholder="Product's Description"
                      />
                    </div>
                  </div>

                  <div className={"form-img"}>
                    <div className={"form-group"}>
                      <div className={"images"}></div>
                      <input
                        ref={image}
                        name="images"
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
          <div className="dashboard-content-header">
            <h2>Products List</h2>
            <div className="dashboard-content-btn">
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
              <Buttons
                type="button"
                title="submit"
                variant="primary"
                onClick={() => {
                  setPopupImport(true);
                }}
              >
                Import Excel
              </Buttons>
            </div>
          </div>
          <section className={"list-promo"}>
            <section className={"filter-button"}>
              <Buttons
                type="button"
                title="submit"
                variant="secondary"
                onClick={() => {
                  setPopup(true);
                }}
                style={{ color: "#fff", fontWeight: "bold" }}
              >
                <FontAwesomeIcon
                  icon={faFilter}
                  style={{ paddingRight: "10px" }}
                />
                Filter
              </Buttons>
            </section>
            <section
              className={"filter-product"}
              style={{
                margin: "20px 0",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <div className="filter-product-search">
                <Input
                  type={"text"}
                  name="search"
                  value={filter.name}
                  placeholder="Enter product's name"
                  onChange={onSearch}
                />
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  onClick={() => {
                    getDataSearch(filter);
                  }}
                />
              </div>
              <div className="filter-product-search">
                <select
                  name=""
                  id=""
                  value={filter.status}
                  onChange={(event) => {
                    const params = {
                      ...filter,
                      status: event.target.value,
                    };
                    setFilter(params);
                    getDataSearch(params);
                  }}
                >
                  <option className="option-filter" value="">
                    All
                  </option>
                  <option className="option-filter" value="1">
                    Available
                  </option>
                  <option className="option-filter" value="0">
                    Sold Out
                  </option>
                </select>
              </div>
            </section>
            <section className={"table-promo"}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product's Name</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Brand</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    return (
                      <ProductItem
                        id={product.id}
                        productName={product.name}
                        description={product.description}
                        price={product.price}
                        quantity={product.quantity}
                        status={product.status}
                        onClick={openSetting}
                      />
                    );
                  })}
                </tbody>
              </table>
            </section>
            <ul className={"paginations"}>
              <button
                className="btn-pages button-pagination-move"
                onClick={() => {
                  changePage(-1);
                }}
                disabled={searchParams.get("page") * 1 === 1}
              >
                prev
              </button>
              {computePagins.map(
                (item, index) =>
                  item && (
                    <button
                      className={`buttons-pagination ${
                        +searchParams.get("page") === item
                          ? "buttons-pagination-active"
                          : ""
                      }`}
                      onClick={() => {
                        let obj = {};
                        for (const [key, value] of searchParams.entries()) {
                          obj = {
                            ...obj,
                            [key]: value,
                          };
                        }
                        obj["page"] = item;

                        setSearchparams({
                          ...obj,
                        });
                      }}
                    >
                      {item}
                    </button>
                  )
              )}
              <button
                className="btn-pages button-pagination-move"
                onClick={() => {
                  changePage(1);
                }}
                disabled={
                  searchParams.get("page") * 1 ===
                  responsePagins.current[responsePagins.current.length - 1]
                }
              >
                next
              </button>
            </ul>
          </section>
        </section>
      </section>
      {overlay && (
        <Overlay onClick={setOverlay}>
          <PopUpProduct data={overlay} />
        </Overlay>
      )}
      {popupImport && (
        <Overlay
          onClick={(e) => {
            setPopupImport(false);
          }}
        >
          <div
            className="modal-import-excel"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Form.Control
              name="file"
              type="file"
              enctype="multipart/form-data"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <Buttons
              type="button"
              title="submit"
              variant="primary"
              onClick={sendExcel}
            >
              Import
            </Buttons>
          </div>
        </Overlay>
      )}
      {flash.action && (
        <FlashMessage
          rules={flash.type}
          message={flash.message}
          state={flash}
          onClick={setTimeout((event) => {
            showHide(false, "", "", setFlash);
          }, 3000)}
        />
      )}
    </main>
  );
}

export default FormProducts;
