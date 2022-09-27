import React from 'react';
import LoginElem from './authPage/component/LogPage';
import './output.css';


export default function Login() {
	return (
	<div id="Home" className="flex-1">
	<header className="bg-white shadow">
	<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
	<h1 className="text-3xl tracking-tight font-bold text-gray-900">Home</h1>
	</div>
	</header>
	<main>
	<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
	{/* Replace with your Chat */}
	<div className=" px-4 py-6 sm:px-0">
	<div className="flex border-4 border-dashed border-gray-200 rounded-lg h-96">
			<LoginElem/>
	</div>
	</div>
	{/* /End replace */}
	</div>
	</main>
	</div>
	);  
  }
  
