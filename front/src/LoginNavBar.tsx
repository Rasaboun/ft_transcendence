import { Disclosure } from '@headlessui/react'
import { Link } from "react-router-dom";
import logo from './42-logo.png';

let navigation = [
  { name: 'Dashboard', href: '#', current: false},
  { name: 'Chat', href: '#', current: false},
  { name: 'Pong', href: '#', current: false},
]




export default function LoginNavBar() {
  
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
