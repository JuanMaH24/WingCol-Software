import { jwtDecode } from 'jwt-decode';

export function getUser() {
    try {
        console.log("getting the token");
        const token = localStorage.getItem('access');
        
        if (!token) {
            throw new Error("No token found");
        }
        const decodedToken = jwtDecode(token);
        return decodedToken;
        
    } catch (error) {
        // Lanza el error para que pueda ser manejado en el try/catch de la llamada
        throw new Error("Invalid or missing token");
    }
}