import "../App.css"
type PropsT = {
	errorMsg:string
}

export default function ErrorAlert({ errorMsg }: PropsT)
{

	return (
		<div className="alert">
			<strong>SORRY !! </strong> 
			{errorMsg}
		</div>
		
	)
}