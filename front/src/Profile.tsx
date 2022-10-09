import React, { useEffect, useState } from "react";
import axios from "axios";
import "./output.css";
import { useParams } from "react-router-dom";
import { Iuser, UserStatus } from "./Utils/type";
import { addFriend, getUserPhoto } from "./Requests/users";
import { getStatus } from "./Utils/utils";
import useLocalStorage from "./hooks/localStoragehook";

const url: string = "http://localhost:3002/users/profile/";


function UserProfile({ user, photo, login }:{user: Iuser, photo: string, login:string}) {

  const handleClick = () => {
    addFriend(login, user.intraLogin)

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
          <p className="mb-1 font-mono text-gray">Wins: {user.victories}</p>
        </div>  
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Looses: {user.nbGames - user.victories}</p>
        </div>
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Haut-Fait: {user.nbGames - user.victories >= user.victories ? "NUL GERMAIN" : "MONSTRUEUX"}</p>
        </div>
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Status: {getStatus(user.status)}</p>
        </div>
        <div className="flex">
          {
            user.intraLogin !== login &&
              <button onClick={() => handleClick()}>add to friend</button>
          }
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { storage } = useLocalStorage("user")
	const { login } = useParams()
	const [user, setUser] = React.useState<Iuser>();
	const data = {login : login}
  const [photo, setPhoto] = useState<string>();

  useEffect(() => {
    if (login)
    {
      const getProfile = async () => {
        const user = await axios.get<Iuser>(url, {params : {login:login}}).then((response) => {
          return response.data;
          
        });
        console.log("User status:", user.status);
        setUser(user);
      }
      
      const getPhoto = async () => {
        
       const file  = await getUserPhoto(login);
       setPhoto(file);
      }
      
      getProfile();
      getPhoto();
    }
  }, [login]);

  return (
    <div id="Profile" className="flex-1">
      <header className="page-header shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="page-title">Profile</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {
            user &&
              <UserProfile user={user} photo={photo!} login={storage.login}/>
          }
        </div>
      </main>
    </div>
  );
}
