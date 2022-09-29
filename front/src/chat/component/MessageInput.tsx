import React, { useEffect, useState } from "react";

type MessageInputPropsT = {
	mutedTime:number,
	value:string,
	handleChange:any
	handleSubmitMessage:any
} 

export default function MessageInput(props:MessageInputPropsT)
{
	console.log("mutedTime", props.mutedTime)
	return ( <form onSubmit={props.handleSubmitMessage}>
			<input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" name='message' type="text"
			value={!props.mutedTime ? props.value : `You are muted : ${props.mutedTime} secs left`}
			onChange={props.handleChange}
			disabled={props.mutedTime ? true : false}/>

			<button type="submit" className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2" disabled={props.mutedTime ? true : false}>
				Send
			</button>
		</form>
	)
	
}