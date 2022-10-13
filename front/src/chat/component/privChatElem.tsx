import React, { useRef, useContext, useEffect, useState } from "react";
<<<<<<< HEAD
import { blockInChat, chatHandlerPrivEl, getChatInfo, getChatSocket, initiateSocket,  joinPrivChat,  sendPrivMessage, unblockInChat } from "../../Utils/socketManager";
=======
import {
  blockInChat,
  chatHandlerPrivEl,
  getChatInfo,
  getChatSocket,
  initiateSocket,
  sendPrivMessage,
  unblockInChat,
} from "../../Utils/socketManager";
>>>>>>> 92937f731daaeb0bd9c03577e6703bff5ce0a8fd
import Message from "../Elements/message";
import { messageT, MessageTypes, privChatInfo } from "../ChatUtils/chatType";

import InfoMessage from "../Elements/InfoMessage";
import useLocalStorage from "../../hooks/localStoragehook";
import PrivMessageInput from "./privMessageInput";
import { SocketContext } from "../../Context/socketContext";
import "../../output.css";
import { useLocation } from "react-router-dom";

<<<<<<< HEAD
export default function PrivChatElem()
{
    const {chatSocket, setChatSocket, setGameSocket} = useContext(SocketContext)
    const Locationstate = useLocation().state as {chatName: string}
    const lastMessageRef = useRef<HTMLDivElement | null>(null)
    const {storage} = useLocalStorage("user")
	const [form, setForm] = useState({ message:"", })
    const [privChat, setPrivChat] = useState<privChatInfo>();
    const [messagesList, setMessagesList] = useState<messageT[]>()
    const [isBlocked, setIsBlocked] = useState(false);

    const handlePrivChatJoined = (chatInfo: privChatInfo) => {
        setPrivChat(chatInfo);
        setIsBlocked(chatInfo.isBlocked);
        setMessagesList(chatInfo.messages);
	}


    const handleSubmitPrivMessage = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (form.message != "" && privChat)
        {
            sendPrivMessage({chatName: privChat.name, content: form.message})
        }
        setForm((oldForm) => ({
            ...oldForm,
            message: ""
        }))
=======
export default function PrivChatElem() {
  const { chatSocket, setChatSocket, setGameSocket } =
    useContext(SocketContext);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { storage } = useLocalStorage("user");
  const { setStorage } = useLocalStorage();
  const [form, setForm] = useState({ message: "" });
  const { privChat } = useLocalStorage("privChat");
  const [messagesList, setMessagesList] = useState<messageT[]>();
  const [isBlocked, setIsBlocked] = useState(false);

  const handlePrivChatJoined = (chatInfo: privChatInfo) => {
    const { messages, ...privChat } = chatInfo;
    setStorage("privChat", privChat);
    setIsBlocked(chatInfo.isBlocked);
    setMessagesList(chatInfo.messages);
  };

  const handleSubmitPrivMessage = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.message != "") {
      sendPrivMessage({ chatName: privChat.name, content: form.message });
>>>>>>> 92937f731daaeb0bd9c03577e6703bff5ce0a8fd
    }
    setForm((oldForm) => ({
      ...oldForm,
      message: "",
    }));
  };

  const handlePrivMessageReceived = (msg: messageT) => {
    setMessagesList((oldMessagesList) =>
      oldMessagesList === undefined ? [msg] : [...oldMessagesList, msg]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((oldForm) => ({
      ...oldForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChatInfo = (data: privChatInfo) => {
    const { messages, ...privChat } = data;
    setStorage("privChat", privChat);
    setIsBlocked(data.isBlocked);
    if (data.messages?.length !== 0) {
      setMessagesList(data.messages);
    }
  };

<<<<<<< HEAD
    const handleChatInfo = (data:privChatInfo) => {
      
        setPrivChat(data);
        setIsBlocked(data.isBlocked);
        if (data.messages?.length !== 0)
        {
            setMessagesList(data.messages)
        }
        
=======
  const getBlockedSentence = () => {
    if (!isBlocked) return "";
    const blockedList: string[] = privChat.blockedList;
    if (blockedList.length == 2 || blockedList.indexOf(storage.login) == -1) {
      return "You blocked this user";
>>>>>>> 92937f731daaeb0bd9c03577e6703bff5ce0a8fd
    }
    return "This user blocked you";
  };

<<<<<<< HEAD
    const getBlockedSentence = () =>
    {
        if (!isBlocked)
            return "";
        const blockedList: string[] = privChat!.blockedList;
        if (blockedList.length == 2 || blockedList.indexOf(storage.login) == -1)
        {
            return "You blocked this user";
=======
  const messageElem = messagesList?.map((elem, index) =>
    elem.type === MessageTypes.Info ? (
      <InfoMessage key={index} message={elem} />
    ) : (
      <Message
        key={index}
        className={
          elem.sender?.login === storage.login
            ? "message message-right"
            : "message message-left"
>>>>>>> 92937f731daaeb0bd9c03577e6703bff5ce0a8fd
        }
        message={elem}
      />
    )
  );

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  useEffect(() => {
    initiateSocket("http://localhost:8002");
    setChatSocket(getChatSocket());
    if (chatSocket) {
      chatHandlerPrivEl(
        handlePrivMessageReceived,
        handlePrivChatJoined,
        handleChatInfo
      );
    }
<<<<<<< HEAD

     useEffect(() => {
       scrollToBottom()
    }, [messagesList])

    useEffect(() => {
        initiateSocket("http://localhost:8002")
        setChatSocket(getChatSocket())
        if (chatSocket)
        {
           chatHandlerPrivEl(
            handlePrivMessageReceived,
            handlePrivChatJoined,
            handleChatInfo,) 
        }
        joinPrivChat(Locationstate.chatName)
        //getChatInfo(privChat!.name);

    }, [chatSocket])

   return (<div className="chat">
            <h1>Chatting with : {privChat ? privChat.otherUsername : "Change this"}</h1>
            <br/>
            <button style={{
                            height: "3vh",
                            width: "5vh",
                            marginLeft: "40px",
                            backgroundColor: "#00ffff",
                            borderRadius: "20px"
                        }}
                   onClick={() => blockInChat(privChat!.name)}>
                            BLOCK
            </button>
            <button style={{
                        height: "3vh",
                        width: "5vh",
                        marginLeft: "40px",
                        backgroundColor: "#00ffff",
                        borderRadius: "20px"
                    }}
                onClick={() => unblockInChat(privChat!.name)}>
                UNBLOCK
            </button>
            <div className="chat-right">
                <div className="h-96 bg-indigo-100">
                    <div className="message-container">
                        {messageElem}
                        <div ref={lastMessageRef}/>
                    </div>
                </div>
                <PrivMessageInput handleSubmitMessage={handleSubmitPrivMessage}
                    value={form.message} isBlocked={isBlocked} blockedSentence={getBlockedSentence()} handleChange={handleChange}/>
            </div>           
=======
    if (privChat) getChatInfo(privChat.name);
  }, [chatSocket]);

  return (
    <div className="flex flex-row items-center bg-indigo-500  border-solid border-2 rounded-lg text-white">
      <h1>
        Chatting with : {privChat ? privChat.otherUsername : "Change this"}
      </h1>

      <button onClick={() => blockInChat(privChat.name)}>
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
            d="M3 3l8.735 8.735m0 0a.374.374 0 11.53.53m-.53-.53l.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 010 5.304m2.121-7.425a6.75 6.75 0 010 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 01-1.06-2.122m-1.061 4.243a6.75 6.75 0 01-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12z"
          />
        </svg>
      </button>
      <button onClick={() => unblockInChat(privChat.name)}>
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
            d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </button>
      <div className="chat-right">
        <div className="h-96 bg-indigo-50">
          <div className="">
            {messageElem}
            <div ref={lastMessageRef} />
          </div>
>>>>>>> 92937f731daaeb0bd9c03577e6703bff5ce0a8fd
        </div>
        <PrivMessageInput
          handleSubmitMessage={handleSubmitPrivMessage}
          value={form.message}
          isBlocked={isBlocked}
          blockedSentence={getBlockedSentence()}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}
