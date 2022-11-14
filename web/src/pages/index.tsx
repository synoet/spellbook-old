import React, { useState, useEffect } from "react";

import type { NextPage } from "next";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

import CommandItem from "../components/CommandItem";
import SnippetItem from "../components/SnippetItem";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

import CreateCommand from "../components/CreateCommand";
import CreateSnippet from "../components/CreateSnippet";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const { data: commands, refetch: refetchCommands } =
    trpc.command.get.useQuery({});
  const { data: snippets, refetch: refetchSnippets } =
    trpc.snippet.get.useQuery({});

  const [createCommandOpen, setCreateCommandOpen] = useState(false);
  const [createSnippetOpen, setCreateSnippetOpen] = useState(false);

  return (
    <Layout>
      <h1 className="font-bold">
        Welcome Back,{" "}
        <span className="text-indigo-400">{session?.user.username}</span>
      </h1>
      <CreateCommand
        open={createCommandOpen}
        setOpen={setCreateCommandOpen}
        refetchCommands={() => refetchCommands()}
      />
      <CreateSnippet
        open={createSnippetOpen}
        setOpen={setCreateSnippetOpen}
        refetchSnippets={() => refetchSnippets()}
      />

      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Commands</h1>
        <div className="flex items-center space-x-6">
          <ArrowPathIcon
            onClick={() => refetchCommands()}
            className="h-[25px] w-[25px] cursor-pointer text-gray-300 hover:text-gray-100"
          />
          <button
            onClick={() => setCreateCommandOpen(true)}
            className="flex items-center space-x-1 text-gray-300 hover:text-gray-100"
          >
            <PlusCircleIcon className="h-[25px] w-[25px]" />
            <p>Add Command</p>
          </button>
        </div>
      </div>
      <ul role="list" className="space-y-4">
        {commands &&
          commands.map((command) => (
            <CommandItem command={command} key={command.id} />
          ))}
      </ul>
      <br />
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Snippets</h1>
        <div className="flex items-center space-x-6">
          <ArrowPathIcon
            onClick={() => refetchCommands()}
            className="h-[25px] w-[25px] cursor-pointer text-gray-300 hover:text-gray-100"
          />
          <button
            onClick={() => setCreateSnippetOpen(true)}
            className="flex items-center space-x-1 text-gray-300 hover:text-gray-100"
          >
            <PlusCircleIcon className="h-[25px] w-[25px]" />
            <p>Add Snippet</p>
          </button>
        </div>
      </div>
      <ul role="list" className="space-y-4">
        {snippets &&
          snippets.map((snippet) => (
            <SnippetItem snippet={snippet} key={snippet.id} />
          ))}
      </ul>
    </Layout>
  );
};

export default Home;
