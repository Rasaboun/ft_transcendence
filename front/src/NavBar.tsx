/* This example requires Tailwind CSS v2.0+ */
import React, {useState, useEffect, useContext} from 'react';
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { Routes, Route, Link, useLocation } from "react-router-dom";
import logo from './42-logo.png';
import profile from './profile.png';
import useLocalStorage from './hooks/localStoragehook';
import Cookies from 'js-cookie';

let navigation = [
  { name: 'Dashboard', href: '#', current: false},
  { name: 'Chat', href: '#', current: false},
  { name: 'Pong', href: '#', current: false},
]
let profileColor = ["bg-green-400", "bg-red-400", "bg-gray-400"]
let index = 0;

function classNames(...classes: string[] ) {
  return classes.filter(Boolean).join(' ')
}

function HoverNavBar(location :String){
 

  for (let other of navigation){
      document.getElementById(other.name)?.classList.remove("bg-indigo-400");
      document.getElementById(other.name + "burger")?.classList.remove("bg-indigo-400");
  }

  document.getElementById(location.replace('/',""))?.classList.add("bg-indigo-400");
  document.getElementById(location.replace('/',"") + "burger")?.classList.add("bg-indigo-400");
}

export default function NavBar() {
  const location = useLocation();
  const { storage, setStorage } = useLocalStorage("user")
	const { image } = useContext(SocketContext)

  
  useEffect(() => {    // Mettre à jour le titre du document en utilisant l'API du navigateur
    
    document.getElementById("notification")?.classList.add(profileColor[1]);
    HoverNavBar(location.pathname);
    const getPhoto = async () => {
        
      const file  = await getUserPhoto(storage.login);
      setStorage("user", {...storage, image : file} )
    }
    getPhoto()
  },[image]);
  
  return (
    <>
    <div className="flex-none">
    <Disclosure as="nav" className="bg-indigo-300">
      {({ open} : {open: any}) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-indigo-400 hover:text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
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
                  <Link
                  to="/"
                  onClick={() => {
                        for (let other of navigation){
                            let idother = document.getElementById(other.name);
                            idother?.classList.remove("bg-indigo-200");
                        }
                        }}
                   >
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src={logo}
                    alt="Workflow"
                  />
                  </Link>
                  <Link
                  to="/"
                  onClick={() => {
                    for (let other of navigation){
                        let idother = document.getElementById(other.name);
                        idother?.classList.remove("bg-indigo-200");
                    }
                    }}
                  >
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={logo}
                    alt="Workflow"
                  />
                  </Link>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                      
                        to={item.name}
                        key={item.name}
                        className={classNames(
                        
                          'text-white hover:bg-indigo-200 ',
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
              <p className="text-line hidden sm:block text-white">ft_transcendance</p>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-indigo-600 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <div className="relative">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={storage.image}
                        alt=""
                       
                      />
                      <span id="notification"
                      className="top-0 left-7 absolute  w-3.5 h-3.5 border-2 border-gray rounded-full"
                      onClick={() => {
                        for (let i of profileColor){
                          let notif = document.getElementById("notification");
                          notif?.classList.remove(i);
                        }
                        let notif = document.getElementById("notification");
                        notif?.classList.add(profileColor[index]);
                        index = index >= profileColor.length - 1 ? 0 : index + 1;
                      }}
                      >
                      </span>
                      </div>
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
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-indigo-400 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }: {active: any}) => (
                          <Link
                          to={"/profile/" + storage.login}
                          className={classNames(active ? 'bg-indigo-300' : '', 'block px-4 py-2 text-sm text-white')}
                        >
                          Profile
                        </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: {active: any}) => (
                          <Link
                            to="Settings"
                            className={classNames(active ? 'bg-indigo-300' : '', 'block px-4 py-2 text-sm text-white')}
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: {active: any}) => (
                          <a
                            href="/login"
                            className={classNames(active ? 'bg-indigo-300' : '', 'block px-4 py-2 text-sm text-white')}
                            onClick={() => {localStorage.clear(); Cookies.remove("token")}}
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
                  <Link
                  id={item.name + "burger"}
                  to={item.name}
                  className={classNames(
                    'text-white hover:bg-indigo-200 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  key={item.name}
                  
                  onClick={() => {
                    
                    for (let other of navigation){
                        let idother = document.getElementById(other.name + "burger");
                        idother?.classList.remove("bg-indigo-400");
                    }
                    let idcurrent = document.getElementById(item.name + "burger");
                    idcurrent?.classList.add("bg-indigo-400");
                    }}
                  >
                    {item.name}
                  </Link>
                  
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
