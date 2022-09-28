import React, { useContext, useState } from "react";
import { SocketContext } from "../Context/socketContext";
import {GameMode } from "../game/GameUtils/type";

type PropsT = {
	choice: any
	options: string[]
	setChoice: (choice:any) => void
}

export default function RadioFormElem({ choice, setChoice, options }:PropsT)
{
	console.log(options)
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setChoice(parseFloat(e.target.value))
    }

	const OptionsElem = options.map((elem, idx) => (
		<label>
			<input name="mode"
				type="radio" 
				value={idx}
				checked={choice === idx}
				onChange={handleChange}
				/>
			{elem}
		</label>
	))

	return (
		<div className="form-radio">
			{OptionsElem}
		</div>
	)
}