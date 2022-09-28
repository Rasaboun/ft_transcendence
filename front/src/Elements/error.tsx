import { useEffect, useState } from "react"
import "../App.css"
type PropsT = {
	errorMsg:string
}

export default function ErrorAlert({ errorMsg }: PropsT)
{

	return (
		<div className="alert">
			{/* <span className="closebtn" onClick="this.parentElement.style.display='none';">X</span>  */}
			<strong>SORRY !! </strong> 
			{errorMsg}
		</div>
		
	)
}