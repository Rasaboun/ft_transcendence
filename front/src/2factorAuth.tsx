import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backUrl, submitTwoFactorAuthentication } from "./Requests/users";

export default function TwoFactorAuth()
{
    const [code, setCode] = useState<string>("")
    const navigate = useNavigate();

	const sendCode = async () => {
        

        const jwtToken = await submitTwoFactorAuthentication(code);
        if (!jwtToken)
            setCode("Invalid code");
		else
        {
            Cookies.set('token', jwtToken, { expires: 1});
            
            window.open(backUrl + "/auth/navigate", "_self"); 
            
        }
	}

    useEffect(() => {
        if (Cookies.get('login') == undefined)
            navigate('/Login');
        if (Cookies.get('token'))
            navigate('/Home');
    })

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