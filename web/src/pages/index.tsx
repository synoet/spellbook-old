import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import useSession from "../hooks/useSession";

const Home: NextPage = () => {
  const { session, isSessionLoading, status } = useSession();

  useEffect(() => {
    // simple redirect if session is unathenticated
    if (status === "unauthenticated" && !isSessionLoading) {
      window.location.href = "http://localhost:3000/auth/signin";
    }
  }, [session, isSessionLoading, status]);

  return (
    <div className="bg-black">
      <Head>
        <title>Spellbook</title>
        <meta name="description" content="Developer Tooling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center bg-black p-4"></main>
    </div>
  );
};

export default Home;
