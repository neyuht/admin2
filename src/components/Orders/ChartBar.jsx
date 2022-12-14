import "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";
import "./style.css";

function ChartBar({ data, data2, data3 }) {
  const best = () => {
    const label = [];
    const data = [];
    Object.values(data2).forEach((item) => {
      console.log(item);
      label.push(item.name);
      data.push(item.count);
    });

    return { label, data };
  };

  const lowest = () => {
    const label = [];
    const data = [];
    Object.values(data3).forEach((item) => {
      console.log(item);
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

  return (
    <div className="chart-board">
      <div className="chart-earning-wrapper">
        <h2 className="chart-top-title">Total Revenue</h2>
        <Line width={"0%"} className="chart-earning" data={dataLine} />
      </div>
      <div className="chart-products">
        <div className="chart-top-seller">
          <h2 className="chart-top-title">Best Selling</h2>
          <div className="chart-board">
            <Chart className="chart-board-bottom" type="bar" data={dataTop} />
          </div>
        </div>
        <div className="chart-bottom-seller">
          <h2 className="chart-top-title">Lowest Selling</h2>
          <div className="chart-board">
            <Chart
              className="chart-board-bottom"
              type="bar"
              data={dataBottom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartBar;
