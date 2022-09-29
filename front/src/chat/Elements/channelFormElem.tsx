import { useState } from "react"
import RadioFormElem from "../../Elements/radioFormElem"
import { createChannel } from "../../Utils/socketManager"
import { channelFormT, ChannelModes } from "../ChatUtils/chatType"
import { buttonClass } from '../../Utils/utils';

export default function ChannelFormElem()
{
	const [channelForm, setChannelForm] = useState({
		name: "",
		password: undefined
	})
	const [channelMode, setChannelMode] = useState(ChannelModes.Public)

	const newChannel = (channelForm:channelFormT) => {
		createChannel(channelForm)
	}

	const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
		setChannelForm((oldChannelForm) => ({
			...oldChannelForm,
			[e.target.name]: e.target.name === "mode" ?
				parseFloat(e.target.value) :
				e.target.value 
		}))
    }

    const handleSubmit = (e:React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
		if (channelForm.name !== "" &&
			((channelMode === ChannelModes.Password &&
			channelForm.password &&
			channelForm.password !== "") || 
			channelMode !== ChannelModes.Password))
		{
			newChannel({ ...channelForm, mode: channelMode})
			setChannelForm((oldChannelForm) => ({
				...oldChannelForm,
				name: ""
			}))			
		}
    }
	return (
		<form className="channel-form" onSubmit={handleSubmit}>
			<input name="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
			type="text" value={channelForm.name} onChange={handleChange}/>
			{
				channelMode !== ChannelModes.Password ?
				<RadioFormElem choice={channelMode} setChoice={setChannelMode} options={["Public", "Private", "Password"]}/>
				:
				<div>
					<button onClick={() => {setChannelForm((oldChannelForm) => ({
						...oldChannelForm,
						password: undefined
						}))
						setChannelMode(ChannelModes.Public)
					}} 
						className={buttonClass} >
						unset pass
					</button>
					<input name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
					type="text" value={channelForm.password} onChange={handleChange}/>
				</div>
			}
			<button type="submit" className={buttonClass} >
				Create Channel
			</button>
		</form>
	)
}