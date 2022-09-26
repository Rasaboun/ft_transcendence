import React, { useEffect, useState } from "react";

type PrivMessageInputPropsT = {
    sampleInfo: string,
    handleSubmitMessage: any,
    handleChange: any
}

export default function PrivMessageInput(props:PrivMessageInputPropsT)
{
	return (
		<form onSubmit={props.handleSubmitMessage} >
			<input style={{
				border: "1px solid black",
				marginRight: "15px"
			}}
			name='message' type="text"
            value={props.sampleInfo}
			onChange={props.handleChange}
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