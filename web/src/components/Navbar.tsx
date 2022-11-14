import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import NextLink from "next/link";
import clsx from "clsx";

import { useRouter } from "next/router";

const navConfig = [
  {
    name: "Overview",
    href: "/",
  },
  {
    name: "Recipes",
    href: "/recipes",
  },
  {
    name: "Commands",
    href: "/commands",
  },
  {
    name: "Snippets",
    href: "/snippets",
  },
  {
    name: "Secrets",
    href: "/secrets",
  },
];

const Navbar: React.FC = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const path = router.pathname;

  return (
    <div className="flex flex w-full flex-col items-center justify-between space-y-6 pb-4 pt-4 text-white">
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src={"/assets/icon.png"}
            height={35}
            width={33}
            alt="Spellbook Logo"
          />
          <p className="pl-2 font-bold text-gray-400">/</p>

          <p className="text-gray-400">Personal</p>
        </div>
        {session && (
          <div className="flex h-full items-center space-x-2">
            <h1 className="h-full">{session.user.username}</h1>
            <div className="flex items-center">
              <Image
                src={session?.user.image}
                alt="Profile Picture"
                layout="fixed"
                height={30}
                width={30}
                className="h-[30px] w-[30px] rounded-full"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex w-full flex-row items-center border-b border-gray-800">
        {navConfig.map((item, index) => (
          <div
            className={clsx({
              "border-b border-indigo-500": path === item.href,
              "border-b border-gray-900/50 hover:border-b hover:border-gray-500":
                path !== item.href,
              "flex w-[100px] cursor-pointer items-center justify-center px-3 py-3":
                true,
            })}
            key={index}
          >
            <NextLink href={item.href}>{item.name}</NextLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
