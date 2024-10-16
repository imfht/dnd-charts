import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const tableIcons = [
  { id: 'bar', name: 'Bar Chart', icon: '📊' },
  { id: 'line', name: 'Line Chart', icon: '📈' },
  { id: 'pie', name: 'Pie Chart', icon: '🥧' },
];

const barChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const pieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartComponent = ({ type }) => {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  } else if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  else if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  return <div>Unsupported chart type: {type}</div>;
};

const DNDCharts = () => {
  const [charts, setCharts] = useState([]);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text');
    const newChart = {
      id: `chart-${Date.now()}`,
      type: type,
      x: e.clientX - e.target.offsetLeft,
      y: e.clientY - e.target.offsetTop,
      width: 300,
      height: 200,
    };
    setCharts([...charts, newChart]);
  };

  const onDragStop = (id, d) => {
    setCharts(charts.map(chart =>
      chart.id === id ? { ...chart, x: d.x, y: d.y } : chart
    ));
  };

  const onResizeStop = (id, ref, delta, position) => {
    setCharts(charts.map(chart =>
      chart.id === id ? {
        ...chart,
        width: ref.style.width,
        height: ref.style.height,
        ...position
      } : chart
    ));
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Chart Types</h3>
        {tableIcons.map((icon) => (
          <div
            key={icon.id}
            className="icon"
            draggable
            onDragStart={(e) => onDragStart(e, icon.id)}
          >
            <span>{icon.icon}</span>
            <span>{icon.name}</span>
          </div>
        ))}
      </div>
      <div className="canvas" onDragOver={onDragOver} onDrop={onDrop}>
        <h3>Dashboard</h3>
        {charts.map((chart) => (
          <Rnd
            key={chart.id}
            default={{
              x: chart.x,
              y: chart.y,
              width: chart.width,
              height: chart.height,
            }}
            minWidth={200}
            minHeight={150}
            bounds="parent"
            onDragStop={(e, d) => onDragStop(chart.id, d)}
            onResizeStop={(e, direction, ref, delta, position) =>
              onResizeStop(chart.id, ref, delta, position)
            }
          >
            <div className="chart-container">
              <ChartComponent type={chart.type} />
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default DNDCharts;