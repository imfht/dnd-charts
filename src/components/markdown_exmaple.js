import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

const DataNode = ({ data }) => (
  <div className="p-2 border rounded bg-blue-100 w-64">
    <strong>Data Node: {data.label}</strong>
    <textarea
      value={data.jsonData}
      onChange={(evt) => data.onChange(evt.target.value)}
      className="w-full h-24 mt-2 p-1 text-sm"
      placeholder="Enter JSON data"
    />
  </div>
);

const CodeNode = ({ data }) => (
  <div className="p-2 border rounded bg-green-100 w-64">
    <strong>Code Node: {data.label}</strong>
    <textarea
      value={data.code}
      onChange={(evt) => data.onChange(evt.target.value)}
      className="w-full h-24 mt-2 p-1 text-sm"
      placeholder="Enter JavaScript code"
    />
  </div>
);

const nodeTypes = {
  dataNode: DataNode,
  codeNode: CodeNode,
};

const initialNodes = [
  { id: '1', type: 'dataNode', position: { x: 250, y: 5 }, data: { label: 'Input Data', jsonData: '{"example": "data"}' } },
  { id: '2', type: 'codeNode', position: { x: 100, y: 100 }, data: { label: 'Transform', code: 'return input;' } },
  { id: '3', type: 'dataNode', position: { x: 250, y: 200 }, data: { label: 'Output Data', jsonData: '{}' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }];

const ETLFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('dataNode');
  const [executionResult, setExecutionResult] = useState('');

  const nodeRef = useRef();

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = () => {
    if (nodeName) {
      const newNode = {
        id: Date.now().toString(),
        type: nodeType,
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          label: nodeName,
          jsonData: nodeType === 'dataNode' ? '{}' : undefined,
          code: nodeType === 'codeNode' ? '// Your code here' : undefined,
          onChange: (value) => {
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === newNode.id) {
                  node.data = {
                    ...node.data,
                    [nodeType === 'dataNode' ? 'jsonData' : 'code']: value,
                  };
                }
                return node;
              })
            );
          },
        },
      };
      setNodes((nds) => nds.concat(newNode));
      setNodeName('');
    }
  };

  const executeETL = () => {
    let result = {};
    try {
      // Find the starting data node
      const startNode = nodes.find(node => node.type === 'dataNode' && !edges.some(edge => edge.target === node.id));
      if (!startNode) throw new Error('No starting data node found');

      result = JSON.parse(startNode.data.jsonData);

      // Find and execute code nodes in order
      const codeNodes = nodes.filter(node => node.type === 'codeNode');
      for (const codeNode of codeNodes) {
        const inputEdge = edges.find(edge => edge.target === codeNode.id);
        if (!inputEdge) continue;

        const input = result;
        const code = codeNode.data.code;
        // Execute the code
        const executionFunction = new Function('input', code);
        result = executionFunction(input);
      }

      // Find the ending data node and update it
      const endNode = nodes.find(node => node.type === 'dataNode' && !edges.some(edge => edge.source === node.id));
      if (endNode) {
        setNodes(nds => nds.map(node => {
          if (node.id === endNode.id) {
            node.data = { ...node.data, jsonData: JSON.stringify(result, null, 2) };
          }
          return node;
        }));
      }

      setExecutionResult('ETL执行成功');
    } catch (error) {
      setExecutionResult(`执行错误: ${error.message}`);
    }
  };

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        ref={nodeRef}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <div className="absolute top-0 left-0 p-4 bg-white">
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Node name"
          className="border p-2 mr-2"
        />
        <select
          value={nodeType}
          onChange={(e) => setNodeType(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="dataNode">Data Node</option>
          <option value="codeNode">Code Node</option>
        </select>
        <button onClick={addNode} className="bg-blue-500 text-white p-2 rounded mr-2">
          Add Node
        </button>
        <button onClick={executeETL} className="bg-green-500 text-white p-2 rounded">
          Execute ETL
        </button>
      </div>
      <div className="absolute bottom-0 left-0 p-4 bg-white">
        <strong>Execution Result:</strong> {executionResult}
      </div>
    </div>
  );
};

export default ETLFlow;