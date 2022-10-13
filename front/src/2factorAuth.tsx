import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userType } from "./Home";
import useLocalStorage from "./hooks/localStoragehook";
import { submitTwoFactorAuthentication } from "./Requests/users";
import jwt_decode from 'jwt-decode'
import { setAuthToken } from "./authPage/authUtils/AuthUtils";

export default function TwoFactorAuth()
{
	const {setStorage} = useLocalStorage();
    const [code, setCode] = useState<string>("")
	const navigate = useNavigate()
    const { storage } = useLocalStorage("user");

	const sendCode = async () => {
        
        const token = Cookies.get("token");
        if (!token)
            return ;
        const userData: userType = jwt_decode(token);  
        
        const isCodeValid = await submitTwoFactorAuthentication(userData.login, code);
        
        if (!isCodeValid)
            setCode("Invalid code");
		else
        {
            setStorage("user", {
                login: userData.login,
                username: userData.username,
                image: userData.image,
                twoAuthEnabled: userData.twoAuthEnabled,
            });
            setStorage("token", token);
            setAuthToken(token);
            navigate('/Dashboard');
            
        }
	}

    return (
        <div className="flex flex-col justify-center items-center">
            <input className="border border-indigo-300 rounded-md text-sm shadow-sm disabled:bg-indigo-50 disabled:text-indigo-500 disabled:border-indigo-200 disabled:shadow-none"
                type="text"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}>
            </input>
            <button
                type="button"
                className="inline-flex justify-center items-center text-white bg-indigo-800 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 focus:outline-none"
                onClick={() => sendCode()}
                >Send Code</button>
        </div>
    );
}