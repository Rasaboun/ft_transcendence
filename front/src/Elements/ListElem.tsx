
function classNames(...classes:any[]) {
	return classes.filter(Boolean).join(' ')
}

type PropsT = {
	children: JSX.Element
}

export default function ChatListElem({ children }: PropsT)
{
	return (
		<ul>
			<li className="relative rounded-md p-3 hover:bg-gray-100" >
					{children}
			</li>
		</ul>
	)
}