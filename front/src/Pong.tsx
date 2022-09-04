import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from './game/Components/menu';
import Game from './game/Components/game';
import { GameContext, GameContextProvider } from "./game/GameContext/gameContext"

import './output.css';


export default function Pong() {
	const value = useContext(GameContext);
	console.log(value.gameInfo)
	return (
	
		<div id="Pong" className="flex-1">
		<header className="bg-white shadow">
		<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
		<h1 className="text-3xl tracking-tight font-bold text-gray-900">Pong</h1>
		</div>
		</header>
			<main>
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			{/* Replace with your Chat */}
			
				<div className="App">
					<div>
						<Routes>
							<Route path="/" element={<Menu/>}/>
							<Route path="/game" element={<Game/>}/>
						</Routes>
					</div>
				</div>
			<div className=" px-4 py-6 sm:px-0">
			
				{<div className="border-2 border-line border-gray-200 rounded-lg h-96">
				{
					value.gameInfo !== undefined && value.gameInfo.isPlaying &&
					<div className='score--container'>
						<h1 className='score--elem'> {value.gameInfo.players[0].score} : {value.gameInfo.players[1].score}</h1>
					</div>
				}
				</div>}
			</div>
			{/* /End replace */}
			</div>
			</main>
		</div>
	
	);  
  }
  






