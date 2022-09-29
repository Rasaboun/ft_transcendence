
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
			<li className="relative p-3 hover:bg-indigo-100 rounded-lg" >
					{children}
			</li>
		</ul>
	)
}