import React, { useRef, useContext, useEffect, useState } from "react";
import {
  chatHandler,
  getChannelInfo,
  getChatSocket,
  getClientInfo,
  getGameSocket,
  initiateSocket,
  leaveChannel,
  sendMessage,
} from "../../Utils/socketManager";
import Message from "../Elements/message";
import {
  ActionOnUser,
  ChannelT,
  ClientInfoT,
  messageT,
  MessageTypes,
  UserStateT,
} from "../ChatUtils/chatType";
import { useNavigate, useLocation } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";
import ChannelBoard from "../Elements/channelBoard";
import useLocalStorage from "../../hooks/localStoragehook";
import MessageInput from "./MessageInput";
import { SocketContext } from "../../Context/socketContext";
import InviteMessage from "../Elements/InviteMessage";
import Loader from "../../Elements/loader";
import { Disclosure } from "@headlessui/react";
import { channel } from "diagnostics_channel";

export default function ChannelElem() {
  const { storage, setStorage } = useLocalStorage("user");
  const navigate = useNavigate();
  const Locationstate = useLocation().state as {channelName: string}
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { chatSocket, setChatSocket, setGameSocket } = useContext(SocketContext);
  const [form, setForm] = useState({
    message: "",
    invite: "",
    password: "",
  });
  const [messagesList, setMessagesList] = useState<messageT[]>();
  const [userState, setUserState] = useState<UserStateT>();
  const [channelInfo, setChannelInfo] = useState<ChannelT>();
  const [mutedTime, setMutedTime] = useState(0);

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((oldForm) => ({
      ...oldForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitMessage = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.message !== "" && channelInfo) {
      sendMessage(channelInfo.channelId, form.message);
    }

    setForm((oldForm) => ({
      ...oldForm,
      message: "",
    }));
  };

  const handleMessageReceived = (msg: messageT) => {

    const blockedUsers: string[] = storage.blockedUsers;
    if (blockedUsers.indexOf(msg.sender!.login) != -1)
      return ;
    
    setMessagesList((oldMessagesList) =>
      oldMessagesList === undefined ? [msg] : [...oldMessagesList, msg]
    );
  };

  const upgradeToOwner = (channelName: string) => {
    const message = `You are now Owner`;
    setUserState((oldUserState) => ({
      ...oldUserState!,
      isOwner: true,
      isAdmin: true,
    }));
    setMessagesList((oldMessagesList) =>
      oldMessagesList === undefined
        ? [{ content: message, type: MessageTypes.Info }]
        : [...oldMessagesList, { content: message, type: MessageTypes.Info }]
    );
  };

  const handleLeftChannel = (data: {login: string, channelInfo: ChannelT}) => {
    console.log('left channel', data);
    if (data.login == storage.login)
    {
      leaveChannel(data.channelInfo.channelId);
      navigate("/chat");
    }
    setStorage("channel", data.channelInfo);
  };

  const handleChannelJoined = (data: {
    clientId: string;
    channelInfo: ChannelT;
  }) => {
    console.log(data.channelInfo)
    if (data.channelInfo.channelId != channelInfo?.channelId)
    {
      getChannelInfo(data.channelInfo?.channelId);
      getClientInfo(data.channelInfo?.channelId);
    }
  };

  const handleIsAlreadyAdmin = () => {
    const message = `Is already admin`;
    setMessagesList((oldMessagesList) =>
      oldMessagesList === undefined
        ? [{ content: message, type: MessageTypes.Info }]
        : [...oldMessagesList, { content: message, type: MessageTypes.Info }]
    );
  };

  const handleChannelDeleted = (message: string) => {
    console.log("In channeldeleted");
    navigate("/chat");
  };

  const handleClientInfo = (data: ClientInfoT) => {
    setUserState({
      isOwner: data.isOwner,
      isAdmin: data.isAdmin,
      isMuted: data.isMuted,
      unmuteDate: data.unmuteDate,
    });
    setMessagesList(data.messages);
    if (data.unmuteDate !== 0)
      setMutedTime(
        Math.trunc(data.unmuteDate / 1000 - new Date().getTime() / 1000)
      );
  };

  const handleChannelInfo = (info:ChannelT) => {
    setChannelInfo(info)
  }

  const handleAddAdmin = (data: { target: string; channelInfo: ChannelT }) => {
    setStorage("channel", data.channelInfo);
    if (data.target === storage.login) {
      setUserState((oldUserState) => ({
        ...oldUserState!,
        isAdmin: true,
      }));
    }
  };

  const handleBannedFromChannel = (data: ActionOnUser) => {
    console.log("Banned data", data);
    const message =
      data.targetId === storage.login
        ? "You have been banned from the chat"
        : `${data.targetId} has been banned from the chat`;
    setMessagesList((oldMessagesList) =>
      oldMessagesList === undefined
        ? [{ content: message, type: MessageTypes.Info }]
        : [...oldMessagesList, { content: message, type: MessageTypes.Info }]
    );
    setUserState((oldUserState) => ({
      ...oldUserState!,
      unbanDate: data.duration,
    }));
    if (data.targetId === storage.login) navigate("/chat");
  };

  const handleMutedFromChannel = (data: ActionOnUser) => {
    const message =
      data.targetId === storage.login
        ? `You have been muted for ${data.duration} sec`
        : `${data.targetId} has been muted for ${data.duration} sec`;
    setMessagesList((oldMessagesList) =>
      oldMessagesList === undefined
        ? [{ content: message, type: MessageTypes.Info }]
        : [...oldMessagesList, { content: message, type: MessageTypes.Info }]
    );
    if (data.targetId === storage.login) {
      setUserState((oldUserState) => ({
        ...oldUserState!,
        isMuted: true,
        unmuteDate: data.duration,
      }));
      setMutedTime(data.duration);
    }
  };

  const messageElem = messagesList?.map((elem, index) =>
    elem.type === MessageTypes.Info ? (
      <InfoMessage key={index} message={elem} />
    ) : elem.type === MessageTypes.Message ? (
      <Message
        key={index}
        className={
          elem.sender?.login === storage.login
            ? "message  self-end bg-indigo-400"
            : "message self-start bg-indigo-800"
        }
        message={elem}
      />
    ) : (
      <InviteMessage
        key={index}
        className={
          elem.sender?.login === storage.login
            ? "message  self-end bg-indigo-400"
            : "message self-start bg-indigo-800"
        }
        message={elem}
      />
    )
  );

  function isStateOk(obj: any): obj is {ChannelName:string} {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'ChannelName' in obj
    );
  }
  

  useEffect(() => {
    initiateSocket("http://localhost:${process.env.REACT_APP_SOCKET_PORT}");
    setChatSocket(getChatSocket());
    setGameSocket(getGameSocket());
    if (chatSocket) {
      chatHandler(
        handleMessageReceived,
        handleChannelDeleted,
        handleClientInfo,
        handleBannedFromChannel,
        handleMutedFromChannel,
        handleAddAdmin,
        handleLeftChannel,
        upgradeToOwner,
        handleIsAlreadyAdmin,
        handleChannelJoined,
        handleChannelInfo
      );
    }
      console.log(Locationstate)
      getChannelInfo(Locationstate.channelName);
      getClientInfo(Locationstate.channelName);
  }, [chatSocket?.connected]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  useEffect(() => {
    if (mutedTime > 0) {
      const intervalId = setInterval(
        () => setMutedTime((oldMutedTime) => oldMutedTime - 1),
        1000
      );
      return () => clearInterval(intervalId);
    }
  }, [mutedTime]);

  return (
	<Loader condition={chatSocket?.connected && channelInfo !== undefined}>
		<div className="flex flex-col-reverse md:flex-row">
			
			<ChannelBoard userState={userState} channel={channelInfo} setChannelInfo={setChannelInfo}/>
			
			<div className="chat-right bg-indigo-50">
			<div className="h-96 ">
				<div className="message-container">
				{messageElem}
				<div ref={lastMessageRef} />
				</div>
			</div>
			<MessageInput
				mutedTime={mutedTime}
				handleChange={handleChange}
				handleSubmitMessage={handleSubmitMessage}
				value={form.message}
			/>
			</div>
		</div>
	</Loader>
  );
}
