import Input from "../../scripts/components/input";
import Button from "../../scripts/components/button";
import FormDataItem from "../../scripts/components/form-data-item";
import { useCallback, useMemo, useState } from "react";
import axiosClient from "../../scripts/helpers/config";
import React from "react";
import Category from "./Category";
import http from "../../utils/http";
import showHide from "../../scripts/scripts/helpers/flashMessage";

function PopUpProduct({ id, data }) {
  const [update, setUpdate] = useState(data);
  const [variant, setVariant] = useState(data.productVariants);
  const [image, setImage] = useState(0);
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });
  const [description, setDescription] = React.useState(
    (() => {
      const temps = variant.map((item) => {
        const arr = [];
        Object.entries(item.description).forEach((data) => {
          arr.push(data);
        });
        return arr;
      });
      return temps;
    })()
  );
  const [variantItem, setVariantItem] = useState({});
  useMemo(() => {
    const temps = [];
    description.forEach((item) => {
      const obj = {};
      item.forEach(([key, value]) => {
        obj[key] = value;
      });
      temps.push(obj);
    });
    setVariant((prev) => {
      return prev.map((item, index) => {
        return {
          ...item,
          description: temps[index],
        };
      });
    });
  }, [description]);

  const handleAddNewVariAntItem = (indexParent, object) => {
    const temps = description[indexParent];
    temps.push([object[indexParent].key, object[indexParent].value]);
    setDescription((prev) => [...prev]);
  };

  const handleChangeKey = (indexParent, indexChildren, value) => {
    const newVariant = description;
    const newVariantParent = description[indexParent];
    const newVariantItemChildren = newVariantParent[indexChildren];
    newVariantItemChildren[0] = value;
    newVariantParent[indexChildren] = newVariantItemChildren;
    newVariant[indexParent] = newVariantParent;
    setDescription([...newVariant]);
  };

  const handleChangeValue = (indexParent, indexChildren, value) => {
    const newVariant = description;
    const newVariantParent = description[indexParent];
    const newVariantItemChildren = newVariantParent[indexChildren];
    newVariantItemChildren[1] = value;
    newVariantParent[indexChildren] = newVariantItemChildren;
    newVariant[indexParent] = newVariantParent;
    setDescription([...newVariant]);
  };

  const handlechangePrice = (indexParent, key, value) => {
    const variantTemps = variant;
    const variantItem = variantTemps[indexParent];
    variantItem[key] = value;
    setVariant([...variantTemps]);
  };

  const onSubmit = async (event) => {
    try {
      event.preventDefault();
      const id = update.id;
      const { category, ...rest } = update;
      const url = `${process.env.REACT_APP_URL}/products/${id}`;
      const temp = variant.map((item) => {
        const tempDesc = [];
        Object.entries(item.description).forEach(([key, value]) => {
          tempDesc.push(`\"${key}\": \"${value}\"`);
        });
        return {
          ...item,
          description: `{${tempDesc.join(",")}}`,
        };
      });
      const payload = {
        ...rest,
        categoryId: category.id,
        productVariants: temp,
      };
      const response = await http.put(url, payload);
      if (response.status === 200) {
        showHide(true, "success", "Add successfully", setFlash);
      }
    } catch (error) {
      showHide(true, "errors", "Oops, something when wrong", setFlash);
    }
  };

  const ImagesList = (image) => {
    return (
      <figure
        className={`product-images-wrapper ${image.classes}`}
        onClick={image.onClick}
      >
        <img src={image.image} alt="" />
      </figure>
    );
  };

  const changeImage = (e) => {
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
        <div className={"form-img"}>
          <div className={"form-group"}>
            <div className={"images"}>
              <img src={image ? image : update.imageList[0]} alt="" />
            </div>
            <div className="list-images">
              {update.imageList.map((item, index) =>
                index === 0 ? (
                  <ImagesList
                    image={item}
                    classes={"product-images-wrapper-active"}
                    onClick={changeImage}
                  />
                ) : (
                  <ImagesList
                    image={item}
                    classes={" "}
                    onClick={changeImage}
                  />
                )
              )}
            </div>
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
                  <option value="0">Available</option>
                  <option value="1">Sold Out</option>
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
        <div className="form-product-variant">
          {variant.map((vitem, indexParent) => {
            return (
              <section
                style={{ margin: "15px 20px" }}
                className="variant-wrapper"
              >
                <section
                  style={{ display: "flex" }}
                  className="form-variant-wrapper"
                >
                  <div className="group">
                    <label htmlFor="">Price</label>
                    <input
                      name="unitPrice"
                      type="text"
                      value={vitem.unitPrice}
                      onChange={(event) => {
                        const value = event.target.value;
                        handlechangePrice(indexParent, "unitPrice", value);
                      }}
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="">Quantity</label>
                    <input
                      type="text"
                      name="quantity"
                      value={vitem.quantity}
                      onChange={(event) => {
                        const value = event.target.value;
                        handlechangePrice(indexParent, "quantity", value);
                      }}
                    />
                  </div>
                </section>
                <form name={`variant-item-${indexParent}`}>
                  <label htmlFor="">Details</label>
                  <div>
                    <input
                      type="text"
                      placeholder="New key"
                      onKeyDown={(event) => {
                        const value = event.target.value;
                        const key = event.code;
                        console.log(key);
                        const obj = {
                          ...variantItem,
                          [indexParent]: {
                            ...variantItem[indexParent],
                            key: value,
                          },
                        };
                        setVariantItem(obj);
                        if (key === "Enter" && value) {
                          obj[indexParent] = {
                            ...obj[indexParent],
                            key: value,
                          };
                          handleAddNewVariAntItem(indexParent, obj);
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="New value"
                      onKeyDown={(event) => {
                        const value = event.target.value;
                        const key = event.code;
                        const obj = {
                          ...variantItem,
                          [indexParent]: {
                            ...variantItem[indexParent],
                            value,
                          },
                        };
                        setVariantItem(obj);
                        if (key === "Enter" && value) {
                          obj[indexParent] = {
                            ...obj[indexParent],
                            value,
                          };
                          handleAddNewVariAntItem(indexParent, obj);
                        }
                      }}
                    />
                  </div>
                </form>
                {description[indexParent].map(([key, value], indexChildren) => {
                  return (
                    <section
                      key={indexChildren}
                      onDoubleClick={() => {
                        console.log(description[[indexParent]][indexChildren]);
                      }}
                    >
                      <input
                        type="text"
                        value={key}
                        onChange={(event) => {
                          const value = event.target.value;
                          handleChangeKey(indexParent, indexChildren, value);
                        }}
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(event) => {
                          const value = event.target.value;
                          handleChangeValue(indexParent, indexChildren, value);
                        }}
                      />
                    </section>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PopUpProduct;
