import React from 'react';
import './output.css';

export default function Footer() {
	return (
	  
<footer className="flex-none mb-8 mx-8 p-4 bg-white rounded-lg md:flex md:items-center md:justify-between md:p-6 bg-indigo-300">
    <span className="text-sm text-white sm:text-center">© 2022 <a href="#" className="hover:underline">Transcendance Team</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm text-white sm:mt-0">
        <li>
            <a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>
        </li>
        <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" className="mr-4 hover:underline md:mr-6">Licensing</a>
        </li>
        <li>
            <a href="#" className="hover:underline">Contact</a>
        </li>
    </ul>
</footer>

	);  
  }
  