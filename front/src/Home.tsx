import Cookies from "js-cookie";
import React, { useEffect } from "react";
import useLocalStorage from "./hooks/localStoragehook";
import "./output.css";
import jwt_decode from 'jwt-decode'
import { setAuthToken } from "./authPage/authUtils/AuthUtils";
import { useLocation, useNavigate } from "react-router-dom";

export type userType = {
  username: string,
  login: string,
  image: string,
  twoAuthEnabled: boolean,
}



export default function Home() {
  
	const {setStorage} = useLocalStorage();
  const { storage } = useLocalStorage("user");
  const navigate = useNavigate();
  const state = useLocation().state as boolean;

  useEffect(() => {
      if (!storage)
      {
        const token = Cookies.get("token");
        console.log("token", token);
      if (token)
      {
          const userData: userType = jwt_decode(token);
          
          console.log('in useffect', userData);
          if (userData.twoAuthEnabled)
          {
            console.log('in navigate');
            navigate('TwoFactorAuth');
            return ;
          }
          console.log("UserData", userData);
          setStorage("user", {
            login: userData.login,
            username: userData.username,
            image: userData.image,
            twoAuthEnabled: userData.twoAuthEnabled,
          });
          setStorage("token", token);
          setAuthToken(token);
      }
    }
  }, [])
  

  return (
    <div id="Home" className="flex-1">
      <header className="page-header shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="page-title">
            Home
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your Chat */}
          <div className=" px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96"></div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  );
}
