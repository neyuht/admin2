import "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import React from "react";
import "./style.css";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

function ChartBar({ data, data2, data3 }) {
  const best = () => {
    const label = [];
    const data = [];
    Object.values(data2).forEach((item) => {
      label.push(item.name);
      data.push(item.count);
    });
    return { label, data };
  };

  const lowest = () => {
    const label = [];
    const data = [];
    Object.values(data3).forEach((item) => {
      label.push(item.name);
      data.push(item.count);
    });

    return { label, data };
  };

  const totalReve = () => {
    const datasLine = [];

    Object.values(data).forEach((item) => {
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

  const [selectData, setSelectData] = useState(dataTop);

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

  const commonBoard = (props) => {
    return (
      <div className="item-wrapper">
        <figure className="image-wrapper">
          <img src={props.img} alt="" />
        </figure>
        <div className="board-description">
          <p className="board-title">{props.title}</p>
          {props.description ? (
            <p className="board-title">{props.description}</p>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  const changeDataChart = (e) => {
    if (e.target.value === "bestSelling") {
      setSelectData(dataTop);
    } else if (e.target.value === "lowestSelling") {
      setSelectData(dataBottom);
    }
  };

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
            <div className="chart-board">
              <Chart
                className="chart-board-bottom"
                type="bar"
                data={selectData}
              />
            </div>
          </div>
          {/* <div className="chart-bottom-seller">
            <h2 className="chart-top-title">Lowest Selling</h2>
            <div className="chart-board">
              <Chart
                className="chart-board-bottom"
                type="bar"
                data={dataBottom}
              />
            </div>
          </div> */}
        </div>
        <div className="char-products-box-left">
          <div className="board-wrapper">
            <div className="title-chart">
              <h3>Recent Users</h3>
              <div className="board-details">
                <span>More</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className="board-content">
              <div className="item-wrapper">
                <figure className="image-wrapper">
                  <img src="" alt="" />
                </figure>
                <div className="board-description">
                  <p className="board-title">adasdadasdasd</p>
                  <p className="board-title">adasdadasdasd</p>
                </div>
              </div>
              {commonBoard({
                img: "asd",
                title: "asdasd",
                description: "sass",
              })}
            </div>
          </div>

          <div className="board-wrapper">
            <div className="title-chart">
              <h3>Recent Comments</h3>
              <div className="board-details">
                <span>More</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
            <div className="board-content">
              <div className="item-wrapper">
                <figure className="image-wrapper">
                  <img src="" alt="" />
                </figure>
                <div className="board-description">
                  <p className="board-title">adasdadasdasd</p>
                  <p className="board-title">adasdadasdasd</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartBar;
