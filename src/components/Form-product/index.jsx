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
import PopUpPromo from "./product-overlay";
import iconPlus from "../../assets/icons/icon-plus.svg";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const size = 4;

function FormProducts({ fields }) {
  const [searchParams, setSearchparams] = useSearchParams({
    page: 1,
  });
  const [filter, setFilter] = useState("");
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

  /**
   *  Code của detail
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

  const nextPage = (currentPage) => {
    const temps = lists.current.filter((item) => {
      return item.includes(currentPage);
    });
    if (temps.length != 1) {
      return temps[1];
    }
    return temps[0];
  };

  const changePage = (step) => {
    let currentPage = +searchParams.get("page") + step;
    setSearchparams({
      page: currentPage,
    });
  };

  const computePagins = useMemo(() => {
    let currentPage = +searchParams.get("page");
    if (currentPage <= 0) {
      currentPage = 1;
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
    const result = validate({
      ...obj,
      description2: description,
      images,
    });
    if (result.error) {
      alert("Vui long nhap day du thong tin");
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
      const bodyFormData = new FormData();
      Object.values(images).forEach((images) => {
        bodyFormData.append("images", images);
      });
      bodyFormData.append("type", "3");
      bodyFormData.append("id", id + "");
      const response2 = await axiosClient.post(
        `${process.env.REACT_APP_URL}/images/upload-multiple/`,
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    }

    // const id = 1;
    // send request image id = 1, type = 2, image = list anh
  };

  const onSearch = () => {};

  const handleDelete = useCallback((id) => {}, []);

  const handleUpdate = useCallback((id) => {}, []);
  const handleSearch = useCallback((event) => {}, []);

  const openSetting = useCallback(
    (e, id) => {
      const product = products.find((product) => product.id === id);
      setOverlay(product);
    },
    [products]
  );

  // call api
  useEffect(() => {
    axiosClient
      .get(
        `${process.env.REACT_APP_URL}/products?page=${searchParams.get("page")}`
      )
      .then((response) => {
        const data = response.data.content;
        const _sizePagin = response.data.totalPage;
        responsePagins.current = new Array(_sizePagin)
          .fill(1)
          .map((item, index) => index + 1);
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
      });
  }, [searchParams]);

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
                        name="description2"
                        ref={description}
                        type="text"
                        className={"products-description"}
                        placeholder="Product's Description"
                      />
                    </div>

                    <div className={"form-group form-group-details"}>
                      <label htmlFor="">Details</label>
                      <figure
                        className="icon-plus-cover"
                        onClick={() => {
                          setCountForm((prev) => prev + 1);
                        }}
                      >
                        <img src={iconPlus} alt="icon plus" />
                      </figure>
                    </div>

                    {renderForm.map((form, index) => (
                      <Details countForm={index + 1} handle={handleAddDetail} />
                    ))}
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
          </div>

          <section className={"list-promo"}>
            <section className={"filter-product"}>
              <div className="filter-product-search">
                <Input
                  type={"text"}
                  name="search"
                  value={filter}
                  placeholder="Enter product's name"
                  // onChange={onSearch}
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} onClick={onSearch} />
              </div>
              <div className="filter-product-search">
                <select name="" id="">
                  <option className="option-filter" value="all">
                    All
                  </option>
                  <option className="option-filter" value="done">
                    Available
                  </option>
                  <option className="option-filter" value="notYet">
                    Sold Out
                  </option>
                </select>
              </div>
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
                    return (
                      <ProductItem
                        id={product.id}
                        productName={product.name}
                        amount={0}
                        category={product.category.name}
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
                      onClick={() => {
                        setSearchparams({
                          page: item,
                        });
                      }}
                    >
                      {item}
                    </button>
                  )
              )}
              <button
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
          <PopUpPromo data={overlay} />
        </Overlay>
      )}
    </main>
  );
}

export default FormProducts;
