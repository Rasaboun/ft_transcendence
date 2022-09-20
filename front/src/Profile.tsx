import React, { useEffect } from "react";
import axios from "axios";
import "./output.css";
import profile from "./profile.png";

const url: string = "http://localhost:3001/users";

interface Iuser {
  id: number;
  photoUrl: string;
}

function UserProfile() {
  return (
    <div className="flex flex-col items-center bg-indigo-300 rounded-lg border shadow md:flex-row md:max-w-xl ">
      <img
        className="object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src={profile}
        alt=""
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h1 className="mb-5 text-xl font-sans font-bold tracking-tight text-gray-900">
          Rasaboun
        </h1>

        <div className="flex">
          <p className="mb-1 font-mono text-gray">Wins: 1</p>
        </div>
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Looses: 1</p>
        </div>
        <div className="flex">
          <p className="mb-1 font-mono text-gray">Haut-Fait: Incroyable</p>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const [users, setUsers] = React.useState<Iuser[]>([]);

  useEffect(() => {
    axios.get(url).then((response) => {
      setUsers(response.data);
    });
  });

  return (
    <div id="Profile" className="flex-1">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl tracking-tight font-bold text-gray-900">
            Profile
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <UserProfile />
        </div>
      </main>
    </div>
  );
}
