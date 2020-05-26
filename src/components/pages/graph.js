import React from "react";
import { Line } from "react-chartjs-2";

function Graph(props) {
  const graphData = props.data;
  let labels = [];
  let dataSetData = [];
  if (graphData.length > 0) {
    graphData.forEach(obj => {
      labels.push(obj.objectID);
      dataSetData.push(obj.points);
    });
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        data: dataSetData,
        backgroundColor: ["rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)"],
        borderWidth: 1
      }
    ]
  };
  const options = {
    legend: {
        display: true,
        position: 'left'
    },
};
  return (
    <div>
      <LineChart data={data} options={options} />
    </div>
  );
}

const LineChart = ({ data }) => {
  return (
    <div>
      <Line data={data} />
    </div>
  );
};
export default Graph;
