import React, { useState, useEffect } from "react";

import type { NextPage } from "next";
import Layout from '../components/Layout';
import {trpc} from '../utils/trpc';
import {useSession} from 'next-auth/react';

import CommandItem from '../components/CommandItem';

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

import CreateCommand from '../components/CreateCommand';
import CreateSnippet from '../components/CreateSnippet';

const Home: NextPage = () => {
  const {data: session} = useSession();

  const {data: commands, refetch: refetchCommands} = trpc.command.getPublicCommands.useQuery({});
  const [createCommandOpen, setCreateCommandOpen] = useState(false);
  const [createSnippetOpen, setCreateSnippetOpen] = useState(false);



  return (
    <Layout>
      <div className="w-[1200px] min-h-screen p-4 rounded-md flex flex-col space-y-4">

        <h1 className="font-bold">Welcome Back, <span className="text-indigo-400">{session?.user.username}</span></h1>
        <CreateCommand open={createCommandOpen} setOpen={setCreateCommandOpen} refetchCommands={() => refetchCommands()}/>
        <CreateSnippet open={createSnippetOpen} setOpen={setCreateSnippetOpen}/>

        <div className="w-full flex items-center justify-between">
          <h1 className="font-bold text-2xl">
           Commands 
          </h1>
          <div className="flex items-center space-x-6">
            <ArrowPathIcon onClick={() => refetchCommands()} className="text-gray-300 hover:text-gray-100 cursor-pointer w-[25px] h-[25px]"/>
            <button  onClick={() => setCreateCommandOpen(true)} className="flex items-center space-x-1 text-gray-300 hover:text-gray-100">
              <PlusCircleIcon className="w-[25px] h-[25px]" />
              <p>
                Add Command
              </p>
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-gray-300/10 bg-gray-900/50">
          <ul role="list" className="divide-y divide-gray-800">
            {commands && commands.map((command) => (
              <CommandItem command={command} key={command.id}/>
            ))}
          </ul>
        </div>
        <div className="w-full flex items-center justify-between">
          <h1 className="font-bold text-2xl">
           Snippets 
          </h1>
          <div className="flex items-center space-x-6">
            <ArrowPathIcon onClick={() => refetchCommands()} className="text-gray-300 hover:text-gray-100 cursor-pointer w-[25px] h-[25px]"/>
            <button  onClick={() => setCreateSnippetOpen(true)} className="flex items-center space-x-1 text-gray-300 hover:text-gray-100">
              <PlusCircleIcon className="w-[25px] h-[25px]" />
              <p>
                Add Snippet 
              </p>
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border border-gray-300/10 bg-gray-900/50">
          <ul role="list" className="divide-y divide-gray-800">
            {commands && commands.map((command) => (
              <CommandItem command={command} key={command.id}/>
            ))}
          </ul>
        </div>
      </div>

    </Layout>
  );
};

export default Home;
