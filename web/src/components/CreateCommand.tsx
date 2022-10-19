import React, { useState, useEffect } from "react";

const CreateComponent = () => {
  return (
    <div className="flex w-full flex-col items-center space-y-2 rounded-md bg-neutral-900 p-4">
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
      <button
        className="w-full rounded-md bg-indigo-500 p-2 text-white hover:bg-indigo-600"
        onClick={() => createCommand(newCommand)}
      >
        Create Command
      </button>
    </div>
  );
};
