import React, { Fragment } from 'react';
import { Dialog, Switch, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

interface MapSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  showParking: boolean;
  setShowParking: (showParking: boolean) => void;
  includeGarages: boolean;
  setIncludeGarages: (includeGarages: boolean) => void;
  showBikePaths: boolean;
  setShowBikePaths: (showBikePaths: boolean) => void;
}

export const MapSettingsModal: React.FunctionComponent<MapSettingsModalProps> = ({
  isOpen,
  setIsOpen,
  showParking,
  setShowParking,
  includeGarages,
  setIncludeGarages,
  showBikePaths,
  setShowBikePaths,
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[500]" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-[500] w-screen overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 xl:translate-x-36">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <FontAwesomeIcon icon={faXmark} className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                      Map Settings
                    </Dialog.Title>

                    <div className={'mt-4 flex flex-col gap-2'}>
                      <h4 className="text-sm font-semibold">Parking</h4>
                      <Switch.Group as="div" className="flex items-center">
                        <Switch
                          checked={showParking}
                          onChange={setShowParking}
                          className={classNames(
                            showParking ? 'bg-blue-500' : 'bg-gray-200',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              showParking ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                        <Switch.Label as="span" className="ml-3 cursor-pointer text-sm">
                          <span className="font-medium text-gray-900">Show Parking</span>{' '}
                        </Switch.Label>
                      </Switch.Group>
                      <Switch.Group as="div" className="flex items-center">
                        <Switch
                          checked={includeGarages}
                          onChange={setIncludeGarages}
                          disabled={!showParking}
                          className={classNames(
                            includeGarages ? 'bg-blue-500' : 'bg-gray-200',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              includeGarages ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                        <Switch.Label as="span" className="ml-3 cursor-pointer text-sm">
                          <span
                            className={classNames(
                              'font-medium',
                              !showParking ? 'text-gray-500' : 'text-gray-900'
                            )}
                          >
                            Show Parking Garages
                          </span>{' '}
                        </Switch.Label>
                      </Switch.Group>
                      <h4 className="mt-2 text-sm font-semibold">Bike Infrastructure</h4>
                      <Switch.Group as="div" className="flex items-center">
                        <Switch
                          checked={showBikePaths}
                          onChange={setShowBikePaths}
                          className={classNames(
                            showBikePaths ? 'bg-green-500' : 'bg-gray-200',
                            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              showBikePaths ? 'translate-x-5' : 'translate-x-0',
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                        <Switch.Label as="span" className="ml-3 cursor-pointer text-sm">
                          <span className="font-medium text-gray-900">Show Bike Paths</span>{' '}
                        </Switch.Label>
                      </Switch.Group>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
