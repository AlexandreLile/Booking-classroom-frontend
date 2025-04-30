import api from "./api.service";

const ENDPOINT = "/auth/signin";
const SIGNUP_ENDPOINT = "/auth/signup";

const signin = async (credentials: any) => {
  const response = await api.post(ENDPOINT, credentials);
  return response.data;
};

const signup = async (credentials: any) => {
  try {
    const response = await api.post(SIGNUP_ENDPOINT, credentials);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }
    throw new Error("Une erreur est survenue lors de l'inscription");
  }
};

const AuthService = {
  signin,
  signup,
};

export default AuthService;
