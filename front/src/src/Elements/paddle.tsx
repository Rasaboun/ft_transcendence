import React, { useEffect } from "react"
import "../Components/Pong/pong.css"

type PaddleProps = {
    id?: string,
    className: string,
    position: number,
	player: boolean
}

export default function Paddle(props: PaddleProps)
{
    function setPosition (position:number) {
        //SET THE PADDLE POSITIONS
		if (props.player)
			document.documentElement.style.setProperty("--position-left", position.toString())
		else
			document.documentElement.style.setProperty("--position-right", position.toString())
    }

	

    useEffect(() => {
    	setPosition(props.position)  
    })

    return (
        <div id={props.id} className={"paddle " + props.className}>
        </div>
    )
}