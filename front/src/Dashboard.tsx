import React, { useEffect } from "react";
import axios from "axios";
import "./output.css";

const url: string = "http://localhost:3002/users/";

interface Iuser {
  id: number;
  photoUrl: string;
  username: string;
  victories: number;
  defeats: number;
}

function TabElement(props:any) {
  return (
    <tr className="bg-white border-b w-full">
      <th scope="row" className="py-4 px-6 font-medium text-gray-900">
        *
      </th>
      <td className="py-4 px-6">{props.user.username}</td>
      <td className="py-4 px-6">{props.user.victories}</td>
      <td className="py-4 px-6">{props.user.defeats}</td>
    </tr>
  );
}

function Tabulation() {
  const [users, setUsers] = React.useState<Iuser[]>([]);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        setUsers(response.data);
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        {users.map((user) => (
            <TabElement key={user.id} user={user}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div id="Dashboard" className="flex-1 h-3/4">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl tracking-tight font-bold text-gray-900">
            Dashboard
          </h1>
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
