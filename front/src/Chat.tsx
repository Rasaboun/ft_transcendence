import React from 'react';
import ChatElem from './chat/component/chatElem';
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
	{/* Replace with your Chat */}
	<ChatElem/>
	<div className=" px-4 py-6 sm:px-0">
	</div>
	{/* /End replace */}
	</div>
	</main>
	</div>
	);  
  }
  






