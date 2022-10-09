import { BallTriangle } from 'react-loader-spinner'
import { Socket } from 'socket.io-client';

type PropsT = {
	socket: Socket | undefined,
	children: any 
}
export default function Loader({ socket, children }: PropsT)
{
	return (
		!socket ?
			<BallTriangle
				height={100}
				width={100}
				radius={5}
				color="#4fa94d"
				ariaLabel="ball-triangle-loading"
				wrapperClass={{}}
				wrapperStyle=""
				visible={true}
			/> :
			{children}
	);
}