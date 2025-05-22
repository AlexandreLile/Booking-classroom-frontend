import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("token");
    console.log("Token stocké:", storedToken); // Pour le débogage
    return storedToken;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
};

export const saveToken = async (token: string) => {
  try {
    console.log("Sauvegarde du token:", token); // Pour le débogage
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du token:", error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
    console.log("Token supprimé"); // Pour le débogage
  } catch (error) {
    console.error("Erreur lors de la suppression du token:", error);
  }
};
