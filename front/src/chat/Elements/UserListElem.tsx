import React, { useState } from "react";
import useLocalStorage from "../../hooks/localStoragehook";
import { ClientElem, ClientInfoT, UserStateT } from "../ChatUtils/chatType";
import { addAdmin, banUser, muteUser } from "../ChatUtils/socketManager";

type UserElemPropsT = {
	client: ClientElem;
	userState?:UserStateT;
}

export default function UserListElem({ client, userState }:UserElemPropsT)
{
	const {storage} = useLocalStorage("channel")
	const {storage2} = useLocalStorage("user")
	const [isHover, setIsHover] = useState<boolean>(false)
	const [form, setForm] = useState({
		banTime: "",
		muteTime: "" 
	})
	const [isTimer, setIsTimer] = useState({
		mute: false,
		ban: false
	})

    const handleOnMouseOver = () => {
        setIsHover(true)
    }

    const handleMouseLeave = () => {
        setIsHover(false)
		setIsTimer((oldTimer) => ({
			mute:false,
			ban: false
		}))
		setForm((oldTimer) => ({
			banTime: "",
			muteTime: "" 
		}))
    }

	const handleBan = () => {
		setIsTimer((oldTimer) => ({
			...oldTimer,
			ban: true
		}))
	}

	const handleMute = () => {
		setIsTimer((oldTimer) => ({
			...oldTimer,
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
			duration: new Date().getTime() + parseInt(form.muteTime) * 1000
		})
	}

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		console.log()
		setForm((oldForm) => ({
			...oldForm,
			[e.target.name]: e.target.value
		}))
	}

	return (
		<div className="user-container" onMouseOver={handleOnMouseOver}/* onMouseLeave={handleMouseLeave}*/>
			
			<div className="user-info">
				<img className="user-img" src="https://i.imgur.com/vNHtbSz.png" alt="user profil picture" />
				<h3>{client.username} {client.isMuted && "🔇"}</h3>
			</div>
			{
                isHover && userState?.isAdmin && storage2.login !== client.login &&
					<div className="user-option">
						{
							isTimer.ban &&
								<form action="submit" onSubmit={handleSubmitBan}>
									<input type="number" name="banTime"
										min="0:00" max="1:00" value={form.banTime} onChange={handleChange} required/>
									<button type="submit">set</button>
								</form>

						}
						{
							isTimer.mute &&
								<form action="submit" onSubmit={handleSubmitMute}>
									<input type="number" name="muteTime"
										min="0:00" max="1:00" value={form.muteTime} onChange={handleChange} required/>
									<button type="submit">set</button>
								</form>

						}
						{
							(!isTimer.ban && !isTimer.mute) && 
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