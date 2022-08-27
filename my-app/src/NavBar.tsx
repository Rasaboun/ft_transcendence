/* This example requires Tailwind CSS v2.0+ */
import React from 'react';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { Routes, Route, Link } from "react-router-dom";

let navigation = [
  { name: 'Dashboard', href: '#', current: false},
  { name: 'Chat', href: '#', current: false},
  { name: 'Pong', href: '#', current: false},
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  return (
    <>
    <div className="flex-none">
    <Disclosure as="nav" className="bg-blue-800">
      {({ open} : {open: any}) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        onClick={() => {
                        let idcurrent = document.getElementById(item.name);
                        idcurrent?.classList.add("bg-gray-500");
                        for (let other of navigation){
                          if (other.name != item.name)
                          {
                            let idother = document.getElementById(other.name);
                            idother?.classList.remove("bg-gray-500");
                          }
                        }
                        }}
                        to={item.name}
                        key={item.name}
                        className={classNames(
                        
                          'text-white hover:bg-gray-400 ',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        
                        id={item.name}
                      >
                        {item.name}
                      </Link>
                    
                    ))}
                  </div>
                </div>
                
              </div>
              <p className="text-line invisible sm:visible text-white">ft_transcendance</p>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-sky-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQwAAAC8CAMAAAC672BgAAAAZlBMVEX///8BAgIAAAAkJSXExMRwcHD39/eDg4PZ2dlNTk6qq6v7+/t/f39dXV3o6Oh8fHw8PDxgYGBXV1dBQUFjZGSJiYlqamqHh4c5OTlERER2dnYLDAzu7u6xsbFQUFDh4eEbGxu/v7/AXYMVAAAD/0lEQVR4nO3da1vbMAyG4dQMGCsMBhuHsQ34/39yLdBYbZ1EAktyqvf5bse9ryvpyWm7Tr3btBCVfhenOZNNkx7vpMc90re4kK7psjyPDCOlP3/bw6hlIcNI6Xv3rTmMahYijLVFexj1LCQYrxbNYVS0EGC8WbSGUdOCj/Fu0RhGVQs2xsaiLYzrqhZcjN6iKYzKFkyMbNESRm0LHgaxaAijugULg1q0g1HfgoOxZdEMhoIFA2PbohWMus+pXIwdi0YwVCwmMXYt2sAQW5yzpp3A2LNoAkPJYgJj36IFDC2LcYyCRQMYahajGCULfwyhReJbjGEULdwxFC1GMMoW3hiaFsMYAxbOGKoWgxhDFr4YuhZDGIMWrhjKFgMYwxaeGNoWZYwRC0cMdYsixpiFH4a+RQkjpaeRAV4YBhYFjHELLwwLi32MCQsnDBOLPYwpCx8MG4tdjEkLFwwjix2MaQsPDCuLbQyGhQOGmcUWBsfCHsPOgmKwLMwxxBanHz9WxuBZWGNYWmQMpoUxhqlFj8G1sMWwtdhgsC1MMYwt3jH4FpYY1hZvGAILQwxzi1cMiYUdhuHri00rDJGFGYaDxQpDZmGF4WGxxhBZGGG4WKwwZBY2GD4W3T+hhRzjWb6oHz4W3Yl0wKUU41a8Ji8LceIbka7Fh5iRhWilCRZkpbD4jIXT84i89iwE+7Uqd6p/7YRFDhY5WOTEFncKj5MTLHKwyLVo8enP+D5YixZe185zWPTBIodzJAeLnNjiQnwI4Xt2WMACFrCARQcL2mwsxN+PwAIWsAhsIfx+BBawcLJg/S6KQgYWP2HRB4scLHK4XuRmY/ELFn3tWSRYwAIWsIAFLGiwyMEiB4uc+HWn1x4lA4tjqcXVF+1e6licSSlOumchxuo0Ua9409GD9o7D5U13JMXQr4wh/E8k8em8vH8ERm+RjoDRWwAjWyyAkS2AQSyAQSyAQSyAQSyAQSyA0S2v+mnDYxCL8BjUIjrGlkVwjG2L2Bg7FqExdi0iY+xZBMbYt4iLUbAIi1GyiIpRtAiKUbaIiTFgERNjwCIkxv3QPPEwhs6RRUCMEYtwGGMW0TBGLYJhjFvEwpiwCIUxZREJY9IiEMbyZnJ4GAyGRRgMjsUa41l/8547BstijXF5rJ101211DJ6Fwv/CF3pyxmBa2GB89cXgWkTAYFsEwOBbHD6GwOLgMSQWh44hspgZhrC77kY2YEYYD1KMY+mIx/lgnOg3H4zDCBgkYJCAQQIGCRgkYJCAQQIGCRgkYJCAQQIGCRgkYJCAQQIGCRgkYJCAQQIGCRgkYJCAQQIGCRgkYJCAQQIGCRgkYJCAQQIGCRgkYJCAQQIGCRik+WD8B9eciiTzSKgkAAAAAElFTkSuQmCC"
                        alt=""
                       
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-blue-500 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }: {active: any}) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-blue-600' : '', 'block px-4 py-2 text-sm text-white')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: {active: any}) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-blue-600' : '', 'block px-4 py-2 text-sm text-white')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: {active: any}) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-blue-600' : '', 'block px-4 py-2 text-sm text-white')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    'text-white hover:bg-gray-400 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    

      
        
        </div>
    </>
    
    
  )
}
