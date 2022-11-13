import React from 'react';
import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {trpc} from '../../../utils/trpc';

import CodeEditor from '../../../components/primitives/CodeEditor';
import Layout from '../../../components/Layout';


const Link: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const {data: link} = trpc.link.getOne.useQuery({id: id}, {enabled: !!id});
  console.log(link?.user.username)
  return (
    <Layout>
      <div className="flex min-h-screen w-[1200px] flex-col space-y-4 rounded-md p-4">
        {link && (
          <CodeEditor
            content={link?.content}
            readonly={true}
          />
        )}
        <div className="w-full flex items-center justify-center">
          {link && (
            <p className="text-gray-400">{link.type} by <span className="text-indigo-500 font-bold">{link.user.username}</span></p>
          )}
        </div>

      </div>
    </Layout>
  )
}

export default Link;