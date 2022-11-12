import React from "react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface BackLink {
  href: string;
  name: string;
}
interface PageHeaderProps {
  backlinks: Array<BackLink>;
  title: string;
  editCallback: () => void;
  shareCallback: () => void;
}

const PageHeader = ({
  backlinks,
  title,
  editCallback,
  shareCallback,
}: PageHeaderProps): JSX.Element => {
  return (
    <div>
      <div>
        <nav className="mt-12 hidden sm:flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            {backlinks.map(({ href, name }, index) => (
              <li key={href}>
                <div className="flex items-center">
                  {index > 0 && (
                    <ChevronRightIcon
                      className="h-5 w-5 flex-shrink-0 text-gray-500"
                      aria-hidden="true"
                    />
                  )}
                  {index > 0 ? (
                    <a
                      href={href}
                      className="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
                    >
                      {name}
                    </a>
                  ) : (
                    <a
                      href={href}
                      className="text-sm font-medium text-gray-400 hover:text-gray-200"
                    >
                      {name}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="mt-6 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
        </div>
        <div className="mt-4 flex flex-shrink-0 md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Edit
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
