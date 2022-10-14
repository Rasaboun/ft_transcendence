import React, { useEffect } from "react";
import "./output.css";
import { Link } from "react-router-dom";
import { Iuser } from "./Utils/type";
import "./index.css"
import { getUsers } from "./Requests/users";
import useLocalStorage from "./hooks/localStoragehook";

function sortUsers (a:Iuser, b:Iuser)
{
	if (b.gameStats.victories !== a.gameStats.victories)
		return (b.gameStats.victories - a.gameStats.victories)
	return (a.gameStats.defeats - b.gameStats.defeats)
}

function TabElement(props:any) {
  return (
    <tr className="bg-white border-b w-full">
      <th scope="row" className="py-4 px-6 font-medium text-gray-900">
        {props.rank}
      </th>
      <td>
      <Link to={"/profile/" + props.user.intraLogin}>
    	  <p className="py-4 px-6">{props.user.username}</p>
      </Link>
      </td>
      <td className="py-4 px-6">{props.user.gameStats.victories}</td>
      <td className="py-4 px-6">{props.user.gameStats.defeats}</td>
    </tr>
  );
}

function Tabulation() {
  const [users, setUsers] = React.useState<Iuser[]>([]);
  const { storage } = useLocalStorage("user");

  useEffect(() => {
      const fetchUsers = async () => {
        
        const usersData = await getUsers(storage.login);
        if (!usersData)
          return ;
        setUsers(usersData);
      }
      fetchUsers();
  }, [storage.login]);

  return (
    <div className="relative h-full overflow-y-scroll shadow-md sm:rounded-lg">
      <table className=" w-full text-sm text-left text-gray-500 ">
        <thead className="w-full text-xs text-gray-700 uppercase bg-gray-50">
          <tr className="w-full">
            <th scope="col" className="py-3 px-6 bg-indigo-200 text-gray">
              Rank
            </th>
            <th scope="col" className="py-3 px-6 bg-indigo-300 text-gray">
              Name
            </th>
            <th scope="col" className="py-3 px-6 bg-indigo-200 text-gray">
              Win
            </th>
            <th scope="col" className="py-3 px-6 bg-indigo-300 text-gray">
              Loose
            </th>
          </tr>
        </thead>
        <tbody className=" w-full">
        {users.sort(sortUsers).map((user, idx) => (
						<TabElement key={user.id} user={user} rank={idx + 1}/>            
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div id="Dashboard" className="flex-1 h-screen">
      <header className="page-header shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="page-title">Dashboard</h1>
        </div>
      </header>
      <main className="h-full">
        <div className="max-w-7xl h-4/5 mx-auto py-6 sm:px-6 lg:px-8">
          <Tabulation/>
        </div>
      </main>
    </div>
  );
}
