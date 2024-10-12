import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  } else if (type === 'pie') {
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

const App = () => {
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
      i: `chart-${Date.now()}`,
      x: (charts.length * 2) % 12,
      y: Infinity, // puts it at the bottom
      w: 6,
      h: 2,
      type: type
    };
    setCharts([...charts, newChart]);
  };

  const onLayoutChange = (layout) => {
    const updatedCharts = charts.map(chart => {
      const updatedLayout = layout.find(l => l.i === chart.i);
      return { ...chart, ...updatedLayout };
    });
    setCharts(updatedCharts);
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
        <h3>Dashboard Canvas</h3>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: charts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={onLayoutChange}
        >
          {charts.map((chart) => (
            <div key={chart.i} className="chart-container">
              <ChartComponent type={chart.type} />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default App;