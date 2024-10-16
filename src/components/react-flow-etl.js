import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node components
const DataNode = ({ data }) => {
  return (
    <div className="data-node">
      <h3>{data.label}</h3>
      <textarea
        value={data.content}
        onChange={(e) => data.onChange(e.target.value)}
        placeholder="Enter JSON data..."
      />
    </div>
  );
};

const CodeNode = ({ data }) => {
  return (
    <div className="code-node">
      <h3>{data.label}</h3>
      <textarea
        value={data.content}
        onChange={(e) => data.onChange(e.target.value)}
        placeholder="Enter ETL code..."
      />
    </div>
  );
};

const nodeTypes = {
  dataNode: DataNode,
  codeNode: CodeNode,
};

// Alert component
const Alert = ({ message }) => {
  return (
    <div className="alert">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="alert-icon">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
      <span>{message}</span>
    </div>
  );
};

// Main component
const VisualEtlFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState('');

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      id: `e${edges.length + 1}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#6366f1' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#6366f1',
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [edges, setEdges]);

  const addDataNode = () => {
    const newNode = {
      id: `data-${nodes.length + 1}`,
      type: 'dataNode',
      position: { x: 250, y: 50 },
      data: {
        label: `Data ${nodes.length + 1}`,
        content: '',
        onChange: (newContent) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === `data-${nodes.length + 1}`
                ? { ...node, data: { ...node.data, content: newContent } }
                : node
            )
          );
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addCodeNode = () => {
    const newNode = {
      id: `code-${nodes.length + 1}`,
      type: 'codeNode',
      position: { x: 250, y: 200 },
      data: {
        label: `ETL ${nodes.length + 1}`,
        content: '',
        onChange: (newContent) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === `code-${nodes.length + 1}`
                ? { ...node, data: { ...node.data, content: newContent } }
                : node
            )
          );
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const processFlow = () => {
    setError('');
    try {
      const sortedNodes = nodes.sort((a, b) => {
        const aIndex = edges.findIndex(e => e.target === a.id);
        const bIndex = edges.findIndex(e => e.target === b.id);
        return aIndex - bIndex;
      });

      let result = null;
      for (const node of sortedNodes) {
        if (node.type === 'dataNode') {
          result = JSON.parse(node.data.content);
        } else if (node.type === 'codeNode') {
          const transformFunction = new Function('data', node.data.content);
          result = transformFunction(result);
        }
      }

      const outputNode = {
        id: 'output',
        type: 'dataNode',
        position: { x: 250, y: 350 },
        data: {
          label: 'Output',
          content: JSON.stringify(result, null, 2),
          onChange: () => {},
        },
      };

      setNodes((nds) => [...nds.filter(n => n.id !== 'output'), outputNode]);
    } catch (err) {
      setError(err.toString());
    }
  };

  return (
    <div className="visual-etl-flow">
      <div className="flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          edgesFocusable={true}
          edgesUpdatable={true}
          elementsSelectable={true}
          selectNodesOnDrag={false}
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      <div className="controls">
        <button onClick={addDataNode}>Add Data Node</button>
        <button onClick={addCodeNode}>Add Code Node</button>
        <button onClick={processFlow}>Process Flow</button>
      </div>
      {error && <Alert message={error} />}
    </div>
  );
};

// Styles
const styles = `
  .visual-etl-flow {
    width: 100%;
    height: 100vh;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  .flow-container {
    width: 100%;
    height: 100%;
    background-color: #f0f4f8;
  }

  .controls {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 5;
    display: flex;
    gap: 10px;
  }

  .controls button {
    padding: 8px 16px;
    background-color: #6366f1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }

  .controls button:hover {
    background-color: #4f46e5;
  }

  .data-node, .code-node {
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 200px;
  }

  .data-node {
    background-color: #e0f2fe;
    border: 2px solid #38bdf8;
  }

  .code-node {
    background-color: #fef3c7;
    border: 2px solid #fbbf24;
  }

  .data-node h3, .code-node h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
  }

  .data-node textarea, .code-node textarea {
    width: 100%;
    height: 100px;
    resize: vertical;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 8px;
    font-size: 14px;
  }

  .alert {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    background-color: #fee2e2;
    color: #ef4444;
    padding: 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    border: 1px solid #ef4444;
  }

  .alert-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
`;

// Render component with styles
const VisualEtlFlowWithStyles = () => (
  <>
    <style>{styles}</style>
    <VisualEtlFlow />
  </>
);

export default VisualEtlFlowWithStyles;