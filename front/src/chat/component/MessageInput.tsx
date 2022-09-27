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
			<input style={{
				border: "1px solid black",
				marginRight: "15px"
			}}
			name='message' type="text"
			value={!props.mutedTime ? props.value : `You are muted : ${props.mutedTime} secs left`}
			onChange={props.handleChange}
			disabled={props.mutedTime ? true : false}/>

			<button type="submit" style={{
				height: "5vh",
				width: "20vh",
				backgroundColor: !props.mutedTime ? "#00ffff" : "#A8A8A8",
				borderRadius: "20px"
			}} disabled={props.mutedTime ? true : false}>
				Send
			</button>
		</form>
	)
	
}