import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ language, value, onChange, height = '300px' }) => {
  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        automaticLayout: true,
      }}
    />
  );
};

export default MonacoEditor;