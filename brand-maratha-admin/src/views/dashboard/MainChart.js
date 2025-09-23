import React, { useEffect, useRef, useState } from "react";
import { CChartLine } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MainChart = ({ orders, filterType }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const processOrderData = () => {
      const orderStats = {};
      const currentYear = new Date().getFullYear();

      if (filterType === "Month") {
        months.forEach((month) => {
          orderStats[month] = { delivered: 0, pending: 0, cancelled: 0 };
        });

        orders.forEach((order) => {
          const month = months[new Date(order.created_at).getMonth()];
          orderStats[month][order.status]++;
        });
      }

      else if (filterType === "Day") {
        const currentMonthIndex = new Date().getMonth();
        const currentMonth = months[currentMonthIndex];

        const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          orderStats[`${currentMonth} ${day}`] = { delivered: 0, pending: 0, cancelled: 0 };
        }

        orders.forEach((order) => {
          const date = new Date(order.created_at);
          const day = date.getDate();
          orderStats[`${currentMonth} ${day}`][order.status]++;
        });
      }

      else if (filterType === "Year") {
        const years = Array.from({ length: 10 }, (_, i) => currentYear - 3 + i);

        years.forEach((year) => {
          orderStats[year] = { delivered: 0, pending: 0, cancelled: 0 };
        });

        orders.forEach((order) => {
          const year = new Date(order.created_at).getFullYear();
          if (orderStats[year]) {
            orderStats[year][order.status]++;
          }
        });
      }

      const labels = Object.keys(orderStats);
      setChartData({
        labels,
        datasets: [
          {
            label: "Delivered",
            backgroundColor: `rgba(${getStyle("--cui-success-rgb")}, .1)`,
            borderColor: getStyle("--cui-success"),
            data: labels.map((label) => orderStats[label].delivered || 0),
            fill: true,
          },
          {
            label: "Pending",
            backgroundColor: "transparent",
            borderColor: getStyle("--cui-warning"),
            data: labels.map((label) => orderStats[label].pending || 0),
          },
          {
            label: "Cancelled",
            backgroundColor: "transparent",
            borderColor: getStyle("--cui-danger"),
            borderDash: [8, 5],
            data: labels.map((label) => orderStats[label].cancelled || 0),
          },
        ],
      });
    };

    processOrderData();
  }, [orders, filterType]);

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: "300px", marginTop: "40px" }}
      data={chartData}
      options={{
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: getStyle("--cui-border-color-translucent") },
            ticks: { color: getStyle("--cui-body-color") },
          },
          y: {
            beginAtZero: true,
            max: 50,
            ticks: {
              color: getStyle("--cui-body-color"),
              stepSize: 10,
            },
          },
        },
        elements: {
          line: { tension: 0.4 },
          point: { radius: 3, hitRadius: 10, hoverRadius: 5 },
        },
      }}
    />
  );
};

export default MainChart;
