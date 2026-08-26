'use client';

import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  minHeight = '120px',
  label,
  helperText,
  required = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize external value with contentEditable div when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter link URL (e.g. https://tapa.co):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
          {label} {required && <span style={{ color: '#DE1B59' }}>*</span>}
        </label>
      )}

      <div style={{ border: '1px solid #D1D5DB', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
        {/* FORMATTING TOOLBAR */}
        <div style={{ background: '#FAFAFA', borderBottom: '1px solid #E5E7EB', padding: '6px 10px', display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            title="Bold"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', minWidth: '28px' }}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            title="Italic"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontStyle: 'italic', cursor: 'pointer', minWidth: '28px' }}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            title="Underline"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', minWidth: '28px' }}
          >
            U
          </button>

          <div style={{ width: '1px', height: '16px', background: '#D1D5DB', margin: '0 4px' }} />

          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            title="Heading 2"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            title="Heading 3"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<p>')}
            title="Paragraph"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
          >
            P
          </button>

          <div style={{ width: '1px', height: '16px', background: '#D1D5DB', margin: '0 4px' }} />

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bullet List"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered List"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            title="Blockquote"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
          >
            &quot; Quote
          </button>

          <div style={{ width: '1px', height: '16px', background: '#D1D5DB', margin: '0 4px' }} />

          <button
            type="button"
            onClick={handleAddLink}
            title="Insert Link"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
          >
            🔗 Link
          </button>
          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            title="Clear Formatting"
            style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', color: '#6B7280', cursor: 'pointer' }}
          >
            ✕ Clear
          </button>
        </div>

        {/* EDITABLE CONTAINER */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          data-placeholder={placeholder}
          style={{
            minHeight,
            padding: '12px 14px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#111827',
            outline: 'none',
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        />
      </div>

      {helperText && (
        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
          {helperText}
        </div>
      )}
    </div>
  );
}
