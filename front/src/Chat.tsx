import React, { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivChatElem from './chat/component/privChatElem';
import './output.css';
import "./index.css"

import { Tab } from '@headlessui/react'
import ChannelMenu from './chat/component/channelMenu';
import ChannelElem from './chat/component/channelElem';
import PrivChatMenu from './chat/component/privChatMenu';
import { SocketContext } from './Context/socketContext';

function classNames(...classes:any[]) {
  return classes.filter(Boolean).join(' ')
}

function Channel() {
	

	useEffect(() => {
		localStorage.removeItem('privChat');
	}, [])

	let categoriesTab = ["Channels", "Private Chat"].map((category) => (

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
		</Tab>));

  return (
    <div className="w-full h-screen">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-300 p-1">
			{ categoriesTab }
        </Tab.List>
			<Tab.Panels className="mt-2">
				<Tab.Panel>
					<ChannelMenu/>
				</Tab.Panel>
				<Tab.Panel>
					<PrivChatMenu/>
				</Tab.Panel>
			</Tab.Panels>
      </Tab.Group>
    </div>
  )
}







export default function Chat() {
	const { setNotification } = useContext(SocketContext);
	useEffect(() => {
        setNotification(false)
		// eslint-disable-next-line
	}, [])
	return (
	<div id="Chat" className="flex-1 h-screen m-auto">
		<header className="page-header shadow">
			<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<h1 className="page-title">Chat</h1>
			</div>
		</header>
		<main>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				
				<Routes>
					{<Route path="/" element={<Channel/>}/> }
					<Route path="/message" element={<ChannelElem/>}/>
					<Route path="/privMessage" element={<PrivChatElem/>}/>
				</Routes>
				<div className=" px-4 py-6 sm:px-0">
	      </div>
			</div>
		</main>
    </div>
	);  
  }
  






