import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Switch } from '@headlessui/react'

import { trpc } from '../utils/trpc';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const CreateCommand = ({ open, setOpen, refetchCommands }: any) => {
  const [isPrivate, setIsPrivate] = useState(false)
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [labels, setLabels] = useState('')
  const { mutate: createCommand } = trpc.command.createCommand.useMutation({onSuccess: async () => {
    refetchCommands()
    setOpen(false);
  }});

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-900/50 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-[500px] sm:p-6 text-white">
                <div>
                  <div className="mt-3 sm:mt-5 flex flex-col space-y-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-200">
                      Add Command
                    </Dialog.Title>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          name="content"
                          className="block bg-gray-900 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="sudo rm -rf /"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          name="content"
                          className="block bg-gray-900 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="this is a command"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Labels
                      </label>
                      <div className="mt-1">
                        <input
                          value={labels}
                          onChange={(e) => setLabels(e.target.value)}
                          type="text"
                          name="content"
                          className="block bg-gray-900 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="linux, docker, sudo"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">

                      <p className="text-gray-300">Private </p>
                      <Switch
                        checked={isPrivate}
                        onChange={setIsPrivate}
                        className={classNames(
                          isPrivate ? 'bg-indigo-600' : 'bg-gray-800',
                          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            isPrivate ? 'translate-x-5' : 'translate-x-0',
                            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                          )}
                        />
                      </Switch>
                    </div>

                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => createCommand(
                      {
                        content: content,
                        description: description,
                        labels: labels.split(',').map((label: string) => label.trim()),
                        private: isPrivate
                      }
                    )}
                  >
                    Create Command
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
};


export default CreateCommand;