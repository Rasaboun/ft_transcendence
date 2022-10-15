import { useEffect } from 'react';
import { Disclosure } from '@headlessui/react'
import { Link, useLocation } from "react-router-dom";
import logo from './42-logo.png';
import useLocalStorage from './hooks/localStoragehook';

let navigation = [
  { name: 'Dashboard', href: '#', current: false},
  { name: 'Chat', href: '#', current: false},
  { name: 'Pong', href: '#', current: false},
]
let profileColor = ["bg-green-400", "bg-red-400", "bg-gray-400"]


function HoverNavBar(location :String){
 

  for (let other of navigation){
      document.getElementById(other.name)?.classList.remove("bg-indigo-400");
      document.getElementById(other.name + "burger")?.classList.remove("bg-indigo-400");
  }

  document.getElementById(location.replace('/',""))?.classList.add("bg-indigo-400");
  document.getElementById(location.replace('/',"") + "burger")?.classList.add("bg-indigo-400");
}

export default function LoginNavBar() {
  const location = useLocation();
  
  useEffect(() => {    // Mettre à jour le titre du document en utilisant l'API du navigateur    
    document.getElementById("notification")?.classList.add(profileColor[1]);
    HoverNavBar(location.pathname);
  }, []);
  
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
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
    </div>
  </>
    
    
  )
}
