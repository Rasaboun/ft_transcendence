import React, { useEffect, useState } from "react";

type PrivMessageInputPropsT = {
    sampleInfo: string,
    handleSubmitMessage: any
}

export default function MessageInput(props:PrivMessageInputPropsT)
{
	return (
		<form onSubmit={props.handleSubmitMessage} >
			<input style={{
				border: "1px solid black",
				marginRight: "15px"
			}}
            value={props.sampleInfo}
			name='message' type="text" />

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