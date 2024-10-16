import React, { useState, useCallback, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar, RadialBarChart, RadialBar,
  ComposedChart, Funnel, FunnelChart, Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57'];

const chartTypes = [
  'line', 'bar', 'area', 'pie', 'scatter', 'radar', 'radialBar', 'composed', 'funnel', 'treemap'
];
const defaultJsonData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

export default function JsonToRecharts({ onChartCreated }) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultJsonData, null, 2));
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  const [xAxis, setXAxis] = useState('');
  const [yAxes, setYAxes] = useState([]);
  const [availableKeys, setAvailableKeys] = useState([]);
  const [chartType, setChartType] = useState('line');
    // 当新的图表被创建时，通知父组件

  const handleJsonChange = useCallback((event) => {
    setJsonInput(event.target.value);
  }, []);

  const parseJson = useCallback(() => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        setChartData(parsedData);
        setError('');
        const keys = Object.keys(parsedData[0]);
        setAvailableKeys(keys);
        setXAxis(keys[0]);
        setYAxes(keys.slice(1, 2));
      } else {
        setError('Please provide an array of objects');
      }
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
    }
  }, [jsonInput]);

  const handleXAxisChange = useCallback((event) => {
    setXAxis(event.target.value);
  }, []);

  const handleYAxisChange = useCallback((event) => {
    const value = event.target.value;
    setYAxes(prev =>
      prev.includes(value)
        ? prev.filter(y => y !== value)
        : [...prev, value]
    );
  }, []);

  const handleChartTypeChange = useCallback((event) => {
    setChartType(event.target.value);
  }, []);

  const chartDataWithSelectedAxes = useMemo(() => {
    return chartData.map(item => ({
      [xAxis]: item[xAxis],
      ...Object.fromEntries(yAxes.map(y => [y, Number(item[y])]))
    }));
  }, [chartData, xAxis, yAxes]);

  const renderChart = () => {
    const commonProps = {
      data: chartDataWithSelectedAxes,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const renderLines = () => yAxes.map((key, index) => (
      <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} />
    ));

    const renderBars = () => yAxes.map((key, index) => (
      <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
    ));

    const renderAreas = () => yAxes.map((key, index) => (
      <Area key={key} type="monotone" dataKey={key} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
    ));

    switch(chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderLines()}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderBars()}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderAreas()}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartDataWithSelectedAxes}
              dataKey={yAxes[0]}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartDataWithSelectedAxes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {yAxes.map((key, index) => (
              <Scatter key={key} name={key} data={chartDataWithSelectedAxes} fill={COLORS[index % COLORS.length]} />
            ))}
          </ScatterChart>
        );
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" {...commonProps}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xAxis} />
            <PolarRadiusAxis />
            {yAxes.map((key, index) => (
              <Radar key={key} name={key} dataKey={key} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
            ))}
            <Legend />
          </RadarChart>
        );
      case 'radialBar':
        return (
          <RadialBarChart {...commonProps} cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" startAngle={180} endAngle={0}>
            <RadialBar minAngle={15} label={{ fill: '#666', position: 'insideStart' }} background clockWise={true} dataKey={yAxes[0]} />
            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
            <Tooltip />
          </RadialBarChart>
        );
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey={xAxis} scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yAxes[0]} fill="#8884d8" stroke="#8884d8" />
            <Bar dataKey={yAxes[1]} barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey={yAxes[2]} stroke="#ff7300" />
          </ComposedChart>
        );
      case 'funnel':
        return (
          <FunnelChart {...commonProps}>
            <Tooltip />
            <Funnel
              dataKey={yAxes[0]}
              data={chartDataWithSelectedAxes}
              isAnimationActive
            >
              {chartDataWithSelectedAxes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        );
      case 'treemap':
        return (
          <Treemap
            {...commonProps}
            dataKey={yAxes[0]}
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            {chartDataWithSelectedAxes.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Treemap>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Comprehensive JSON to Recharts Converter</h1>
      <div className="mb-4">
        <textarea
          className="w-full h-40 p-2 border rounded"
          value={jsonInput}
          onChange={handleJsonChange}
          placeholder="Enter your JSON data here..."
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={parseJson}
      >
        Parse JSON
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {availableKeys.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Chart Configuration</h2>
          <div className="mb-2">
            <label className="block">Chart Type:</label>
            <select value={chartType} onChange={handleChartTypeChange} className="border rounded p-1">
              {chartTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)} Chart</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block">X Axis:</label>
            <select value={xAxis} onChange={handleXAxisChange} className="border rounded p-1">
              {availableKeys.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Y Axes (Data Series):</label>
            {availableKeys.map(key => (
              <label key={key} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  value={key}
                  checked={yAxes.includes(key)}
                  onChange={handleYAxisChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                  disabled={['pie', 'radialBar', 'treemap'].includes(chartType) && yAxes.length >= 1 && !yAxes.includes(key)}
                />
                <span className="ml-2">{key}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {chartDataWithSelectedAxes.length > 0 && (
        <div className="mt-4" style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}