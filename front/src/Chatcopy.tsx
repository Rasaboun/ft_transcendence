import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatElem from './chat/component/channelElem';
import PrivChatElem from './chat/component/privChatElem';
import ChatMenu from './chat/component/channelMenu';
import './output.css';




import { useState } from 'react'
import { Tab } from '@headlessui/react'

function classNames(...classes:any[]) {
  return classes.filter(Boolean).join(' ')
}

function Channel() {
	let [categories] = useState({
		People: [
		{
			id: 1,
			title: 'Does drinking coffee make you smarter?',
		},
		{
			id: 2,
			title: "So you've bought coffee... now what?",
		},
		{
			id: 3,
			title: "So you've bought coffee... now what?",
		},
		{
			id: 4,
			title: "So you've bought coffee... now what?",
		},
		{
			id: 5,
			title: "So you've bought coffee... now what?",
		},
		{
			id: 6,
			title: "So you've bought coffee... now what?",
		},
		{
			id: 7,
			title: "So you've bought coffee... now what?",
		},
		{
			id: 8,
			title: "So you've bought coffee... now what?",
		},
		{
			id: 9,
			title: "So you've bought coffee... now what?",
		},
		],
		Channel: [
			{
			id: 1,
			title: 'Is tech making coffee better or worse?',
			},
			{
			id: 2,
			title: 'The most innovative things happening in coffee',
			},
		],
	})


  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
			<ChatMenu/>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-300 p-1">

          {Object.keys(categories).map((category) => (

            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-indigo-400 shadow'
                    : 'text-white hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(categories).map((posts, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2'
              )}
            >
              <ul>
                {posts.map((post) => (
                  <li
                    key={post.id}
                    className="relative rounded-md p-3 hover:bg-gray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {post.title}
                    </h3>
                    <p
                      
                      className={classNames(
                        'absolute inset-0 rounded-md',
                        'ring-indigo-400 focus:z-10 focus:outline-none focus:ring-2'
                      )}
                    />
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}







export default function ChatCopy() {
	return (
	<div id="Chat" className="flex-1">
		<header className="bg-white shadow">
			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl tracking-tight font-bold text-gray-900">Chat</h1>
			</div>
		</header>
		<main>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				{/* <div className='border-4 border-dashed border-gray-200 rounded-lg h-96'> */}
				<Routes>
					{/* <Route path="/" element={<ChatMenu/>}/> */}
					<Route path="/message" element={<ChatElem/>}/>
					<Route path="/privMessage" element={<PrivChatElem/>}/>
				</Routes>
				{/* </div> */}
				{/* Replace with your Chat */}
				<div className=" px-4 py-6 sm:px-0">
					<div className="border-4 border-dashed border-gray-200 rounded-lg h-96" >
            <Channel />
			    </div>
	      </div>
				{/* /End replace */}
			</div>
		</main>
    </div>
	);  
  }
  






