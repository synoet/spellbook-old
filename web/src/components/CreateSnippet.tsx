import React, { useState } from "react";
import Modal from "./primitives/Modal";
import CodeEditor from "./primitives/CodeEditor";
import Select from "./primitives/Select";

import { trpc } from "../utils/trpc";

const languageOptions = [
  {
    id: "js",
    name: "Javascript",
  },
  {
    id: "ts",
    name: "Typescript",
  },
  {
    id: "py",
    name: "Python",
  },
];

const CreateSnippet = ({ open, setOpen, refetchSnippets }: any) => {
  const [content, setContent] = useState("");
  // TODO -- figure out language type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [language, setLanguage] = useState<any>(languageOptions[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [labels, setLabels] = useState("");
  const { mutate: createSnippet } = trpc.snippet.create.useMutation({
    onSuccess: async () => {
      refetchSnippets();
      setOpen(false);
    },
  });

  return (
    <Modal open={open} setOpen={setOpen} title={"Create Snippet"}>
      <div className="mt-8 flex flex-col space-y-3">
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="content"
              className="block w-full rounded-md border-gray-300 bg-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="this is a command"
            />
          </div>
        </div>

        <Select
          label="Choose Language"
          options={languageOptions}
          selected={language}
          setSelected={setLanguage}
        />

        <label className="block text-sm font-medium text-gray-700">
          Your Snippet
        </label>
        <CodeEditor content={content} setContent={setContent} />
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="content"
              className="block w-full rounded-md border-gray-300 bg-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="this is a description"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Labels
          </label>
          <div className="mt-1">
            <input
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              name="content"
              className="block w-full rounded-md border-gray-300 bg-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="javascript, react, jsx"
            />
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={() =>
              createSnippet({
                title: title,
                content: content,
                description: description,
                language: language.name,
                labels: labels.split(",").map((label: string) => label.trim()),
              })
            }
          >
            Create Snippet
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateSnippet;
