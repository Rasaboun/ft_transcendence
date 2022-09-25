import React, { useContext, useState } from "react";
import { SocketContext } from "../Context/socketContext";
import {GameMode } from "../game/GameUtils/type";

type PropsT = {
	gameMode: GameMode
	setGameMode: (gameMode:GameMode) => void
}

export default function GameRadioForm({ gameMode, setGameMode }:PropsT)
{

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setGameMode(parseFloat(e.target.value))
    }

	return (
		<div className="form-radio">
			<label>
				<input name="mode"
					type="radio" 
					value={GameMode.Normal}
					checked={gameMode === GameMode.Normal}
					onChange={handleChange}
					/>
				Normal
			</label>
			<label>
				<input name="mode"
					type="radio" 
					value={GameMode.Mini}
					checked={gameMode === GameMode.Mini}
					onChange={handleChange}
					/>
					Mini
			</label>
			<label>
			<input name="mode"
					type="radio" 
					value={GameMode.Speed}
					checked={gameMode === GameMode.Speed}
					onChange={handleChange}
					/>
					Speed
			</label>
		</div>
	)
}