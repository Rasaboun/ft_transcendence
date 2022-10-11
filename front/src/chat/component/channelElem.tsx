import React, { useRef, useContext, useEffect, useState } from "react";
import {
  chatHandler,
  getChatSocket,
  getClientInfo,
  getGameSocket,
  initiateSocket,
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
import { useNavigate } from "react-router-dom";
import InfoMessage from "../Elements/InfoMessage";
import ChannelBoard from "../Elements/channelBoard";
import useLocalStorage from "../../hooks/localStoragehook";
import MessageInput from "./MessageInput";
import { SocketContext } from "../../Context/socketContext";
import InviteMessage from "../Elements/InviteMessage";
import Loader from "../../Elements/loader";
import { Disclosure } from "@headlessui/react";

export default function ChannelElem() {
  const { storage, setStorage } = useLocalStorage("user");
  const { storage2 } = useLocalStorage("channel");
  const navigate = useNavigate();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { chatSocket, setChatSocket, setGameSocket, setNotification } =
    useContext(SocketContext);
  const [form, setForm] = useState({
    message: "",
    invite: "",
    password: "",
  });
  const [messagesList, setMessagesList] = useState<messageT[]>();
  const [userState, setUserState] = useState<UserStateT>();
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

    if (form.message !== "") {
      sendMessage(storage2!.channelId, form.message);
    }

    setForm((oldForm) => ({
      ...oldForm,
      message: "",
    }));
  };

  const handleMessageReceived = (msg: messageT) => {
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

  const handleLeftChannel = (channelInfo: ChannelT) => {
    setStorage("channel", channelInfo);
  };

  const handleChannelJoined = (data: {
    clientId: string;
    channelInfo: ChannelT;
  }) => {
    console.log(data.channelInfo);
    setStorage("channel", data.channelInfo);
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
    console.log("data Client info", data);
    setUserState({
      isOwner: data.isOwner,
      isAdmin: data.isAdmin,
      isMuted: data.isMuted,
      unmuteDate: data.unmuteDate,
    });
    if (data.messages?.length !== 0) {
      setMessagesList(data.messages);
    }
    if (data.unmuteDate !== 0)
      setMutedTime(
        Math.trunc(data.unmuteDate / 1000 - new Date().getTime() / 1000)
      );
  };

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

  const handleConnected = () => {
    console.log("handleConnected");
    const channel = storage2;
    if (channel) {
      console.log(channel);
      getClientInfo(channel.channelId);
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
            ? "message self-end bg-indigo-400"
            : "message self-end bg-indigo-800"
        }
        message={elem}
      />
    ) : (
      <InviteMessage
        key={index}
        className={
          elem.sender?.login === storage.login
            ? "message self-end bg-indigo-400"
            : "message self-end bg-indigo-800"
        }
        message={elem}
      />
    )
  );

  useEffect(() => {
    const channel = storage2;
    initiateSocket("http://localhost:8002");
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
        handleConnected
      );
    }
    if (channel) getClientInfo(channel.channelId);
  }, [chatSocket]);

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
    <Loader condition={chatSocket?.connected}>
      <div className="flex flex-col-reverse sm:flex-row">
        <div className="hidden sm:contents">
          <ChannelBoard userState={userState} />
        </div>
        <div className="sm:hidden">
          <Disclosure>
            {({ open }) => (
              /* Use the `open` state to conditionally change the direction of an icon. */
              <>
              <div className="bg-indigo-600 rounded-lg mx-20 text-white ">
                <Disclosure.Button className="flex w-full justify-between px-2 py-2">
                  <p>Settings</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={open ? "w-5 h-5 rotate-90 transform" : "w-5 h-5"}
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Disclosure.Button>
                </div>
                <Disclosure.Panel>
                <ChannelBoard userState={userState} />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
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
