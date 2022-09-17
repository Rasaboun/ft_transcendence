import { Outlet, Navigate } from 'react-router-dom';
import useLocalStorage from './hooks/localStoragehook';

export { PrivateRoute };

function PrivateRoute() {
    const { storage } = useLocalStorage("token");
	console.log(storage)
    return (
				!storage ?
					<Navigate to='/login'/> :  <Outlet/>
    );
}