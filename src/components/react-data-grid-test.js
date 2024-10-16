import React, { useState, useMemo } from 'react';
import DataGrid, { SelectColumn, textEditor } from 'react-data-grid';

const columns = [
  SelectColumn,
  { key: 'id', name: 'ID', width: 60, frozen: true },
  { key: 'title', name: 'Title', width: 150, editor: textEditor, editable: true },
  { key: 'count', name: 'Count', width: 80, editor: textEditor, editable: true }
];

const initialRows = [
  { id: 1, title: 'Item 1', count: 20 },
  { id: 2, title: 'Item 2', count: 40 },
  { id: 3, title: 'Item 3', count: 60 },
  // Add more rows here for pagination demo
];

const DataGridExample = () => {
  const [rows, setRows] = useState(initialRows);
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      return Object.keys(filters).every(columnKey => {
        const value = row[columnKey];
        const filterValue = filters[columnKey];
        return value.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [rows, filters]);

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, page, pageSize]);

  const onRowsChange = (newRows, { indexes, column }) => {
    const row = newRows[indexes[0]];
    if (column.key === 'count') {
      row.count = parseInt(row.count, 10) || 0;
    }
    setRows(newRows);
  };

  return (
    <div className="h-[500px] w-full flex flex-col">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by title"
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          className="p-2 border rounded"
        />
      </div>
      <DataGrid
        columns={columns}
        rows={paginatedRows}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        onRowsChange={onRowsChange}
        className="rdg-light flex-grow"
        style={{
          height: '100%',
          '--rdg-header-background-color': '#f3f4f6',
          '--rdg-row-hover-background-color': '#e5e7eb',
        }}
      />
      <div className="mt-4 flex justify-between items-center">
        <span>Total: {filteredRows.length} rows</span>
        <div>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>Page {page} of {Math.ceil(filteredRows.length / pageSize)}</span>
          <button
            onClick={() => setPage(p => Math.min(Math.ceil(filteredRows.length / pageSize), p + 1))}
            disabled={page === Math.ceil(filteredRows.length / pageSize)}
            className="px-4 py-2 bg-blue-500 text-white rounded ml-2 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataGridExample;