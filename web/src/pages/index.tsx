import React, {useState, useEffect} from 'react';
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

import Navbar from '../components/Navbar'

const Home: NextPage = () => {
  const [newCommand, setNewCommand] = useState<any>({
    content: "",
    description: "",
    labels: []
  });
  const [searchQuery, setSearchQuery] = useState<string>("")
  const {data: commandData, refetch: refetchCommands} = trpc.command.getCommands.useQuery({query: searchQuery});

  const {mutate: createCommand} = trpc.command.createCommand.useMutation({
    onSuccess: async () => {
      setNewCommand({content: "", description: ""});
      await refetchCommands();
    }
  });

  return (
    <div className="w-scren min-h-screen bg-black flex flex-col items-center">
      <div className="w-[1200px] min-h-screen bg-black flex-col items-center pt-12 pb-12 space-y-8">
        <Navbar />
        <div className="pr-4 pl-4 pt-8 pb-8 bg-neutral-900 rounded-md flex flex-col items-center w-full space-y-4">
          <div className="w-full">
            <h1 className="text-white text-lg"> Create Command </h1>
          </div>
          <div className="h-[5px] w-full border-b-2 border-neutral-700"></div>
          <input
            className="w-full bg-zinc-800 p-2 rounded-md text-white"
            placeholder="content"
            value={newCommand.content}
            onChange={(e) => setNewCommand({...newCommand, content: e.target.value})}
          />
          <input
            className="w-full bg-zinc-800 p-2 rounded-md text-white"
            placeholder="description"
            value={newCommand.description}
            onChange={(e) => setNewCommand({...newCommand, description: e.target.value})}
          />
          <input
            className="w-full bg-zinc-800 p-2 rounded-md text-white"
            placeholder="labels"
            value={newCommand.labels ? newCommand.labels?.length > 0 ? newCommand.labels.join(" ") : newCommand.labels[0]: ""}
            onChange={(e) => setNewCommand({...newCommand, labels: e.target.value.split(" ")})}
          />
          <button
            className="w-full bg-indigo-500 rounded-md p-2 text-white hover:bg-indigo-600"
            onClick={() => createCommand(newCommand)}
          >
            Create Command
          </button>
        </div>
        <div className="bg-neutral-900 rounded-md w-full">
          <input 
            className="bg-neutral-900 p-4 text-white w-full rounded-md"
            placeholder="search for commands"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              refetchCommands();
            }}
          />
        </div>
        <div className="flex flex-col space-y-4">
          {commandData?.map((command: any) => (
            <div 
              className="rounded-md bg-neutral-900 p-4 flex items-center justify-between space-x-2 text-white border border-gray-800 hover:bg-neutral-800/70 cursor-pointer hover:border-indigo-500"
              key={command.content}
            >
              <div>
                {(command.content.includes(searchQuery) && searchQuery !== "") ? (
                  <h1>{command.content.split(searchQuery)[0]} <span className="text-indigo-300 font-bold">{searchQuery}</span>{command.content.split(searchQuery)[1]}</h1>
                ): (
                <h1>{command.content}</h1>
                )}
                <p className="text-gray-600">{command.description}</p>
              </div>
              <div className="flex items-center space-x-2 pr-8">
                {command.labels.map((label: any) => (
                  <p key={label.content} className="text-white bg-indigo-600 rounded-full px-4 py-1">{label.content}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
