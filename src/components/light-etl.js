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

const InitialNode = ({ data }) => (
  <div className="p-2 border-2 border-yellow-500 rounded bg-yellow-100 w-40">
    <strong>{data.label}</strong>
  </div>
);

const DataNode = ({ data }) => (
  <div className="p-2 border-2 border-blue-500 rounded bg-blue-100 w-64">
    <strong>{data.label}</strong>
    <textarea
      value={data.jsonData}
      onChange={(evt) => data.onChange(evt.target.value)}
      className="w-full h-24 mt-2 p-1 text-sm border rounded"
      placeholder="Enter JSON data"
    />
  </div>
);

const CodeNode = ({ data }) => (
  <div className="p-2 border-2 border-green-500 rounded bg-green-100 w-64">
    <strong>{data.label}</strong>
    <textarea
      value={data.code}
      onChange={(evt) => data.onChange(evt.target.value)}
      className="w-full h-24 mt-2 p-1 text-sm border rounded"
      placeholder="Enter JavaScript code"
    />
  </div>
);

const nodeTypes = {
  initialNode: InitialNode,
  dataNode: DataNode,
  codeNode: CodeNode,
};

const initialNodes = [
  { id: 'initial', type: 'initialNode', position: { x: 250, y: 5 }, data: { label: 'Initial Node: Start' } },
  { id: '1', type: 'dataNode', position: { x: 100, y: 100 }, data: { label: 'Data Node: Input Data', jsonData: '{"example": "data"}' } },
  { id: '2', type: 'codeNode', position: { x: 300, y: 100 }, data: { label: 'Code Node: Transform', code: 'return input;' } },
  { id: '3', type: 'dataNode', position: { x: 200, y: 200 }, data: { label: 'Data Node: Output Data', jsonData: '{}' } },
];

const initialEdges = [
  { id: 'e-initial-1', source: 'initial', target: '1', animated: true, style: { stroke: '#ffab00' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ffab00' } },
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#0041d0' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#0041d0' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#00a400' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00a400' } },
];

const ETLFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('dataNode');

  const onConnect = useCallback((params) => {
    const edgeType = params.sourceHandle ? params.sourceHandle : 'default';
    const newEdge = {
      ...params,
      animated: true,
      style: { stroke: edgeType === 'code' ? '#00a400' : '#0041d0' },
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeType === 'code' ? '#00a400' : '#0041d0' }
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const addNode = () => {
    if (nodeName) {
      const newNode = {
        id: Date.now().toString(),
        type: nodeType,
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          label: `${nodeType === 'dataNode' ? 'Data' : 'Code'} Node: ${nodeName}`,
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

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      <div className="absolute top-0 left-0 p-4 bg-white rounded-br-lg shadow-md">
        <input
          type="text"
          value={nodeName}
          onChange={(e) => setNodeName(e.target.value)}
          placeholder="Node name"
          className="border p-2 mr-2 rounded"
        />
        <select
          value={nodeType}
          onChange={(e) => setNodeType(e.target.value)}
          className="border p-2 mr-2 rounded"
        >
          <option value="dataNode">Data Node</option>
          <option value="codeNode">Code Node</option>
        </select>
        <button onClick={addNode} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Add Node
        </button>
      </div>
    </div>
  );
};

export default ETLFlow;