import "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import React from "react";
import "./style.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import axiosClient from "../../scripts/helpers/config";
import User from "../../assets/icons/user.png";
import Overlay from "../Overlay/overlay";
import PopUpChart from "./order-users-overlay";
import showHide from "../../scripts/helpers/showHide";
import FlashMessage from "../FlashMessage/flashMessage";

function ChartBar({ data, data2, data3, datas }) {
  const [datas1, setDatas1] = useState(datas);
  const [datas2, setDatas2] = useState(datas);
  const [datas3, setDatas3] = useState(datas);
  const [recentUsers, setRecentUsers] = useState([]);
  const [overlay, setOverlay] = useState();
  const [comment, setComment] = useState([]);
  const [flash, setFlash] = useState({
    action: false,
    type: "",
    message: "",
  });

  const best = () => {
    const label = [];
    const data = [];
    Object.values(datas2).forEach((item) => {
      label.push(item.name);
      data.push(item.count);
    });
    return { label, data };
  };

  const lowest = () => {
    const label = [];
    const data = [];
    Object.values(datas3).forEach((item) => {
      label.push(item.name);
      data.push(item.count);
    });

    return { label, data };
  };

  const totalReve = () => {
    const datasLine = [];

    Object.values(datas1).forEach((item) => {
      datasLine.push(Math.round(item[0]));
    });
    return datasLine;
  };

  const dataTop = {
    labels: best().label,
    datasets: [
      {
        label: "Products",
        data: best().data,
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const [selectData, setSelectData] = useState("bestSelling");

  const dataBottom = {
    labels: lowest().label,
    datasets: [
      {
        label: "Products",
        data: lowest().data,
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataLine = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Money earning a year",
        data: totalReve(),
        backgroundColor: ["rgba(255, 99, 132, 0.5)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const CommonBoard = (props) => {
    return (
      <div className="item-wrapper">
        <figure className="image-wrapper">
          {props.image ? (
            <img src={props.img} alt="" />
          ) : (
            <img src={User} alt="" />
          )}
        </figure>
        <div className="board-description">
          <p className="board-title">{props.title}</p>
          <p
            className="board-title"
            style={{ overflow: "hidden", textOverflow: "wrap" }}
          >
            {props.description}
          </p>
        </div>
      </div>
    );
  };

  const openSetting = () => {
    setOverlay({ title: "Recent Users", data: recentUsers });
  };

  const openSetting2 = () => {
    setOverlay({ title: "Recent Comments", data: comment });
  };

  const changeDataChart = (e) => {
    if (e.target.value === "bestSelling") {
      setSelectData("bestSelling");
    } else if (e.target.value === "lowestSelling") {
      setSelectData("lowestSelling");
    }
  };

  const RenderChart = () => {
    return (
      <div className="chart-board">
        <Chart
          className="chart-board-bottom"
          type="bar"
          data={selectData === "bestSelling" ? dataTop : dataBottom}
        />
      </div>
    );
  };

  useEffect(() => {
    setDatas1(data);
    setDatas2(data2);
    setDatas3(data3);
  }, [data, data2, data3]);

  useEffect(() => {
    axiosClient
      .get(`${process.env.REACT_APP_URL}/orders/recent-order`)
      .then((response) => {
        const data = response.data;
        setRecentUsers(data.user);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  }, []);

  useEffect(() => {
    axiosClient
      .get(`${process.env.REACT_APP_URL}/comments?perPage=20`)
      .then((response) => {
        const data = response.data;
        setComment(data.content);
      })
      .catch(() => {
        showHide(true, "errors", "Oops, something went wrong", setFlash);
      });
  }, []);

  return (
    <div className="chart-board">
      <div className="chart-earning-wrapper">
        <h2 className="chart-top-title">Total Revenue</h2>
        <Line width={"0%"} className="chart-earning" data={dataLine} />
      </div>
      <div className="chart-products">
        <div className="char-products-box">
          <div className="chart-top-seller">
            <div className="title-chart">
              <h2 className="chart-top-title">Products Selling</h2>
              <select name="selectData" onChange={changeDataChart}>
                <option className="option-filter" value="bestSelling">
                  Best Selling
                </option>
                <option className="option-filter" value="lowestSelling">
                  Lowest Selling
                </option>
              </select>
            </div>
            <RenderChart />
          </div>
        </div>
        <div className="char-products-box-left">
          <div className="board-wrapper">
            <div className="title-chart">
              <h3>Recent Users</h3>
              <div className="board-details" onClick={openSetting}>
                <span>More</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className="board-content">
              {recentUsers.slice(0, 10).map((user, index) => {
                return (
                  <CommonBoard
                    img={user.image}
                    title={user.firstName + " " + user.lastName}
                    description={user.email}
                  />
                );
              })}
            </div>
          </div>

          <div className="board-wrapper">
            <div className="title-chart">
              <h3>Recent Comments</h3>
              <div className="board-details" onClick={openSetting2}>
                <span>More</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className="board-content">
              {comment.slice(0, 10).map((cmt, index) => {
                return (
                  <CommonBoard
                    img={cmt.userImg}
                    title={cmt.username}
                    description={cmt.content}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {overlay && (
        <Overlay onClick={setOverlay}>
          <PopUpChart {...overlay} />
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
    </div>
  );
}

export default ChartBar;
