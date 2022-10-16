import { useContext, useEffect } from "react";
import { SocketContext } from "./Context/socketContext";
import {
  getChatSocket,
  getGameSocket,
  initiateSocket,
} from "./Utils/socketManager";
import {  Link } from "react-router-dom";

export default function ErrorPage() {
  const { chatSocket, setChatSocket, setGameSocket, gameSocket } =
    useContext(SocketContext);
  useEffect(() => {
    initiateSocket();
    setChatSocket(getChatSocket());
    setGameSocket(getGameSocket());

    // eslint-disable-next-line
  }, [chatSocket?.connected, gameSocket?.connected]);
  return (
    <div
      className="
    flex
    items-center
    justify-center
    w-screen
    h-screen
    bg-indigo-100
  "
    >
      <div className="px-40 py-20 bg-white rounded-md shadow-xl">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-indigo-600 text-9xl">404</h1>

          <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
            <span className="text-indigo-500">Oops!</span> Page not found
          </h6>

          <p className="mb-8 text-center text-gray-500 md:text-lg">
            The page you’re looking for doesn’t exist.
          </p>

          <Link
            to="/"
            className="focus:outline-none text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 ml-5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
