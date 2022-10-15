import './output.css';
import { Link } from "react-router-dom";
export default function Footer() {
	return (
	  
<footer className="left-0 mt-5 mx-5 p-4 rounded-lg md:flex md:items-center md:justify-between md:p-6 bg-indigo-300">
    <span className="text-sm text-white sm:text-center">© 2022 <a href="#" className="hover:underline">Transcendence Team</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm text-white sm:mt-0">
        <li>
        <Link to="about" className="mr-4 hover:underline md:mr-6 ">About</Link>
        </li>
    </ul>
</footer>

	);  
  }
  