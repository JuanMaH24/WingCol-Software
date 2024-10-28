import { jwtDecode } from 'jwt-decode';

export function getUser() {
    try{
        console.log("getting the token");
        const token = localStorage.getItem('access');
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        return decodedToken;
    }catch(error){
        return Promise.reject(error);
    }
}