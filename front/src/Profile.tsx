import React, { useEffect } from "react";
import axios from "axios";
import "./output.css";
import profile from "./profile.png";
import { useParams } from "react-router-dom";
import { getParsedCommandLineOfConfigFile } from "typescript";
import { Iuser } from "./Utils/type";
import { getUserProfile } from "./Requests/users";

const url: string = "http://localhost:3002/users/profile/";


function UserProfile({ user }:{user: Iuser}) {
  
  return (
    <div className="flex flex-col items-center bg-indigo-300 rounded-lg border shadow md:flex-row md:max-w-xl ">
      <img
        className="object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src={user.photoUrl}
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
      </div>
    </div>
  );
}

export default function Profile() {
	const { login } = useParams()
	const [user, setUser] = React.useState<Iuser>();
	const data = {login : login}
	// async function getProfile() {
	// 	console.log("Loginr", login);
	// 	await axios.get<Iuser>(url, {params : {login:login}}).then((response) => {
	// 		setUser(response.data);
    //   console.log("Returned user", user);
	// 	});
	// }

  useEffect(() => {
    if (login)
    {
		const getProfile = async () => {
      console.log("In getProfile");
			const user = await axios.get<Iuser>(url, {params : {login:login}}).then((response) => {
				return response.data;
		  	
			});
			setUser(user);
		}
		getProfile()
    }
    console.log(user)
  }, []);

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
              <UserProfile user={user}/>
          }
        </div>
      </main>
    </div>
  );
}
