import Cookies from "js-cookie";
import useLocalStorage from "../hooks/localStoragehook";

export function getSession()
{
	let sessionId = localStorage.getItem("sessionId");
	let roomId = localStorage.getItem("roomId");
	let sessioninfo;
	if (sessionId && roomId)
	{
		sessionId = JSON.parse(sessionId);
		roomId = JSON.parse(roomId);
		if (sessionId && roomId)
			sessioninfo = {sessionId: sessionId, roomId: roomId}
	}
	return sessioninfo;
}

export function getToken(): string | undefined
{
	const token = Cookies.get("token");
	if (token == undefined || token == null)
		return undefined
	return `"${token}"`;
}

export const buttonClass = "text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 shadow-lg shadow-indigo-500/50 dark:shadow-lg dark:shadow-indigo-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"