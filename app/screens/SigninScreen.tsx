import { useState } from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const SigninScreen = () => {
  const { signin } = useAuth();
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (key: string, value: string) => {
    setCredentials({ ...credentials, [key]: value });
  };

  //  handlesubmit
  const handleSubmit = async () => {
    await signin(credentials);
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Connexion
      </Text>

      {/* input email */}
      <TextInput
        label="Email"
        value={credentials.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {/* input password */}
      <TextInput
        label="Password"
        value={credentials.password}
        secureTextEntry={true}
        onChangeText={(value) => handleChange("password", value)}
      />
      {/* submit button */}
      <Button mode="contained" onPress={handleSubmit}>
        Se connecter
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Signup")}
        style={{ marginTop: 10 }}
      >
        Pas encore de compte ? S'inscrire
      </Button>
    </View>
  );
};

export default SigninScreen;
