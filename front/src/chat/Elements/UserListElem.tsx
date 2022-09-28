import React, { useState } from "react";
import useLocalStorage from "../../hooks/localStoragehook";
import { ClientElem, UserStateT } from "../ChatUtils/chatType";
import { addAdmin, banUser, createLobby, muteUser, sendInvitation } from "../../Utils/socketManager";
import GameRadioForm from "../../Elements/radioFormElem";
import { GameMode } from "../../game/GameUtils/type";
import {  Link, useNavigate, useParams } from "react-router-dom";
type UserElemPropsT = {
	client: ClientElem;
	userState?:UserStateT;
}

export default function UserListElem({ client, userState }:UserElemPropsT)
{
	const { profile } = useParams();
	const navigate = useNavigate()
	const {storage} = useLocalStorage("channel")
	const {storage2} = useLocalStorage("user")
	const [gameMode, setGameMode] = useState(GameMode.Normal)
	const [isHover, setIsHover] = useState<boolean>(false)
	const [form, setForm] = useState({
		banTime: "",
		muteTime: "",
	})
	const [isSelected, setIsSelected] = useState({
		mute: false,
		ban: false,
		invite: false
	})

    const handleOnMouseOver = () => {
        setIsHover(true)
    }

    const handleMouseLeave = () => {
        setIsHover(false)
		setIsSelected((oldSelected) => ({
			mute:false,
			ban: false,
			invite: false
		}))
		setForm((oldSelected) => ({
			banTime: "",
			muteTime: "" 
		}))
    }

	const handleBan = () => {
		setIsSelected((oldSelected) => ({
			...oldSelected,
			ban: true
		}))
	}

	const handleMute = () => {
		setIsSelected((oldSelected) => ({
			...oldSelected,
			mute: true
		}))
	}

	const handleSetAdmin = () => {
		addAdmin({
			channelName: storage!.channelId,
			clientId: client.login
		})
		
	}

	const handleSubmitBan = (e:React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		banUser({
			channelName: storage!.channelId,
			targetId: client.login,
			duration: parseInt(form.banTime)
		})
	}

	const handleSubmitMute = (e:React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		 muteUser({
			channelName: storage!.channelId,
			targetId: client.login,
			duration: parseInt(form.muteTime)
		})
	}

	const handleSubmitGameMode = (e:React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		//INITED ID ?
		createLobby({inviteMode: true, mode: gameMode})
		sendInvitation({channelName: storage!.channelId, mode: gameMode})
		navigate("/Pong/game")
	}

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		console.log()
		setForm((oldForm) => ({
			...oldForm,
			[e.target.name]: e.target.value
		}))
	}

	const handleInviteToGame = () => {
		setIsSelected((oldSelected) => ({
			...oldSelected,
			invite: true
		}))
	}

	return (
		<div className="user-container" onMouseOver={handleOnMouseOver}/* onMouseLeave={handleMouseLeave}*/>
			
			<div className="user-info">
				<img className="user-img" src="https://i.imgur.com/vNHtbSz.png" alt="user profil" />
				<h3>
					<Link to={"/profile/" + client.login}>
						{client.username}
					</Link>
					{client.isMuted && "🔇"}
				</h3>
			</div>
			{
				isHover && storage2.login !== client.login && !isSelected.invite &&
					<button onClick={() => handleInviteToGame()}>⚽</button>
			}
			{
				
				isSelected.invite &&
				<form className="channel-form" onSubmit={handleSubmitGameMode}>
					<GameRadioForm choice={gameMode} setChoice={setGameMode} options={["Normal", "Mini", "Speed"]}/>
					<button type="submit" className="button-action" >
						Invite
					</button>
				</form>
			}
			{
                isHover && userState?.isAdmin && storage2.login !== client.login &&
					<div className="user-option">
						
						{
							isSelected.ban &&
								<form action="submit" onSubmit={handleSubmitBan}>
									<input type="number" name="banTime"
										min="0:00" max="1:00" value={form.banTime} onChange={handleChange} required/>
									<button type="submit">set</button>
								</form>

						}
						{
							isSelected.mute &&
								<form action="submit" onSubmit={handleSubmitMute}>
									<input type="number" name="muteTime"
										min="0:00" max="1:00" value={form.muteTime} onChange={handleChange} required/>
									<button type="submit">set</button>
								</form>

						}
						{
							(!isSelected.ban && !isSelected.mute && !isSelected.invite) && 
								<div>
									<button onClick={() => handleMute()}>🙊</button>
									<button onClick={() => handleBan()}>🚫</button>
									<button onClick={() => handleSetAdmin()}>💪</button>
								</div>
						}
					</div>
            }
		</div>
	)
}