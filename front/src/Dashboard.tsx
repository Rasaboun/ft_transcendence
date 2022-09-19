import React, { useEffect } from "react";
import axios from "axios";
import "./output.css";

const url: string = "http://localhost:3001/users";

interface Iuser {
  id: number;
  photoUrl: string;
}

function TabElement() {
  return (
    <tr className="bg-white border-b w-full">
      <th
        scope="row"
        className="py-4 px-6 font-medium text-gray-900"
      >
        1
      </th>
      <td className="py-4 px-6">Rasaboun</td>
      <td className="py-4 px-6">1</td>
      <td className="py-4 px-6">0</td>
      <td className="py-4 px-6">21</td>
    </tr>
  );
}

function Tabulation() {
  return (
    <div className="relative h-2/4 overflow-y-scroll shadow-md sm:rounded-lg">
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
            <th scope="col" className="py-3 px-6 bg-indigo-200 text-gray">
              lvl
            </th>
          </tr>
        </thead>
        <tbody className=" w-full">
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
          <TabElement/>
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const [users, setUsers] = React.useState<Iuser[]>([]);

  useEffect(() => {
    axios.get(url).then((response) => {
      setUsers(response.data);
    });
  });

  return (
    <div id="Dashboard" className="flex-1">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl tracking-tight font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl h-screen mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}

          <Tabulation />

          {/* /End replace */}
        </div>
      </main>
    </div>
  );
}
