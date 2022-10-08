import React, { useEffect, useState } from "react";

type PrivMessageInputPropsT = {
    value: string,
    handleSubmitMessage: any,
    handleChange: any,
	isBlocked: boolean,
}

export default function PrivMessageInput(props:PrivMessageInputPropsT)
{
	console.log("isBlocked", props.isBlocked);
	return (
		<form onSubmit={props.handleSubmitMessage} >
			<input style={{
				border: "1px solid black",
				marginRight: "15px"
			}}
			name='message' type="text"
            value={ props.isBlocked? "Chat blocked" : props.value}
			onChange={props.handleChange}
			disabled={props.isBlocked}
			 />

			<button type="submit" style={{
				height: "5vh",
				width: "20vh",
				backgroundColor: "#00ffff",
				borderRadius: "20px"
			}}>
				Send
			</button>
		</form>
	)
}