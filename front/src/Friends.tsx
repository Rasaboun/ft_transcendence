import { useEffect, useState } from "react";
import Loader from "./Elements/loader";
import useLocalStorage from "./hooks/localStoragehook";
import {  getUserFriends, removeFriend } from "./Requests/users";
import { Friend } from "./Utils/type";
import { getStatus } from "./Utils/utils";
import "./App.css"
type FriendPropsT = {
	friend:Friend,
	login:string
	setFriends: (Friends:Friend[]) => void
}

function FriendsProfile({ friend, login, setFriends } : FriendPropsT) { 
	const handleClick = async () => {
		const newFriends = await removeFriend(login, friend.login)
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
		const getFriends = async () => {

			const friendList = await getUserFriends(storage.login);
			setFriends(friendList);
		};	
		getFriends()
		// eslint-disable-next-line
	}, [])
		  const FriendListELem = friends?.map((elem, idx) => 
		  	<FriendsProfile key={idx} friend={elem} login={storage.login} setFriends={setFriends}/>)
	return (
		<div className="h-screen">
			<div id="Friends" className="flex-1 h-3/4">
				<header className="page-header shadow">
					<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
						<h1 className="page-title">Friends</h1>
					</div>
				</header>
				<Loader condition={friends !== undefined}>
					{
						friends?.length === 0 ?
						<div className="flex flex-col mx-auto">
							<svg xmlns="http://www.w3.org/2000/svg" width="" height="250" viewBox="0 0 24 24">
							<path d="M18.414 10.727c.17 1.304-1.623 2.46-2.236 3.932-.986 2.479 2.405 3.747 3.512 1.4.931-1.974-.454-4.225-1.276-5.332zm.108 3.412c-.407.428-.954.063-.571-.408.227-.28.472-.646.667-1.037.128.338.236 1.097-.096 1.445zm-.522-4.137l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002zm-7 0l-.755.506s-.503-.948-1.746-.948c-1.207 0-1.745.948-1.745.948l-.754-.506c.281-.748 1.205-2.002 2.499-2.002 1.295 0 2.218 1.254 2.501 2.002zm1-10.002c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm3.582-4.057c-.303.068-.645.076-1.023-.003-.903-.19-1.741-.282-2.562-.282-.819 0-1.658.092-2.562.282-1.11.233-1.944-.24-2.255-1.015-.854-2.131 1.426-3.967 4.816-3.967 1.207 0 2.245.22 3.062.588-.291.522-.44.912-.515 1.588-1.797-.874-6.359-.542-5.752 1.118.138.377 1.614-.279 3.205-.279 1.061 0 2.039.285 2.633.373.162.634.415 1.116.953 1.597z"/></svg>
							<h1 className="no-friends">You have no friends</h1>
						</div>: 
							
								<main className="h-full">
								<div className="max-w-7xl h-4/5 mx-auto py-6 sm:px-6 lg:px-8">
									{
										FriendListELem
									}
								</div>
								</main>
					}
					
				</Loader>
			</div>

		</div>
		
		
	);
}