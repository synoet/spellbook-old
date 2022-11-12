import React from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import NextLink from "next/link";

interface SnippetItemProps {
  snippet: any;
}
const SnippetItem = ({ snippet }: SnippetItemProps): JSX.Element => {
  return (
    <NextLink href={`/snippet/${snippet.id}`}>
      <li
        key={snippet.id}
        className="flex items-center justify-between rounded-md border border-gray-300/10 bg-gray-900/50 px-6 py-4 hover:bg-gray-900/80 cursor-pointer"
      >
        <div className="flex items-center space-x-4">
          <DocumentTextIcon className="h-[20px] w-[20px] text-gray-300" />
          <p>{snippet.title}</p>
        </div>
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-3">
            {snippet.labels.map((label: any) => (
              <span
                key={label.id}
                className="inline-flex items-center rounded-full bg-purple-400 px-3 py-0.5 text-sm font-medium text-purple-800"
              >
                {label.content}
              </span>
            ))}
          </div>
          <ClipboardDocumentIcon className="h-[20px] w-[20px] text-white" />
        </div>
      </li>
    </NextLink>
  );
};

export default SnippetItem;
