import { useContext } from "react";
import AuthService from "../services/auth.service";
import AuthContext from "../context/AuthContext";
import { removeToken, saveToken } from "../utils/token-jwt";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const signin = async (credentials: any) => {
    try {
      const response = await AuthService.signin(credentials);
      // console.log("response : ", response);
      setUser(response.user);
      // save token in async storage
      saveToken(response.token);
    } catch (error) {
      console.error(error);
    }
  };

  const signup = async (credentials: any) => {
    try {
      console.log("Tentative d'inscription avec:", credentials);
      const response = await AuthService.signup(credentials);
      console.log("Réponse de l'API:", response);
      setUser(response.user);
      saveToken(response.token);
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  };

  const signout = async () => {
    setUser(null);
    removeToken();
  };

  return { user, signin, signup, signout };
};

export default useAuth;
