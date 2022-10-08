import { Outlet, Navigate } from 'react-router-dom';
import useLocalStorage from './hooks/localStoragehook';
import Cookies from 'js-cookie';
export { PrivateRoute };

function PrivateRoute() {
	console.log("cookie",  Cookies.get('token'));
    return (
                !Cookies.get('token') ?
					<Navigate to='/login'/> :  <Outlet/>
    );
}