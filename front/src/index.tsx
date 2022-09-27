import ReactDOM from 'react-dom/client';
import './output.css';

import reportWebVitals from './reportWebVitals';
import App from './App';
import { SocketContextProvider } from './Context/socketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
let rootdiv = document.getElementById("root");
rootdiv?.classList.add("flex");
rootdiv?.classList.add("flex-col"); 
rootdiv?.classList.add("h-screen");
root.render(
	<SocketContextProvider>
		<App />
	</SocketContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
