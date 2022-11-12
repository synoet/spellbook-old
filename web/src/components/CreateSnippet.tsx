import React, { useState } from "react";
import Modal from "./primitives/Modal";
import CodeEditor from "./primitives/CodeEditor";
import Select from "./primitives/Select";

import { highlight, languages } from "prismjs/components/prism-core";

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
  const [language, setLanguage] = useState<any>(languageOptions[0]);

  return (
    <Modal open={open} setOpen={setOpen} title={"Create Snippet"}>
      <div className="mt-8 flex flex-col space-y-3">
        <Select
          label="Choose Language"
          options={languageOptions}
          selected={language}
          setSelected={setLanguage}
        />

        <CodeEditor content={content} setContent={setContent} />
      </div>
    </Modal>
  );
};

export default CreateSnippet;
