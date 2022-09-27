export function getSession()
{
	let sessionId = localStorage.getItem("sessionId");
	let roomId = localStorage.getItem("roomId");
	let sessioninfo;
	if (sessionId && roomId)
	{
		sessionId = JSON.parse(sessionId);
		roomId = JSON.parse(roomId);
		console.log("sessionId", sessionId)
		console.log("roomId", roomId)
		if (sessionId && roomId)
			sessioninfo = {sessionId: sessionId, roomId: roomId}
	}
	return sessioninfo;
}

export function getToken()
{
	return localStorage.getItem("token");
}