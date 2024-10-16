import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import _ from 'lodash';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const AGGridWithLocalStorage = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [summary, setSummary] = useState({});
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const gridRef = useRef(null);

  const columns = [
    { field: 'name', filter: 'agTextColumnFilter', sortable: true },
    { field: 'age', filter: 'agNumberColumnFilter', sortable: true },
    { field: 'country', filter: 'agSetColumnFilter', sortable: true },
    {
      field: 'salary',
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: params => `$${params.value.toLocaleString()}`
    },
    { field: 'department', filter: 'agSetColumnFilter', sortable: true },
  ];

  useEffect(() => {
    // Simulating data fetch
    const fetchData = () => {
      const data = [
        { name: "John Doe", age: 35, country: "USA", salary: 50000, department: "IT" },
        { name: "Jane Smith", age: 28, country: "Canada", salary: 45000, department: "HR" },
        { name: "Bob Johnson", age: 42, country: "UK", salary: 55000, department: "Finance" },
        { name: "Alice Brown", age: 31, country: "Australia", salary: 52000, department: "Marketing" },
        { name: "Charlie Wilson", age: 39, country: "Germany", salary: 58000, department: "IT" },
        { name: "Eva Garcia", age: 45, country: "Spain", salary: 60000, department: "Finance" },
        { name: "Frank Lee", age: 33, country: "China", salary: 48000, department: "HR" },
        { name: "Grace Kim", age: 29, country: "South Korea", salary: 51000, department: "Marketing" },
        { name: "Henry Chen", age: 37, country: "Taiwan", salary: 53000, department: "IT" },
        { name: "Ivy Wong", age: 41, country: "Singapore", salary: 59000, department: "Finance" },
      ];
      setRowData(data);
    };

    fetchData();
  }, []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('agGridConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);

      // Apply column state
      if (config.columnState) {
        params.columnApi.applyColumnState({ state: config.columnState });
      }

      // Apply filter model
      if (config.filterModel) {
        params.api.setFilterModel(config.filterModel);
      }

      // Apply sort model
      if (config.sortModel) {
        params.api.setSortModel(config.sortModel);
      }
    }
  }, []);

  const saveConfig = useCallback(() => {
    if (gridColumnApi && gridApi) {
      const columnState = gridColumnApi.getColumnState();
      const filterModel = gridApi.getFilterModel();
      const sortModel = gridApi.getSortModel();

      const config = {
        columnState,
        filterModel,
        sortModel
      };

      localStorage.setItem('agGridConfig', JSON.stringify(config));
      alert('Configuration saved successfully!');
    }
  }, [gridColumnApi, gridApi]);

  const clearConfig = useCallback(() => {
    localStorage.removeItem('agGridConfig');
    if (gridApi && gridColumnApi) {
      gridColumnApi.resetColumnState();
      gridApi.setFilterModel(null);
      gridApi.setSortModel(null);
    }
    alert('Configuration cleared successfully!');
  }, [gridApi, gridColumnApi]);

  const analyzeData = useCallback(() => {
    if (!gridApi) return;

    const data = gridApi.getModel().rowsToDisplay.map(row => row.data);

    // Perform ETL and analysis
    const transformedData = _.map(data, item => ({
      ...item,
      salaryCategory: item.salary < 50000 ? 'Low' : item.salary < 55000 ? 'Medium' : 'High'
    }));

    const averageSalary = _.meanBy(transformedData, 'salary');
    const salaryByDepartment = _.groupBy(transformedData, 'department');
    const averageSalaryByDepartment = _.mapValues(salaryByDepartment, dept => _.meanBy(dept, 'salary'));
    const employeesByAgeGroup = _.countBy(transformedData, item =>
      item.age < 30 ? '< 30' : item.age < 40 ? '30-39' : '40+'
    );

    setSummary({
      averageSalary,
      averageSalaryByDepartment,
      employeesByAgeGroup
    });

    // Update chart
    updateChart(averageSalaryByDepartment);
  }, [gridApi]);

  const updateChart = (data) => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Average Salary by Department',
          data: Object.values(data),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Average Salary ($)'
            }
          }
        }
      }
    });
  };

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: '1000px', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columns}
          rowData={rowData}
          onGridReady={onGridReady}
          enableSorting={true}
          enableFilter={true}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={saveConfig} style={{ marginRight: '10px' }}>Save Configuration</button>
        <button onClick={clearConfig} style={{ marginRight: '10px' }}>Clear Configuration</button>
        <button onClick={analyzeData}>Analyze Data</button>
      </div>
      {summary.averageSalary && (
        <div style={{ marginTop: '20px' }}>
          <h3>Data Analysis Results:</h3>
          <p>Average Salary: ${summary.averageSalary.toFixed(2)}</p>
          <h4>Average Salary by Department:</h4>
          <ul>
            {Object.entries(summary.averageSalaryByDepartment).map(([dept, avg]) => (
              <li key={dept}>{dept}: ${avg.toFixed(2)}</li>
            ))}
          </ul>
          <h4>Employees by Age Group:</h4>
          <ul>
            {Object.entries(summary.employeesByAgeGroup).map(([group, count]) => (
              <li key={group}>{group}: {count}</li>
            ))}
          </ul>
        </div>
      )}
      <canvas ref={chartRef} style={{ marginTop: '20px', maxWidth: '600px' }}></canvas>
    </div>
  );
};

export default AGGridWithLocalStorage;