import React, {useState, useEffect} from 'react';


const CreateComponent = () => {
  return (
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
  )
}