import React, { useCallback, useEffect, useRef, useState } from "react";
import Category from "./Category";
import DetailsTable from "./Details/details";
import * as request from "../../utils/http";
import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import { validate } from "../../scripts/helpers/validation";
import { changeStyleElementByObject } from "../../scripts/helpers/styles-change";
import './style.css';

const size = 10;

function FormProducts({ fields }) {
  const [filter, setFilter] = useState("");
  const [indexPagin, setIndexPagin] = useState(1);
  const [isCheck, setIsChecked] = useState(false);
  const ref = useRef("");
  const [products, setProducts] = useState(new Array(20).fill(1));
  const [pagins, setPagins] = useState([1]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const computePagins = useCallback((array) => {
    const sizePagin =
      array.length % size === 0 ? array.length / size : parseInt(array.length / size) + 1;
    const _tempsPagin = new Array(sizePagin).fill(1);
    setPagins(_tempsPagin);
  }, []);

  const onChange = () => {
    setIsChecked(!isCheck);
  };

  const createNewProduct = (e) => {
    e.preventDefault();
    const form = document.forms[0];
    const productName = form[0].value;
    const selectStatus = form[1].value;
    const selectCategory = form[2].value;
    const description = form[3].value;
    const imageTemp = form[5].files[0];
    const image = imageTemp && imageTemp;
    const obj = {
      productName,
      selectStatus,
      selectCategory,
      description,
      image,
    };
    const empty = validate(obj);
    const emptyLength = Object.keys(empty).length;
    console.log(emptyLength);
    if (!emptyLength) {
      console.log("Don't send");
      return;
    }
    console.log("Send");
    const id = 1
    // send request image id = 1, type = 2, image = list anh
  };

  const resetProduct = (e) => {
    document.forms[1].reset();
  };

  const handleDelete = (id) => {};

  const handleUpdate = (id) => {};

  useEffect(() => {
    const _temps = [...products];
    computePagins(_temps);
  }, []);

  return (
    <main className={"main-wrapper"}>
      <section className={"container-main"}>
        <section className={"section-form"}>
          <form
            action=""
            className={"form-products"}
            onSubmit={createNewProduct}
            enctype="multipart/form-data"
          >
            <div className={"form-information"}>
              <div className={"form-content"}>
                <div className={"form-group"}>
                  <input
                    ref={ref}
                    type="text"
                    className={"products-input products-name"}
                    name="productName"
                    placeholder="Product's Name"
                  />
                </div>

                <div className={"form-group"} id="productStatus">
                  <select name="selectStatus" id="" className={"products-status"}>
                    <option value="0" ref={ref}>
                      Available
                    </option>
                    <option value="1" ref={ref}>
                      Sold Out
                    </option>
                  </select>
                </div>

                <div className={"form-group"} id="productCategory">
                  {<Category />}
                </div>

                <div className={"form-group"}>
                  <textarea
                    name="description"
                    ref={ref}
                    type="text"
                    className={"products-description"}
                    placeholder="Product's Description"
                  />
                </div>

                <div className={"form-group"}>
                  <div className={"checkbox-related"}>
                    <input
                      type="checkbox"
                      className={"products-input products-related"}
                      placeholder="Product's Description"
                      onChange={onChange}
                      checked={isCheck}
                    />
                    <span> No related products</span>
                  </div>
                </div>

                {isCheck && <DetailsTable />}
              </div>

              <div className={"form-img"}>
                <div className={"form-group"}>
                  <div className={"images"}></div>
                  <input name="image" type="file" className={"products-name"} accept="image/png, image/jpeg" multiple/>
                </div>
              </div>
            </div>

            <div className={"form-cta"}>
              <button type="button" className={"btn btn-create"} onClick={createNewProduct}>
                Create
              </button>
            </div>
          </form>
        </section>

        <section className={"section-list"}>
          <section className={"list-promo"}>
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
                <tbody></tbody>
              </table>
            </section>
            <ul className={"paginations"}>
              {pagins.map((item, index) => (
                <li className={`${"pagin-item"} ${`${indexPagin === index + 1 ? "active" : ""}`}`}>
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
