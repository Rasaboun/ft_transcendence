import {  Routes, Route } from "react-router-dom";
import Menu from './game/Components/menu';
import Game from './game/Components/game';

import './output.css';


export default function Pong() {
	return (
	
		<div id="Pong" className="flex-1 h-screen mb-auto">
		<header className="page-header shadow">
		<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
		<h1 className="page-title">Pong</h1>
		</div>
		</header>
			<main>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">			
				<div className="App">
					<div>
						<Routes>
							<Route path="/" element={<Menu/>}/>
							<Route path="/game" element={<Game/>}/>
						</Routes>
					</div>
				</div>
			</div>
			</main>
		</div>
	
	);  
  }
  






