import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

import Layout from "../../components/Layout";
import PageHeader from "../../components/primitives/PageHeader";
import CodeEditor from "../../components/primitives/CodeEditor";
import Share from "../../components/Share";

import { useSession } from "next-auth/react";

const Snippet: NextPage = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const { data: snippet } = trpc.snippet.getOne.useQuery(
    { id: id },
    { enabled: !!id }
  );


  const { data: session } = useSession();

  const [shareModalOpen, setShareModalOpen] = useState(false);


  return (
    <Layout>
      <Share
        snippet={snippet}
        open={shareModalOpen}
        setOpen={setShareModalOpen}
      />
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
            shareCallback={() => {
              setShareModalOpen(true);
            }}
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
