import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('# Hello\n\nType some *markdown* here!\n\n- List item 1\n- List item 2\n\n1. Numbered item 1\n2. Numbered item 2\n\n[Link](https://example.com)\n\n```\ncode block\n```');

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Markdown Editor</h1>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Input</h2>
          <textarea
            className="flex-grow w-full p-2 border border-gray-300 rounded resize-none"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Output</h2>
          <div className="flex-grow border border-gray-300 rounded p-4 markdown-body overflow-auto">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

// 添加自定义样式
const styles = `
  .markdown-body h1 {
    font-size: 2em;
    margin-bottom: 0.5em;
  }
  .markdown-body h2 {
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }
  .markdown-body p {
    margin-bottom: 1em;
  }
  .markdown-body ul, .markdown-body ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }
  .markdown-body li {
    margin-bottom: 0.5em;
  }
  .markdown-body a {
    color: #3182ce;
    text-decoration: underline;
  }
  .markdown-body code {
    background-color: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
  .markdown-body pre {
    background-color: #f0f0f0;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
  }
`;

const MarkdownEditorWithStyles = () => (
  <>
    <style>{styles}</style>
    <MarkdownEditor />
  </>
);

export default MarkdownEditorWithStyles;