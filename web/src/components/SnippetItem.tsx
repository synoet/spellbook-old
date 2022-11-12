import React from 'react';
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/outline";


interface SnippetItemProps {
  snippet: any;
}
const SnippetItem = ({ snippet }: SnippetItemProps): JSX.Element => {
  return (
    <li key={snippet.id} className="px-6 py-4 flex justify-between items-center">
      <div className='flex items-center space-x-4'>
        <DocumentTextIcon className="w-[20px] h-[20px] text-gray-300" />
        <p>{snippet.title}</p>
      </div>
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-3">
          {snippet.labels.map((label: any) => (
            <span key={label.id} className="inline-flex items-center rounded-full bg-purple-400 px-3 py-0.5 text-sm font-medium text-purple-800">
              {label.content}
            </span>
          ))}
        </div>
        <ClipboardDocumentIcon className="text-white w-[20px] h-[20px]" />
      </div>
    </li>
  )
}

export default SnippetItem;