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

    const handleOnMouseOver = () => {
        setIsHover(true)
    }

    const handleMouseLeave = () => {
        setIsHover(false)
    }

	const handleBan = () => {
		banUser({
			channelName: storage!.channelId,
			targetId: client.login,
			duration: 60
		})
	}

	const handleMute = () => {
		muteUser({
			channelName: storage!.channelId,
			targetId: client.login,
			duration: 60
		})
	}

	const handleSetAdmin = () => {
		addAdmin({
			channelName: storage!.channelId,
			clientId: client.login
		})
		
	}
	return (
		<div className="user-container" onMouseOver={handleOnMouseOver} onMouseLeave={handleMouseLeave}>
			
			<div className="user-info">
				<img className="user-img" src="https://i.imgur.com/vNHtbSz.png" alt="user profil picture" />
				<h3>{client.username}</h3>
			</div>
			{
                isHover && userState?.isAdmin && storage2.login !== client.login &&
					<div className="user-option">
						<button onClick={() => handleMute()}>🙊</button>
						<button onClick={() => handleBan()}>🚫</button>
						<button onClick={() => handleSetAdmin()}>💪</button>
					</div>
            }
		</div>
	)
}