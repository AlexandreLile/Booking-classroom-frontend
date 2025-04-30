import { useState } from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
  const { signup } = useAuth();
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!credentials.email) {
      setError("L'email est requis");
      return false;
    }
    if (!credentials.password) {
      setError("Le mot de passe est requis");
      return false;
    }
    if (credentials.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    return true;
  };

  const handleChange = (key: string, value: string) => {
    setCredentials({ ...credentials, [key]: value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      await signup(credentials);
    } catch (error: any) {
      console.log("Erreur détaillée:", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.errors) {
        const firstError = error.response.data.errors[0];
        setError(firstError.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Inscription
      </Text>

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      <TextInput
        label="Nom"
        value={credentials.name}
        onChangeText={(value) => handleChange("name", value)}
        disabled={isLoading}
      />

      <TextInput
        label="Email"
        value={credentials.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isLoading}
      />

      <TextInput
        label="Mot de passe"
        value={credentials.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        disabled={isLoading}
      />

      <Button 
        mode="contained" 
        onPress={handleSubmit} 
        style={{ marginTop: 10 }}
        loading={isLoading}
        disabled={isLoading}
      >
        S'inscrire
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Signin")}
        style={{ marginTop: 10 }}
        disabled={isLoading}
      >
        Déjà un compte ? Se connecter
      </Button>
    </View>
  );
};

export default SignupScreen; 