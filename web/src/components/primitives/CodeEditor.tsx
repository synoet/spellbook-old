import React from 'react';

import {EditorState} from '@codemirror/state'
import {EditorView, keymap} from '@codemirror/view'
import {defaultKeymap} from '@codemirror/commands'
import { githubDark } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'



interface CodeEditorProps {
  content: string;
  setContent: () => any;
  language: any;
}

const CodeEditor = ({ content, setContent, language }: CodeEditorProps): JSX.Element => {
  return (
    <CodeMirror
      value={content}
      onChange={setContent}
      theme={githubDark}
      extensions={[javascript({ jsx: true})]}
      placeholder="Write your code here"
      height="400px"
      editable={true}
      style={{
        minHeight: '300px',
        borderRadius: '10px',
      }}
    />
  )
}

export default CodeEditor;