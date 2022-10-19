import React, { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  const session = useSession();
  console.log(session);
  const [newCommand, setNewCommand] = useState<any>({
    content: "",
    description: "",
    labels: [],
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: commandData, refetch: refetchCommands } =
    trpc.command.getPublicCommands.useQuery({ query: searchQuery });

  const { mutate: createCommand } = trpc.command.createCommand.useMutation({
    onSuccess: async () => {
      setNewCommand({ content: "", description: "" });
      await refetchCommands();
    },
  });

  return (
    <div className="w-scren flex min-h-screen flex-col items-center bg-black">
      <div className="min-h-screen w-[1200px] flex-col items-center space-y-8 bg-black pt-12 pb-12">
        <Navbar />
        <div className="flex w-full flex-col items-center space-y-4 rounded-md bg-neutral-900 pr-4 pl-4 pt-8 pb-8">
          <div className="w-full">
            <h1 className="text-lg text-white"> Create Command </h1>
          </div>
          <div className="h-[5px] w-full border-b-2 border-neutral-700"></div>
          <input
            className="w-full rounded-md bg-zinc-800 p-2 text-white"
            placeholder="content"
            value={newCommand.content}
            onChange={(e) =>
              setNewCommand({ ...newCommand, content: e.target.value })
            }
          />
          <input
            className="w-full rounded-md bg-zinc-800 p-2 text-white"
            placeholder="description"
            value={newCommand.description}
            onChange={(e) =>
              setNewCommand({ ...newCommand, description: e.target.value })
            }
          />
          <input
            className="w-full rounded-md bg-zinc-800 p-2 text-white"
            placeholder="labels"
            value={
              newCommand.labels
                ? newCommand.labels?.length > 0
                  ? newCommand.labels.join(" ")
                  : newCommand.labels[0]
                : ""
            }
            onChange={(e) =>
              setNewCommand({
                ...newCommand,
                labels: e.target.value.split(" "),
              })
            }
          />
          <button
            className="w-full rounded-md bg-indigo-500 p-2 text-white hover:bg-indigo-600"
            onClick={() => createCommand(newCommand)}
          >
            Create Command
          </button>
        </div>
        <div className="w-full rounded-md bg-neutral-900">
          <input
            className="w-full rounded-md bg-neutral-900 p-4 text-white"
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
              className="flex cursor-pointer items-center justify-between space-x-2 rounded-md border border-gray-800 bg-neutral-900 p-4 text-white hover:border-indigo-500 hover:bg-neutral-800/70"
              key={command.content}
            >
              <div>
                {command.content.includes(searchQuery) && searchQuery !== "" ? (
                  <h1>
                    {command.content.split(searchQuery)[0]}{" "}
                    <span className="font-bold text-indigo-300">
                      {searchQuery}
                    </span>
                    {command.content.split(searchQuery)[1]}
                  </h1>
                ) : (
                  <h1>{command.content}</h1>
                )}
                <p className="text-gray-600">{command.description}</p>
              </div>
              <div className="flex items-center space-x-2 pr-8">
                {command.labels.map((label: any) => (
                  <p
                    key={label.content}
                    className="rounded-full bg-indigo-600 px-4 py-1 text-white"
                  >
                    {label.content}
                  </p>
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
