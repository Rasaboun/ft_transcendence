import React from "react"
import "../Components/Pong/pong.css"
import * as utils from "../GameUtils/GameUtils"
import useAnimationFrame from "../hooks/useAnimationFrame"

type ballPropsT = {
	isPlaying:boolean
}

type ballInfoT = {
    x: number,
    y: number,
    dirX: number,
    dirY: number,
    speed: number,
	delta: number
}

export default function Ball(props:ballPropsT)
{
    const [ballInfo, setBallInfo] = React.useState<ballInfoT>({
		x: utils.getBallX(),
		y: utils.getBallY(),
		dirX: 0,
		dirY: 0,
		speed: 0,
		delta: 0
	})

	function newGame()
	{
		//SET NEW GAME BALL VARIABLE X, Y, X AND Y DIRECTION, SPEED
		var directionX:number = 0;
		var directionY:number = 0;
		var defaultX:number = 50
		var defaultY:number = 50
		
		while (Math.abs(directionX) <= 0.3 || Math.abs(directionX) >= 0.8)
		{
			const trigoDir:number = Math.random() * (0 - (2 * Math.PI))
			directionX = Math.cos(trigoDir)
			directionY = Math.sin(trigoDir)
		}
		utils.setBallX(defaultX.toString())
		utils.setBallY(defaultY.toString())
		setBallInfo({
			x: utils.getBallX(),
			y: utils.getBallY(),
			dirX: directionX,
			dirY: directionY,
			speed: 0.05,
			delta: 0
		})
	}

	function isLose()
	{
		//CHECK IF THE BALL HITS THE LEFT OR THE RIGHT
		const contactZone:DOMRect = utils.getContactZone()
		if (contactZone.right >= window.innerWidth
			|| contactZone.left <= 0) {
				return true
			}
			return false
	}

	function checkYcollision(){
		//CHECK IF THE BALL HITS THE TOP OR THE BOTTOM
		const contactZone:DOMRect = utils.getContactZone()
		if (contactZone.bottom >= window.innerHeight 
			|| contactZone.top <= 0) {
				return true
		}
		return false
	}

	function checkPaddleCollision(){
		//CHECK IF THE BALL HITS A PADLLE
		const ballZone:DOMRect = utils.getContactZone()
		const playerPaddleZone:DOMRect = utils.getPaddleContactZone()
		const computerPaddleZone:DOMRect = utils.getComputerContactZone()
		if (isCollision(ballZone, playerPaddleZone)) {
			return true
		}
		if (isCollision(ballZone, computerPaddleZone)) {
			return true
		}
		return false
	}

	function isCollision(rect1:DOMRect, rect2:DOMRect)
	{
		//CHECK IF RECT1 HITS RECT2
		return (
			rect1.left <= rect2.right &&
			rect1.right >= rect2.left &&
			rect1.top <= rect2.bottom &&
			rect1.bottom >= rect2.top
			)
	}

	function updateGame(delta:number)
	{
		//GAMELOOP
		if (props.isPlaying)
		{
			delta = delta ? delta : 1
			if (!isLose())
				refreshGame(delta)
			else
				newGame()
		}
	}


	function refreshGame(delta:number)
	{
		//UPTDATE THE BALL POSITON
		const newX = ballInfo.x + (ballInfo.dirX * ballInfo.speed * delta) 
			const newY = ballInfo.y + (ballInfo.dirY * ballInfo.speed * delta)

			utils.setBallX(newX.toString())
			utils.setBallY(newY.toString())
			setBallInfo((oldBallInfo) => ({
				...oldBallInfo,
				x: newX,
				y: newY,
				dirX: checkPaddleCollision() ? oldBallInfo.dirX * (-1) : oldBallInfo.dirX,
				dirY: checkYcollision() ? oldBallInfo.dirY * (-1) : oldBallInfo.dirY,
				speed: oldBallInfo.speed + 0.00001,
				delta: delta
			}))
	}

	React.useEffect(() => {
		//RUN NEWGAME() ONLY WHEN THE PAGE FIRST REFRESH
		//SEE REACT USE EFFECT DOCUMENTATION
		newGame()
	}, [])

	//USE ANIMATION CUSTOM HOOK
	//SEE hook/useAnimationFrame.tsx FILE
	useAnimationFrame(updateGame)
	
    return (
        <div id="ball" className="ball">
        </div>
    )
}