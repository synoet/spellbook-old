import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

import Layout from "../../components/Layout";
import PageHeader from "../../components/primitives/PageHeader";
import CodeEditor from "../../components/primitives/CodeEditor";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import { useSession } from "next-auth/react";

const Snippet: NextPage = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: snippet, isLoading } = trpc.snippet.getOne.useQuery(
    { id: id },
    { enabled: !!id }
  );

  const { data: session } = useSession();

  return (
    <Layout>
      <div className="flex min-h-screen w-[1200px] flex-col space-y-4 rounded-md p-4">
        {snippet && (
          <PageHeader
            title={snippet?.title}
            backlinks={[
              {
                href: "/",
                name: session?.user?.username || "",
              },
              {
                href: "/snippets",
                name: "Snippets",
              },
              {
                href: `/snippet/${snippet?.id}`,
                name: snippet?.title,
              },
            ]}
          />
        )}
        {snippet && (
          <div className="flex flex-col space-y-6">
            <p className="text-gray-400"> {snippet.description}</p>
            <CodeEditor
              content={snippet.content}
              language={snippet.language}
              readonly={true}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Snippet;
