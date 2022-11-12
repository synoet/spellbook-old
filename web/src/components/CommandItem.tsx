import React from "react";
import { Command } from "@prisma/client";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { CommandLineIcon } from "@heroicons/react/24/outline";

interface CommandItemProps {
  command: any;
}
const CommandItem = ({ command }: CommandItemProps): JSX.Element => {
  return (
    <li
      key={command.id}
      className="flex items-center justify-between rounded-md border border-gray-300/10 bg-gray-900/50 px-6 py-4"
    >
      <div className="flex items-center space-x-4">
        <CommandLineIcon className="h-[20px] w-[20px] text-gray-300" />
        <p>{command.content}</p>
      </div>
      <div className="flex items-center space-x-5">
        <div className="flex items-center space-x-3">
          {command.labels.map((label: any) => (
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
  );
};

export default CommandItem;
