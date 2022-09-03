import React from "react"
import "../Components/Pong/pong.css"
import * as utils from "../GameUtils/GameUtils"
import useAnimationFrame from "../hooks/useAnimationFrame"

type ballPropsT = {
	isPlaying:boolean,
	x:number,
	y:number
} & typeof defaultProps;

const defaultProps = {
	isPlaying: false,
	x: 50,
	y: 50
}

export default function Ball(props:ballPropsT)
{
	function setPosition (x:number, y:number) {
        //SET THE PADDLE POSITIONS
		document.documentElement.style.setProperty("--x", props.x.toString())
		document.documentElement.style.setProperty("--y", props.y.toString())
    }

    React.useEffect(() => {
    	setPosition(props.x, props.y)  
    })
	
    return (
        <div id="ball" className="ball">
        </div>
    )
}

Ball.defaultProps = defaultProps;