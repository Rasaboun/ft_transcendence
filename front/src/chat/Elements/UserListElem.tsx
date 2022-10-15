import React, { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/localStoragehook";
import { ClientElem, UserStateT } from "../ChatUtils/chatType";
import {
  addAdmin,
  banUser,
  createLobby,
  muteUser,
  sendInvitation,
} from "../../Utils/socketManager";
import GameRadioForm from "../../Elements/radioFormElem";
import { GameMode } from "../../game/GameUtils/type";
import { Link, useNavigate } from "react-router-dom";
import { getUserPhoto } from "../../Requests/users";
import Loader from "../../Elements/loader";
type UserElemPropsT = {
  client: ClientElem;
  userState?: UserStateT;
};

export default function UserListElem({ client, userState }: UserElemPropsT) {
  const navigate = useNavigate();
  const { storage } = useLocalStorage("channel");
  const { storage2 } = useLocalStorage("user");
  const [gameMode, setGameMode] = useState(GameMode.Normal);
  const [isHover, setIsHover] = useState<boolean>(false);
  const [image, setImage] = useState<string>();
  const [form, setForm] = useState({
    banTime: "",
    muteTime: "",
  });
  const [isSelected, setIsSelected] = useState({
    mute: false,
    ban: false,
    invite: false,
  });

  useEffect(() => {
    const getImage = async () =>
    {
      const userImg = await getUserPhoto(client.login)
      setImage(userImg);

    }
    getImage()

		// eslint-disable-next-line
  }, [image])

  const handleOnMouseOver = () => {
    setIsHover(true);
  };


  const handleBan = () => {
    setIsSelected((oldSelected) => ({
      ...oldSelected,
      ban: true,
    }));
  };

  const handleMute = () => {
    setIsSelected((oldSelected) => ({
      ...oldSelected,
      mute: true,
    }));
  };

  const handleSetAdmin = () => {
    addAdmin({
      channelName: storage!.channelId,
      clientId: client.login,
    });
  };

  const handleSubmitBan = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    banUser({
      channelName: storage!.channelId,
      targetId: client.login,
      duration: parseInt(form.banTime),
    });

    setIsSelected(() => ({
      ban: false,
      mute: false,
      invite: false,
    }));
  };

  const handleSubmitMute = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    muteUser({
      channelName: storage!.channelId,
      targetId: client.login,
      duration: parseInt(form.muteTime),
    });
    setIsSelected(() => ({
      ban: false,
      mute: false,
      invite: false,
    }));
  };

  const handleSubmitGameMode = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    createLobby({ inviteMode: true, mode: gameMode });
    sendInvitation({ channelName: storage!.channelId, mode: gameMode });
    navigate("/Pong/game");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setForm((oldForm) => ({
      ...oldForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleInviteToGame = () => {
    setIsSelected((oldSelected) => ({
      ...oldSelected,
      invite: true,
    }));
  };

  return (
    <Loader condition={image !== undefined}>
    <div
      className="flex items-center justify-between mx-4"
      onMouseOver={handleOnMouseOver} /* onMouseLeave={handleMouseLeave}*/
    >
      
        <Link to={"/profile/" + client.login}>
          <div className="flex items-center">
            <img className="user-img" src={image} alt="user profile"/>
            {client.username}
          </div>
        </Link>
        {client.isMuted && "🔇"}
      
      {isHover && storage2.login !== client.login && !isSelected.invite && (
        <button onClick={() => handleInviteToGame()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            />
          </svg>
        </button>
      )}
      {isSelected.invite && (
        <form className="channel-form" onSubmit={handleSubmitGameMode}>
          <GameRadioForm
            choice={gameMode}
            setChoice={setGameMode}
            options={["Normal", "Mini", "Speed"]}
          />
          <button type="submit" className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-1 my-2 mx-2">
            Invite
          </button>
        </form>
      )}
      {isHover && userState?.isAdmin && storage2.login !== client.login && (
        <div className="user-option">
          {isSelected.ban && (
            <form action="submit" onSubmit={handleSubmitBan}>
              <input
                type="number"
                name="banTime"
                min="0:00"
                max="1:00"
                value={form.banTime}
                onChange={handleChange}
                required
              />
              <button type="submit">set</button>
            </form>
          )}
          {isSelected.mute && (
            <form action="submit" onSubmit={handleSubmitMute}>
              <input
			    className="w-10"
                type="number"
                name="muteTime"
                min="0:00"
                max="1:00"
                value={form.muteTime}
                onChange={handleChange}
                required
              />
              <button type="submit">set</button>
            </form>
          )}
          {!isSelected.ban && !isSelected.mute && !isSelected.invite && (
            <div>
              <button onClick={() => handleMute()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
                  />
                </svg>
              </button>
              <button onClick={() => handleBan()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </button>
              <button onClick={() => handleSetAdmin()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    </Loader>
  );
}
