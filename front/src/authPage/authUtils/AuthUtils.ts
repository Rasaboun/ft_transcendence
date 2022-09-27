import axios from 'axios';
 
export function setAuthToken(token: string): void
{
   if (token) {
       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
   }
   else
       delete axios.defaults.headers.common["Authorization"];
}