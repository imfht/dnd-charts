import React from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

const exampleCode = `
function Greeting({ name }) {
  return (
    <div style={{ 
      backgroundColor: 'lightblue', 
      padding: '20px', 
      borderRadius: '8px' 
    }}>
      <h1>Hello, {name}!</h1>
      <p>Welcome to React Live!</p>
    </div>
  );
}
`;

export default function ReactLiveExample() {
  return (
    <LiveProvider code={exampleCode}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-2">Editor</h2>
          <LiveEditor className="rounded-md overflow-hidden" />
          <LiveError className="text-red-500 mt-2" />
        </div>
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-2">Preview</h2>
          <LivePreview className="border border-gray-300 rounded-md p-4" />
        </div>
      </div>
    </LiveProvider>
  );
}