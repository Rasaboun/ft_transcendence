import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backUrl, submitFirstRegistration } from "./Requests/users"
import { validUsername } from "./Utils/utils";

type settingsForm = {
	username: string,
	image: File | undefined,
}

function LoginForm() {
    const navigate = useNavigate();

	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState("");
	const [form, setForm] = useState<settingsForm>({
        username: "",
        image: undefined
    })
	

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setForm((prevForm) => ({
			...prevForm,
			username : e.target.value
		}))
		setError(false);
	}

	const submitFormData = async () => {

			setError(false);
			if (!validUsername(form.username))
			{
				setError(true);
				setErrorMessage("Invalid username")
				setForm((prevForm) => ({
					...prevForm,
					username : ""
				}))
				return ;
			}

			const jwtToken = await submitFirstRegistration(form.username)
			if (!jwtToken)
			{
				setError(true);
				setErrorMessage("Username already taken")
				setForm((prevForm) => ({
					...prevForm,
					username : ""
				}))
			}
			else
			{
				Cookies.set('token', jwtToken, { expires: 1});
				
				window.open(backUrl + "/auth/navigate", "_self"); 
				
			}
	}

    useEffect(() => {
        if (Cookies.get('login') === undefined)
            navigate('/Login');
        if (Cookies.get('token'))
            navigate('/Home');
    })

	return (
	<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div className=" px-4 py-6 sm:px-0">
		<div className="bg-indigo-200 shadow overflow-hidden sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6">
			<h3 className="text-lg leading-6 font-medium text-gray-900">
				Choose your username
			</h3>
			</div>
			<div className="border-t border-gray-200">
			<dl>
				<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Username</dt>
				<dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
					<input
					type="text"
					name="username"
					value={form.username}
					onChange={handleChange}
					className="w-3/6 border border-indigo-300 rounded-md text-sm shadow-sm disabled:bg-indigo-50 disabled:text-indigo-500 disabled:border-indigo-200 disabled:shadow-none"
					></input>
					{
						error && (
							<p style={{ color: "rgb(255, 0, 0)" }}>
								{ errorMessage }
							</p>
						)
					}
					<button
					type="button"
					className="inline-flex justify-between items-center text-white bg-indigo-800 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 focus:outline-none"
					onClick={() => submitFormData()}
					>
					<p>Validate</p>
					</button>
				</dd>
				</div>
			</dl>
			</div>
			
		</div>
		
		</div>
	</div>
	);
}

export default function FirstRegistration() {


    
  return (
    <div id="Home" className="flex-1 h-screen">
      <header className="page-header shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="page-title">
            Welcome
          </h1>
        </div>
      </header>
      <main>
        <LoginForm/>
      </main>
    </div>
  );
}
