import { jwtDecode } from "jwt-decode";

export const getUser = () => {
  const token = localStorage.getItem("access");
  if (token && typeof token === "string") {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
};
