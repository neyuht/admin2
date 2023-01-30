import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useState } from "react";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import Category from "./Category";
import http from "../../utils/http";
import showHide from "../../scripts/helpers/showHide";
import Brand from "./Brand";

function PopUpProduct({ id, data }) {
  console.log("data", data);
  const [update, setUpdate] = useState(data);
  const [image, setImage] = useState(0);
  const [indexImage, setIndexImage] = useState(0);
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const id = update.id;
    const { category, ...rest } = update;
    const url = `${process.env.REACT_APP_URL}/products/${id}`;

    const payload = {
      ...rest,
      categoryId: category.id,
    };
    console.log("payload", payload);
    const response = await http.put(url, payload);
    if (response.status === 200) {
      const { id } = response.data.data;
      const img = document.querySelector(".image-main-selected img").src;

      const bodyFormData = new FormData();
      // Object.values(images).forEach((images) => {
      //   bodyFormData.append("images", images);
      // });
      bodyFormData.append("type", "3");
      bodyFormData.append("id", id + "");
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
    }
    window.location.reload();
  };

  const deleteVariant = (e) => {
    axiosClient
      .delete(`${process.env.REACT_APP_URL}/variants/${e.target.id}`)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something when wrong", setFlash);
      });
  };

  const ImagesList = (image) => {
    return (
      <figure
        className={`product-images-wrapper ${image.classes}`}
        onClick={image.onClick}
      >
        <img src={image.image} alt="" data-id={image.index} />
      </figure>
    );
  };

  const changeImage = (e) => {
    const list = document.querySelectorAll(".product-images-wrapper");
    list.forEach((item) => {
      item.classList.remove("product-images-wrapper-active");
    });
    e.target.parentNode.classList.add("product-images-wrapper-active");
    setImage(e.target.src);
  };

  const onDelete = useCallback(async (_id) => {
    // eslint-disable-next-line no-restricted-globals
    const check = confirm("Are you sure ?");
    if (check) {
      const url = `${process.env.REACT_APP_URL}/products/${update.id}`;
      const response = await axiosClient.delete(url);
      if (response.status === "OK") {
        window.location.reload();
      } else {
        alert("Currently unable to process!!");
      }
    }
  }, []);

  const handleChange = useCallback((key, value) => {
    setUpdate((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  return (
    <section
      className="form-wrapper"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <h2 className="heading">Products</h2>
      <div className="product-form-wrapper">
        <div className={"form-img"} style={{ width: "250px" }}>
          <div
            className={"form-group"}
            style={{ width: "250px", margin: "0px" }}
          >
            <div className={"images image-main-selected"}>
              {/* <img src={image ? image : update.imageList[0]} alt="" /> */}
            </div>
            {/* <div className="list-images">
              {update.imageList.map((item, index) =>
                index === 0 ? (
                  <ImagesList
                    image={item}
                    classes={"product-images-wrapper-active"}
                    index={index}
                    onClick={changeImage}
                  />
                ) : (
                  <ImagesList
                    image={item}
                    classes={""}
                    index={index}
                    onClick={changeImage}
                  />
                )
              )}
            </div> */}
          </div>
          <input
            name="images"
            type="file"
            className={"products-name"}
            accept="image/png, image/jpeg"
            multiple
          />
        </div>
        <div className="form-product-update">
          <section className="form-data">
            <FormDataItem label="Product's Name" id="code">
              <Input
                type="text"
                name="productName"
                placeholder="Enter product's name.."
                value={update.name}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("name", value);
                }}
              />
            </FormDataItem>
            <div className={"form-group"}>
              <FormDataItem label="Brand" id="brand">
                <Brand
                  value={update.brand.id}
                  onChange={(e) => {
                    const id = e.target.value;
                    const brand = {
                      ...update.category,
                      id,
                    };
                    handleChange("brand", brand);
                  }}
                />
              </FormDataItem>
            </div>
            <div className={"form-group"}>
              <FormDataItem label="Price" id="price">
                <Input
                  type="text"
                  name="price"
                  placeholder="Enter product's price.."
                  value={update.unitPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange("unitPrice", value);
                  }}
                />
              </FormDataItem>
              <FormDataItem label="Quantity" id="quantity">
                <Input
                  type="text"
                  name="quantity"
                  placeholder="Enter product's Quantity.."
                  value={update.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange("quantity", value);
                  }}
                />
              </FormDataItem>
            </div>
            <div className={"form-group"}>
              <FormDataItem label="Status" id="status">
                <select
                  name="status"
                  id=""
                  className={"products-status"}
                  value={update.status}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange("status", value);
                  }}
                >
                  <option value="1">Available</option>
                  <option value="0">Sold Out</option>
                </select>
              </FormDataItem>
              <FormDataItem label="Category" id="category">
                <Category
                  value={update.category.id}
                  onChange={(e) => {
                    const id = e.target.value;
                    const category = {
                      ...update.category,
                      id,
                    };
                    handleChange("category", category);
                  }}
                />
              </FormDataItem>
            </div>
            <div className={"form-group description-update"}>
              <label>Description</label>
              <textarea
                name="description"
                type="text"
                className={"products-description-update"}
                placeholder="Product's Description"
                value={update.description}
                onChange={(e) => {
                  const value = e.target.value;
                  handleChange("description", value);
                }}
              />
            </div>
          </section>
          <div className={"form-cta"}>
            <Button type="submit" title="submit" onClick={onSubmit} />
            <Button
              type="button"
              title="delete"
              onClick={(e) => {
                onDelete(id);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopUpProduct;
