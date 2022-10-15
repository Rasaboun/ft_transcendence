import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export { PrivateRoute };

function PrivateRoute() {
    return (
                !Cookies.get('token') ?
					<Navigate to='/login'/> :  <Outlet/>
    );
}