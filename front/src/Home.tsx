import Cookies from "js-cookie";
import  { useEffect } from "react";
import useLocalStorage from "./hooks/localStoragehook";
import "./output.css";
import jwt_decode from 'jwt-decode'
import { setAuthToken } from "./authPage/authUtils/AuthUtils";
import {  homeButtonClass } from "./Utils/utils";
import {  Link } from "react-router-dom";
export type userType = {
  username: string,
  login: string,
  image: string,
  blockedUsers: string[],
  twoAuthEnabled: boolean,
}



export default function Home() {
  
	const {setStorage} = useLocalStorage();
  const { storage } = useLocalStorage("user");

  useEffect(() => {
      if (!storage)
      {
        const token = Cookies.get("token");
        if (token)
        {
            const userData: userType = jwt_decode(token);

            setStorage("user", {
              login: userData.login,
              username: userData.username,
              image: userData.image,
              blockedUsers: userData.blockedUsers,
              twoAuthEnabled: userData.twoAuthEnabled,
            });
            setStorage("token", token);
            setAuthToken(token);
        }
    }
		// eslint-disable-next-line
  }, [])
  

  return (
    <div id="Home" className="flex-1 h-screen">
      <header className="page-header shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="page-title">
            Home
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className=" px-4 py-6 sm:px-0">
            <div className="home-title text-center grid h-screen place-items-center bg-red text-8xl h-96">
              <p className="text-[80px] underline underline-offset-3 text-grey border-solid">ft_transcendence</p>
            </div>
            <Link to='/Chat'>
              <button className={`${homeButtonClass} float-left`}>Start chatting</button>
            </Link>
            <Link to='/Pong'>
              <button className={`${homeButtonClass} float-right`}>Start playing</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
