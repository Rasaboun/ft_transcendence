import React, { useContext, useState } from "react";
import useLocalStorage from "./hooks/localStoragehook";
import "./output.css";
import "./index.css"
import { getUserPhoto, setUsername, setUserPhoto } from "./Requests/users";
import { SocketContext } from "./Context/socketContext";

type settingsForm = {
	username: string,
	image: File,
}

const url: string = "http://localhost:${process.env.BACK_PORT}/users/";
function TabSettings() {
	const { storage, setStorage } = useLocalStorage("user")
	const { setImage } = useContext(SocketContext)
	const defaultValue:settingsForm = {username : storage.username, image: storage.image}
	const [editable, setEditable] = useState(false)
	const [displayedImage, setDisplayedImage] = useState(storage.image)
	const [form, setForm] = useState<settingsForm>(defaultValue)
	const toggle = () => {
		setEditable((prevEditable) => !prevEditable)
	}

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		let img:any;
		if (e.target.files && e.target.files[0]) {
			img = e.target.files[0];
			if (img.size >= 5242880)
			{
				return 
			}
		}
		if (img)
			setDisplayedImage(URL.createObjectURL(img))
		setForm((prevForm) => ({
			...prevForm,
			[e.target.name] : img ? img : e.target.value
		}))
	}

	const submitFormData = async () => {
		console.log(form.username, defaultValue.username)
		if (form.username !== defaultValue.username)
		{
			console.log("username settings", form.username)
			setUsername(storage.login, form.username)
			setStorage("user", {...storage, username: form.username})
		}
		if (form.image !== defaultValue.image)
		{
			console.log(form.image)

			await setUserPhoto(storage.login, form.image)
			//const newPhoto = await getUserPhoto(storage.login);
			//setStorage("user", {...storage, image : newPhoto} )
			setImage(URL.createObjectURL(form.image));
		}
	}

	return (
	<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div className=" px-4 py-6 sm:px-0">
		<div className="bg-indigo-200 shadow overflow-hidden sm:rounded-lg">
			<div className="px-4 py-5 sm:px-6">
			<h3 className="text-lg leading-6 font-medium text-gray-900">
				Personnal Information
			</h3>
			</div>
			<div className="border-t border-gray-200">
			<dl>
				<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-[e.target.name]3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Full name</dt>
				<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
					Rayane Saboundji
				</dd>
				</div>
				<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Login</dt>
				
				<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
					{storage.login}
				</dd>
				</div>
				<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Username</dt>
				<dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
					<input
					type="text"
					name="username"
					value={form.username}
					onChange={handleChange}
					disabled={!editable}
					className="w-1/6 border border-indigo-300 rounded-md text-sm shadow-sm disabled:bg-indigo-50 disabled:text-indigo-500 disabled:border-indigo-200 disabled:shadow-none"
					></input>
					<button
					type="button"
					className="inline-flex justify-between items-center text-white bg-indigo-800 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 focus:outline-none"
					onClick={() => toggle()}
					>
					<svg
						className="w-4 h-4 fill-current mr-2"
						viewBox="0 0 20 20"
					>
						<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
					</svg>
					<p>Edit</p>
					</button>
				</dd>
				</div>
				<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
				<dt className="text-sm font-medium text-gray-500">Avatar</dt>
				<dd className="flex mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 justify-between">
					<img className="h-10 w-10" src={displayedImage} alt="" />
					<input className="inline-flex justify-between items-center text-white bg-indigo-800 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 mb-2 focus:outline-none"
						type="file"
						name="image"
						accept="image/*"
						onChange={handleChange}>
					</input>
				</dd>
				</div>
			</dl>
				{
					JSON.stringify(form) !== JSON.stringify(defaultValue) &&
						<button
							type="button"
							className="inline-flex items-center text-white bg-indigo-800 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 py-2 mr-2 focus:outline-none"
							onClick={() => submitFormData()}
							>
								<p>save</p>
						</button>
				}
				
			</div>
			
		</div>
		
		</div>
	</div>
	);
}

export default function Settings() {
  return (
    <div id="setting-page" className="flex-1">
      <header className="page-header shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="page-title">Settings</h1>
        </div>
      </header>
      <main>
        <TabSettings />
      </main>
    </div>
  );
}
