import React, { useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getAllCategory } from "../../service/categoryService";
import "../styles.css";
import Overlay from "../../components/Overlay/overlay";
import PopUpPromo from "../../components/Form-product/product-overlay";
import Button from "../../scripts/components/button";
import CategoryItem from "../../scripts/components/l-promo-item";
import Input from "../../scripts/components/input";
import Buttons from "react-bootstrap/Button";
import FormDataItem from "../../scripts/components/form-data-item";
import Select from "../../scripts/components/select";
function Categories() {
  const [data, setData] = useState([]);
  const [overlay, setOverlay] = useState();
  const [indexPagin, setIndexPagin] = useState(1);
  const [categories, setCategories] = useState([]);
  const [popup, setPopup] = useState(false);

  const callAPI = async (callback) => {
    const res = await getAllCategory();
    callback(res.data.data);
  };
  const openSetting = async (e, id) => {
    const category = categories.find((promo) => promo.id === id);
    setOverlay(category);
  };

  useEffect(() => {
    callAPI(setData);
  }, []);

  const popupAddPromo = useCallback(() => {
    setPopup((prev) => !prev);
  }, []);

  const onSubmit = (event) => {};
  const onSearch = () => {};
  return (
    <>
      <div className="dashboard-content">
        <div className="dashboard-content-container">
          <section className={"promo-wrapper"}>
            <section className={"container-main"}>
              {popup && (
                <Overlay onClick={popupAddPromo}>
                  <section
                    className={"section-form"}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <form
                      action="#"
                      className={"form-wrapper"}
                      onSubmit={onSubmit}
                    >
                      <h2 className={"heading"}>add promotion</h2>
                      <section className={"form-data"}>
                        <FormDataItem label="code" id="code">
                          <Input
                            type="text"
                            name="code"
                            // value={code}
                            placeholder="Enter code.."
                            onChange={(event) => {
                              // setCode(event.target.value);
                            }}
                          />
                        </FormDataItem>
                        <div className={"form-group"}>
                          <FormDataItem label="percent" id="percent">
                            <Select
                              // datas={percents}
                              name="percent"
                              // value={percent}
                              onChange={(event) => {
                                // setPercent(event.target.value);
                              }}
                            />
                          </FormDataItem>
                          <FormDataItem label="status" id="status">
                            <Select
                              // datas={statuss}
                              name="status"
                              // value={status}
                              onChange={(event) => {
                                // setStatus(event.target.value);
                              }}
                            />
                          </FormDataItem>
                        </div>
                        <div className={"form-group"}>
                          <FormDataItem label="amount" id="amount">
                            <Input
                              type="text"
                              name="amount"
                              // value={amount}
                              placeholder="Enter amount.."
                              onChange={(event) => {
                                // setAmount(event.target.value);
                              }}
                            />
                          </FormDataItem>
                          <FormDataItem label="max amount" id="maxAmount">
                            <Input
                              type="text"
                              name="maxAmount"
                              // value={maxAmount}
                              placeholder="Enter max amount.."
                              onChange={(event) => {
                                // setMaxAmount(event.target.value);
                              }}
                            />
                          </FormDataItem>
                        </div>
                        <div className={"form-group"}>
                          <FormDataItem label="startDate" id="startDate">
                            <Input
                              type="date"
                              name="startDate"
                              // value={startDate}
                              onChange={(event) => {
                                // setStartDate(event.target.value);
                              }}
                            />
                          </FormDataItem>
                          <FormDataItem label="endDate" id="endDate">
                            <Input
                              type="date"
                              name="endDate"
                              // value={endDate}
                              onChange={(event) => {
                                // setEndDate(event.target.value);
                              }}
                            />
                          </FormDataItem>
                        </div>
                      </section>
                      <Button type="submit" title="submit" onClick={onSubmit} />
                    </form>
                  </section>
                </Overlay>
              )}
              <div className="dashboard-content-header">
                <h2>Categories List</h2>
                <Buttons
                  type="button"
                  title="submit"
                  variant="primary"
                  onClick={popupAddPromo}
                >
                  Add New Promotion
                </Buttons>
              </div>
              <section className={"section-list"}>
                <section className={"list-promo"}>
                  {/* <Buttons variant="primary" onClick={popupAddPromo}>
              Add New Product
            </Buttons> */}

                  <section className={"filter-product"}>
                    <div className="filter-product-search">
                      <Input
                        type={"text"}
                        name="search"
                        // value={filter}
                        placeholder="Enter promotion"
                        // onChange={onSearch}
                      />
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        onClick={onSearch}
                      />
                    </div>
                  </section>
                  <section className={"table-promo"}>
                    <table>
                      <thead>
                        <tr>
                          <th>code</th>
                          <th>percent</th>
                          <th>amount</th>
                          <th>max amount</th>
                          <th>start Date</th>
                          <th>expires</th>
                          <th>status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category, index) => {
                          return (
                            <CategoryItem
                              // id={promotion.id}
                              // code={promotion.code}
                              // percent={promotion.percent}
                              // amount={promotion.amount}
                              // maxAmount={promotion.maxAmount}
                              // startDate={new Date(
                              //   promotion.startDate
                              // ).toLocaleDateString("en-GB")}
                              // expire={new Date(
                              //   promotion.endDate
                              // ).toLocaleDateString("en-GB")}
                              // status={
                              //   new Date(promotion.endDate)
                              //     .toLocaleString("en-GB")
                              //     .split(",")[0] ===
                              //   new Date().toLocaleString("en-GB").split(",")[0]
                              //     ? "Expired"
                              //     : "Available"
                              // }
                              onClick={openSetting}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </section>
                  <ul className={"paginations"}>
                    {/* {arrButton.map((item, index) => (
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
                ))} */}
                  </ul>
                </section>
              </section>
            </section>
            {overlay && (
              <Overlay onClick={setOverlay}>
                <PopUpPromo {...overlay} />
              </Overlay>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Categories;
