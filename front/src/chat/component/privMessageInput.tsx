import React, { useEffect, useState } from "react";

type PrivMessageInputPropsT = {
    value: string,
    handleSubmitMessage: any,
    handleChange: any,
	isBlocked: boolean,
	blockedSentence: string,
}

export default function PrivMessageInput(props:PrivMessageInputPropsT)
{
	return (
		<form className="bg-indigo-50" onSubmit={props.handleSubmitMessage} >
			<input
			className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 w-4/5 ml-5" 
			name='message' type="text"
            value={ props.isBlocked? props.blockedSentence : props.value}
			onChange={props.handleChange}
			disabled={props.isBlocked}
			 />

			<button type="submit" className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ml-5">
				Send
			</button>
		</form>
	)
}