import React from 'react';
import ReactDOM from 'react-dom/client';
import './output.css';
import NavBar from './NavBar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import Pong from './Pong';
import Chat from './Chat';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
let rootdiv = document.getElementById("root");
rootdiv?.classList.add("flex");
rootdiv?.classList.add("flex-col"); 
rootdiv?.classList.add("min-h-screen"); 
root.render(
  <BrowserRouter>
    

    <NavBar />
    <Routes>
    <Route path="Dashboard" element={<Dashboard/> }/>
    <Route path="Chat" element={<Chat/>}/>
    <Route path="Pong" element={<Pong/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
