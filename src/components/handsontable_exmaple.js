import React, { useRef, useEffect, useState } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

// Register all Handsontable modules
registerAllModules();

const initialData = [
  { id: 1, title: 'Item 1', count: 20, category: 'A' },
  { id: 2, title: 'Item 2', count: 40, category: 'B' },
  { id: 3, title: 'Item 3', count: 60, category: 'A' },
  { id: 4, title: 'Item 4', count: 80, category: 'C' },
  { id: 5, title: 'Item 5', count: 100, category: 'B' },
];

const HandsontableExample = () => {
  const hotRef = useRef(null);
  const [data, setData] = useState(initialData);

  const columns = [
    { data: 'id', type: 'numeric', width: 60, readOnly: true },
    { data: 'title', type: 'text', width: 150 },
    { data: 'count', type: 'numeric', width: 80 },
    { data: 'category', type: 'dropdown', source: ['A', 'B', 'C'] }
  ];

  const handleAfterChange = (changes) => {
    if (changes) {
      const [row, prop, oldValue, newValue] = changes[0];
      console.log(`Cell changed: (${row}, ${prop}) from "${oldValue}" to "${newValue}"`);
    }
  };

  useEffect(() => {
    // You can access the Handsontable instance here if needed
    const hot = hotRef.current.hotInstance;
    // For example, you could add a custom button to add a new row
    // hot.alter('insert_row');
  }, []);

  return (
    <div className="w-full h-[500px] flex flex-col">
      <HotTable
        ref={hotRef}
        data={data}
        columns={columns}
        colHeaders={['ID', 'Title', 'Count', 'Category']}
        rowHeaders={true}
        width="100%"
        height="100%"
        licenseKey="non-commercial-and-evaluation"
        afterChange={handleAfterChange}
        columnSorting={true}
        filters={true}
        dropdownMenu={true}
        contextMenu={true}
        multiColumnSorting={true}
        manualColumnResize={true}
        manualRowResize={true}
      />
      <div className="mt-4">
        <button
          onClick={() => {
            const hot = hotRef.current.hotInstance;
            hot.alter('insert_row');
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Row
        </button>
      </div>
    </div>
  );
};

export default HandsontableExample;