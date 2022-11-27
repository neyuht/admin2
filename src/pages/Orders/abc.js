import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import React from "react";
import './style.css';

const dataTop = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'asd', 'asd', 'dfgdfg', 'sdfsdf', 'kasjdlakjdlakjdsasd'],
    datasets: [
        {
            label: 'Products',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 99, 132, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 206, 86, 0.5)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        }
    ]
}

const dataBottom = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'asd', 'asd', 'dfgdfg', 'sdfsdf', 'kasjdlakjdlakjdsasd'],
    datasets: [
        {
            label: 'Products',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 99, 132, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 206, 86, 0.5)',
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
        }
    ]
}

function DoughnutChart() {
    return (
        <div className='chartBoard'>
            <div className='chart-top-seller'>
                <h2 className='chart-top-title'>Best Selling6</h2>
                <div className='chart-board'>
                    <Chart className='chart-board-bottom' type='bar' data={dataTop} />
                </div>
            </div>
            <div className='chart-bottom-seller'>
                <h2 className='chart-top-title'>Sản Phẩm Có số lượt mua thấp </h2>
                <div className='chart-board'>
                    <Chart  className='chart-board-bottom' type='bar' data={dataBottom}/>
                </div>
            </div>
        </div>
    );
}

export default DoughnutChart;
