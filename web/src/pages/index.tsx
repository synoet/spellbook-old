import React, {useState, useEffect} from 'react';
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [newCommand, setNewCommand] = useState<any>({content: "", description: ""});
  const [searchQuery, setSearchQuery] = useState<string>("")
  const {data: commandData, refetch: refetchCommands} = trpc.command.getCommands.useQuery({query: searchQuery});

  const {mutate: createCommand} = trpc.command.createCommand.useMutation({
    onSuccess: async () => {
      setNewCommand({content: "", description: ""});
      await refetchCommands();
    }
  });

  const {mutate: deleteCommand} = trpc.command.deleteCommand.useMutation({
    onSuccess: async () => {
      await refetchCommands();
    }
  });

  return (
    <div className="w-scren min-h-screen bg-black flex flex-col items-center">
      <div className="w-[1200px] min-h-screen bg-black flex-col items-center pt-12 pb-12 space-y-8">
        <div className="p-4 bg-neutral-900 rounded-md flex flex-col items-center w-full space-y-2">
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
        <div className="flex flex-col space-y-4 ">
          {commandData?.map((command) => (
            <div 
              className="rounded-md bg-neutral-900 p-4 flex items-center justify-between space-x-2 text-white"
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
              <div>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => deleteCommand({id: command.id})}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
