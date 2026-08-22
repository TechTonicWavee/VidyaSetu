'use client';

/**
 * LatexEditor — wraps Monaco Editor for LaTeX editing.
 *
 * Decision 3 (decision.md): Monaco gives us syntax highlighting,
 * line numbers, and an IDE feel instead of a plain <textarea>.
 * Decision 5: 'use client' is required because Monaco depends on
 * browser APIs and uses useState/useEffect internally.
 */

import { useRef } from 'react';
import Editor from '@monaco-editor/react';

interface LatexEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function LatexEditor({ value, onChange, height = '100%' }: LatexEditorProps) {
  const editorRef = useRef<unknown>(null);

  function handleEditorDidMount(editor: unknown) {
    editorRef.current = editor;
  }

  function handleChange(val: string | undefined) {
    onChange(val ?? '');
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-[var(--border)]" style={{ height }}>
      <Editor
        height={height}
        defaultLanguage="latex"
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
          minimap: { enabled: false },
          wordWrap: 'on',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
