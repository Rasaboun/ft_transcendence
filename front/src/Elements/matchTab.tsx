import { Link } from "react-router-dom";
import { Imatch } from "../Utils/type";

type PropsT = {
	matches: Imatch[];
	login:string
}

function TabElement({ match, login }:{match:Imatch, login:string}) {
	

	return (
	  <tr className="bg-white border-b w-full">
		<th scope="row" className="py-4 px-6 font-medium text-gray-900">
		  	{match.winnerLogin === login ? "V" : "D"}
		</th>
		<Link to={"/profile/" + match.playerOneLogin}>
			<td className="py-4 px-6">{match.playerOneLogin}</td>
		</Link>
		<td className="py-4 px-6">{match.playerOneScore}</td>
		<Link to={"/profile/" + match.playerTwoLogin}>
			<td className="py-4 px-6">{match.playerTwoLogin}</td>
		</Link>
		<td className="py-4 px-6">{match.playerTwoScore}</td>
	  </tr>
	);
  }

export default function MatchTab({ matches, login }: PropsT)
{
    return (
		<div className="max-w-7xl h-4/5 mx-auto py-6 sm:px-6 lg:px-8">
			<table className=" w-full text-sm text-left text-gray-500 ">
				<thead className="w-full text-xs text-gray-700 uppercase bg-gray-50">
				<tr className="w-full">
					<th scope="col" className="py-3 px-6 bg-indigo-200 text-gray">
						Result
					</th>
					<th scope="col" className="py-3 px-6 bg-indigo-200 text-gray">
						Player1
					</th>
					<th scope="col" className="py-3 px-6 bg-indigo-300 text-gray">
						Player1 score
					</th>
					<th scope="col" className="py-3 px-6 bg-indigo-200 text-gray">
						Player2
					</th>
					<th scope="col" className="py-3 px-6 bg-indigo-300 text-gray">
						Player2 score
					</th>
				</tr>
				</thead>
				<tbody className=" w-full">
				{matches.map((match, idx) => (
								<TabElement key={idx} match={match} login={login}/>            
				))}
				</tbody>
			</table>
		</div>
    );
}