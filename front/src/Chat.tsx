import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ChatElem from './chat/component/chatElem';
import PrivChatElem from './chat/component/privChatElem';
import ChatMenu from './chat/component/chatMenu';
import './output.css';


export default function Chat() {
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
					<Route path="/" element={<ChatMenu/>}/>
					<Route path="/message" element={<ChatElem/>}/>
					<Route path="/privMessage" element={<PrivChatElem/>}/>
				</Routes>
				{/* </div> */}
				{/* Replace with your Chat */}
				<div className=" px-4 py-6 sm:px-0">
				</div>
				{/* /End replace */}
			</div>
		</main>
	</div>
	);  
  }
  






