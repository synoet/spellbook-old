import React, { useMemo } from "react";
import Modal from "../components/primitives/Modal";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import cuid from "cuid";

import { trpc } from "../utils/trpc";
import {Snippet, Command} from '@prisma/client'


interface ShareProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  snippet?: Snippet
  command?: Command
}

const Share = ({ open, setOpen, onCopy, snippet}: ShareProps ): JSX.Element => {

  const { mutate: createLink } = trpc.link.create.useMutation();


  const handleCopyLink = (linkId: string) => {
    createLink({
      linkId: linkId,
      content: snippet?.content || "None",
      title: snippet?.title || "Untitled",
      type: "snippet",
    });
  };

  const linkId = useMemo(() => {
    return cuid();
  }, []);

  return (
    <Modal title={"Share"} open={open} setOpen={setOpen}>
      <div className="mt-8 flex flex-col space-y-4 pb-12">
        <div className="flex flex-col space-y-4">
          <p className="flex flex-col space-y-4 text-lg text-gray-400">
            Share with another user:
          </p>
          <div>
            <div className="mt-1">
              <input
                type="text"
                name="content"
                className="block w-full rounded-md border-gray-300 bg-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="@peenz"
              />
            </div>
          </div>
          <button
            type="button"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <EnvelopeIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Invite
          </button>
        </div>
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-2 text-sm text-gray-500"> or </span>
          </div>
        </div>
        <p className="text-lg text-gray-400">Share an ephemeral link:</p>
        <form className="mt-5 flex w-full">
          <div className="w-full">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              disabled={true}
              value={`http://localhost:3000/link/ephemeral/${linkId}`}
              className="block w-full rounded-md border-gray-300 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <button
            onClick={() => handleCopyLink(linkId)}
            className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Copy
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default Share;
