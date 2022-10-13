import axios from 'axios';
 
export function setAuthToken(token: string): void
{
    console.log('setting auth token ', token);
   if (token) {
       axios.defaults.headers.common["token"] = `${token}`;
   }
   else
       delete axios.defaults.headers.common["token"];
}