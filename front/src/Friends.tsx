import axios from "axios";
import { useEffect, useState } from "react";
import useLocalStorage from "./hooks/localStoragehook";
import { backUrl, getUserFriends, removeFriend } from "./Requests/users";
import { Friend } from "./Utils/type";
import { getStatus } from "./Utils/utils";

type FriendPropsT = {
	friend:Friend,
	login:string
	setFriends: (Friends:Friend[]) => void
}

function FriendsProfile({ friend, login, setFriends } : FriendPropsT) { 
	const handleClick = async () => {
		const newFriends = await removeFriend(login, friend.login)
		console.log(newFriends)
		setFriends(newFriends)
	}

	return (
	  <div className="flex basis-full flex-col items-center bg-indigo-300 rounded-lg border shadow md:flex-row md:max-w-xl ">
		<div className="flex flex-col justify-between p-4 leading-normal">
		  <h1 className="mb-5 text-xl font-sans font-bold tracking-tight text-gray-900">
			{friend.username}
		  </h1>
		  <div className="flex">
			<p className="mb-1 font-mono text-gray">{getStatus(friend.status)}</p>
		  </div>
		  <div className="flex">
			{
				<button onClick={() => handleClick()}>remove from friend</button>
			}
		  </div>
		</div>
	  </div>
	);
  }

export default function Friends() {
	const { storage } = useLocalStorage("user");
	const [friends, setFriends] = useState<Friend[]>();

	useEffect(() => {
		console.log(storage.login)
				const getFriends = async () => {
			const url: string = backUrl + "/users/friendList";
    
			const friendList = await axios.get(url, {params: { login: storage.login }}).then(res => {
				return res.data;
			})
				setFriends(friendList);
			};
			getFriends()
			console.log(friends)
		  }, [])
	useEffect(() => {
			console.log(friends)
	}, [friends])
		  const FriendListELem = friends?.map((elem, idx) => 
		  	<FriendsProfile key={idx} friend={elem} login={storage.login} setFriends={setFriends}/>)
	return (
	  <div id="Friends" className="flex-1 h-3/4">
		<header className="page-header shadow">
		  <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
			<h1 className="page-title">Friends</h1>
		  </div>
		</header>
		<main className="h-full">
		  <div className="max-w-7xl h-4/5 mx-auto py-6 sm:px-6 lg:px-8">
			{
				FriendListELem
			}
		  </div>
		</main>
	  </div>
	);
}