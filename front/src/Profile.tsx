import React, { useEffect, useState } from "react";
import "./output.css";
import { useParams } from "react-router-dom";
import { Imatch, Iuser} from "./Utils/type";
import { addFriend, blockUser, getFriendship, getUserPhoto, getUserProfile, isInBlocklist, removeFriend, unblockUser } from "./Requests/users";
import { getStatus } from "./Utils/utils";
import { getUserMatches } from "./Requests/match";
import { backUrl } from "./Requests/users";
import MatchTab from "./Elements/matchTab";
import useLocalStorage from "./hooks/localStoragehook";


type UserPropsT = {
	user: Iuser,
	photo: string,
	login:string,
	isFriend: boolean,
	setIsFriend:(value:boolean) => void
	isBlocked: boolean,
	setIsBlocked: (value:boolean) => void
}


function UserProfile({ user, photo, login, isFriend, setIsFriend, isBlocked, setIsBlocked }:UserPropsT) {

  const { storage, setStorage } = useLocalStorage("user");

	const friendBtnText = isFriend ? "Remove from Friends" : "Add To Friends"
	const blockBtnText = isBlocked ? "Remove from Blocked" : "Block this user"
	
	const handleFriendBtn = () => {
		if (!isFriend)
		{
			addFriend(login, user.intraLogin);
			setIsFriend(true);
		}
		else
		{
			removeFriend(login, user.intraLogin)
			setIsFriend(false)
		}
	}

	const handleBlockBtn = () => {
		if (!isBlocked)
		{
			blockUser(login, user.intraLogin);
			setIsBlocked(true);

      let newBlocklist: string[] = storage.blockedUsers;
      newBlocklist.push(user.intraLogin);
			setStorage("user", {...storage, blockedUsers: newBlocklist})
		}
		else
		{
			unblockUser(login, user.intraLogin)
			setIsBlocked(false)

      let newBlocklist: string[] = storage.blockedUsers;
      newBlocklist.splice(storage.blockedUsers.indexOf(user.intraLogin), 1);
			setStorage("user", {...storage, blockedUsers: newBlocklist})
		}
	}

  return (
    <div className="flex basis-full flex-col items-center bg-indigo-300 rounded-lg border shadow md:flex-row md:max-w-xl ">
      <img
        className="object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src={photo}
        alt=""
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h1 className="mb-5 text-xl font-sans font-bold tracking-tight text-gray-900">
          {user.username}
        </h1>

        <div className="flex">
          <p className="mb-1 font-mono text-gray">Wins: {user.gameStats.victories}</p>
        </div>  
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Looses: {user.gameStats.defeats}</p>
        </div>
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Rate: {user.gameStats.victories && ((user.gameStats.victories / user.gameStats.nbGames) * 100).toFixed(2)}%</p>
        </div>
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Goal Scored: {user.gameStats.goalsScored}</p>
        </div>
        
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Goal Conceded: {user.gameStats.goalsTaken}</p>
        </div>
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Goal/Games: {user.gameStats.nbGames && (user.gameStats.goalsScored / user.gameStats.nbGames).toFixed(2)}</p>
        </div>
         <div className="flex">
          <p className="mb-1 font-mono text-gray">Status: {getStatus(user.status)}</p>
        </div>
          {
            user.intraLogin !== login &&
            <div className="flex flex-col">
              <button className="bg-green" onClick={() => handleFriendBtn()}>{friendBtnText}</button>
              <button className="bg-red-500" onClick={() => handleBlockBtn()}>{blockBtnText}</button>
            </div>
          }
      </div>
    </div>
  );
}

export default function Profile() {
	const { login } = useParams()
  const { storage, setStorage } = useLocalStorage("user");
	const [matches, setMatches] = React.useState<Imatch[]>();
	const data = {login : login}
	const [user, setUser] = React.useState<Iuser>();
  const [photo, setPhoto] = useState<string>();
  const [isFriend, setIsFriend] = useState<boolean>();
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  useEffect(() => {
    if (login)
    {
        const getProfile = async () => {
        const userData = await getUserProfile(login);
        
        if (!userData)
          return ;

        setUser(userData);
        
        const friendship = await getFriendship(storage.login, login);
        setIsFriend(friendship);


        const blockedBy = await isInBlocklist(storage.login, login);
        setIsBlocked(blockedBy);

      }
        const getMatch = async () => {
			    const url: string = backUrl + "/match/user";
   			  const history  = await getUserMatches(storage.login);
          if (!history)
            return ;
			  setMatches(history);
    	}
         
      const getPhoto = async () => {
        
        const file  = await getUserPhoto(login);
        setPhoto(file);
      }
      
      getProfile();
      getPhoto();
      getMatch()
    }
  }, [login]);

  return (
    <div id="Profile" className="flex-1 h-screen">
      <header className="page-header shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="page-title">Profile</h1>
        </div>
      </header>
      <main className="h-full">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			
          {
            user &&
              <UserProfile user={user} photo={photo!} login={storage.login} isFriend={isFriend!} setIsFriend={setIsFriend} isBlocked={isBlocked} setIsBlocked={setIsBlocked}/>
          }
          {
				  login && matches &&
					  <MatchTab matches={matches} login={login}/>
			    }
        </div>
      </main>
    </div>
  );
}
