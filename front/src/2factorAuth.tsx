import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "./hooks/localStoragehook";
import { submitTwoFactorAuthentication } from "./Requests/users";

export default function TwoFactorAuth()
{
    const [code, setCode] = useState<string>("")
	const navigate = useNavigate()
	const sendCode = async () => {
        console.log('sending code');
        const isCodeValid = await submitTwoFactorAuthentication(code);
        if (!isCodeValid)
            setCode("Invalid code");
		else
        {
            console.log('In navigate');
            navigate("/");
            
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