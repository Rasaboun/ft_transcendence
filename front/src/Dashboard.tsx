import React, { useEffect } from 'react';
import axios from "axios";
import './output.css';



const url:string = "http://localhost:3001/users"

interface Iuser {
	id: number;
	photoUrl:string;

}
export default function Dashboard() {

	const [users, setUsers] = React.useState<Iuser[]>([]);
	
	
	
	
	useEffect(() => { axios.get(url).then((response) => { setUsers(response.data);})                   })
	
	
	return (
	<div id="Dashboard" className="flex-1">
	<header className="bg-white shadow">
	<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
	<h1 className="text-3xl tracking-tight font-bold text-gray-900">Dashboard</h1>
	</div>
	</header>
	<main>
	<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
	{/* Replace with your content */}
	<div className=" px-4 py-6 sm:px-0">
		<div className="border-4 border-dashed border-gray-200 rounded-lg h-96" >

			{
			users.map((user:Iuser) => <h1>user.id</h1>)
			}
			</div>
	</div>
	{/* /End replace */}
	</div>
	</main>
	</div>
	);  
  }
  






