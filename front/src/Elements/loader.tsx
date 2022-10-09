import { ReactFragment } from 'react';
import { BallTriangle } from 'react-loader-spinner'
import { Socket } from 'socket.io-client';
import "../index.css"

type PropsT = {
	condition: boolean | undefined,
	children: React.ReactNode
}
export default function Loader({ condition, children }: PropsT)
{
	return (
		!condition ?
		<div className='loader'>
			<BallTriangle
				height={100}
				width={100}
				radius={5}
				color="#C4B5FD"
				ariaLabel="ball-triangle-loading"
				wrapperClass=""
				wrapperStyle={{}}
				visible={true}
			/>
		</div> :
		<div>
			{children}
		</div>
	);
}