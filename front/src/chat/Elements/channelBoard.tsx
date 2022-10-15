import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/localStoragehook";
import { ChannelModes, ChannelT, ClientElem, UserStateT } from "../ChatUtils/chatType";
import { deleteChannel, inviteClient, leaveChannel, setChannelPassword, setPrivateMode, unsetChannelPassword, unsetPrivateMode } from "../../Utils/socketManager";
import UserListElem from "./UserListElem";

type PropsT = {
    userState?: UserStateT,
    channel?:ChannelT,
    setChannelInfo:(channel:any) => void
}

export default function ChannelBoard({userState, channel, setChannelInfo}:PropsT)
{
    let ownerList: ClientElem[] = [];
    let adminsList: ClientElem[] = [];
    let othersList: ClientElem[] = [];
    const {storage} = useLocalStorage("user");
    const navigate = useNavigate()
    const [form, setForm] = useState({
        message:"",
        invite:"",
        password:"",
    })

    const handleSubmitInvite = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.invite !== "")
        {
            inviteClient({channelName: channel!.channelId, clientId: form.invite})
        }
        setForm((oldForm) => ({
            ...oldForm,
            invite: ""
        }))
    }

    const handleSubmitPassword = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.password !== "")
        {
            setChannelPassword(
            {
                channelName: channel!.channelId,
                password: form.password
            })
            if (channel?.mode !== ChannelModes.Password)
            {
                setChannelInfo((oldChannel:ChannelT) => ({
                    ...oldChannel!,
                    mode: ChannelModes.Password,
                })
            )}  
        }
        setForm((oldForm) => ({
            ...oldForm,
            password: ""
        }))
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((oldForm) => ({
      ...oldForm,
      [e.target.name]: e.target.value,
    }));
  };

    const handleLeaveChannel = () => {
        leaveChannel(channel!.channelId)
        navigate("/Chat")
    }

    const handleUnsetPassword = () => {
        unsetChannelPassword(channel!.channelId)
        setChannelInfo((oldChannel:ChannelT) => ({
            ...oldChannel!,
            mode: ChannelModes.Public,
        }))
    }

    const handleUnsetPrivMode = () => {
        unsetPrivateMode(channel!.channelId)
        setChannelInfo((oldChannel:ChannelT) => ({
            ...oldChannel!,
            mode: ChannelModes.Public,
        }))
    }

    const handleSetInvite = () => {
        setPrivateMode(channel!.channelId)
        setChannelInfo((oldChannel:ChannelT) => ({
            ...oldChannel!,
            mode: ChannelModes.Private,
        }))
    }

    const handleDelete = () => {
        deleteChannel(channel!.channelId)
     }
    
	useEffect(() => {
		channel?.clients?.forEach((elem:ClientElem, index:number) => {
			elem.isOwner && ownerList.push(elem)
			elem.isAdmin && !elem.isOwner && adminsList.push(elem)
			!elem.isAdmin && !elem.isOwner && othersList.push(elem)
		})
	}, [channel?.clients])
    
    channel?.clients?.forEach((elem:ClientElem, index:number) => {
        elem.isOwner && ownerList.push(elem)
        elem.isAdmin && !elem.isOwner && adminsList.push(elem)
        !elem.isAdmin && !elem.isOwner && othersList.push(elem)
    })
    
  return (
    <div className="flex flex-col bg-indigo-500  border-solid border-2 rounded-lg text-white">
      <h1>{channel!.channelId}</h1>
      {userState?.isAdmin && (
        <div className="mx-2 font-sans">
          {`${storage.username} 👑`}
          {channel!.mode === ChannelModes.Public && (
            <button
              onClick={handleSetInvite}
              className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-2 mb-2"
            >
              invite
            </button>
          )}
          {channel!.mode === ChannelModes.Private && (
            <form className="flex flex-row" onSubmit={handleSubmitInvite}>
              <input
                className="basis-2/4 g-indigo-50 border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block my-1 p-2.5"
                name="invite"
                type="text"
                value={form.invite}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-1 my-2 mx-2"
              >
                invite
              </button>
            </form>
          )}
          <form className="flex flex-row" onSubmit={handleSubmitPassword}>
            <input
              className="basis-2/4 h-1/4 bg-indigo-50 border border-indigo-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
              name="password"
              type="text"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-1 my-2 mx-2"
            >
              {channel!?.mode === ChannelModes.Public
                ? "set password"
                : "change password"}
            </button>
          </form>
          {channel!?.mode !== ChannelModes.Public && (
            <button
              className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-2.5 py-1 my-2 mx-2"
              onClick={
                channel!?.mode === ChannelModes.Password
                  ? handleUnsetPassword
                  : handleUnsetPrivMode
              }
            >
              unset Mode ❌
            </button>
          )}
        </div>
      )}
      <div className="mx-2 max-h-48 overflow-auto font-mono ">
        {ownerList.length !== 0 && <h2>Owner</h2>}
        {ownerList.map((elem: ClientElem, index: number) => (
          <UserListElem key={index} client={elem} userState={userState} />
        ))}

        {adminsList.length !== 0 && <h2>Admin</h2>}
        {adminsList.map((elem: ClientElem, index: number) => (
          <UserListElem key={index} client={elem} userState={userState} />
        ))}
        {othersList.length !== 0 && <h2>Others</h2>}
        {othersList.map((elem: ClientElem, index: number) => (
          <UserListElem key={index} client={elem} userState={userState} />
        ))}
      </div>
      <div className="flex justify-between mx-2">
        {userState?.isOwner && (
          <button onClick={handleDelete}>
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
                d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
              />
            </svg>
          </button>
        )}
        <button onClick={handleLeaveChannel}>
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
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
