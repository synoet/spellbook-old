import React from "react";
import {useSession} from "next-auth/react";
import Image from "next/image";

const Navbar: React.FC = () => {
  const {data: session} = useSession();

  return (
    <div className="flex w-full flex flex-col items-center justify-between text-white border-b border-gray-800 pb-4 pt-4">
      <div className="flex flex-row items-center justify-between w-full">
        <h1 className="text-xl font-semibold text-white">
          Spellbook
        </h1>
        {session && (
          <div className="flex items-center h-full space-x-2">
            <h1 className="h-full">{session.user.username}</h1>
            <div className="h-full">
              <img
                src={session?.user.image}
                alt="Profile Picture"
                className="rounded-full w-[30px] h-[30px]"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;
