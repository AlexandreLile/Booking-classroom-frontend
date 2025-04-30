import { useState, useEffect } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import useAuth from "../../hooks/useAuth";

const UserForm = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: "",
  });

  useEffect(() => {
    if (user) {
      setCredentials({
        email: user.email || "",
        password: "",
        name: user.name || "",
      });
    }
  }, [user]);

  const handleChange = (key: string, value: string) => {
    setCredentials({ ...credentials, [key]: value });
  };

  const handleSubmit = () => {
    console.log("credentials : ", credentials);
  };

  return (
    <View style={{ gap: 10 }}>
      <TextInput
        label="Email"
        value={credentials.email}
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        label="Password"
        value={credentials.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
      />
      <TextInput
        label="Name"
        value={credentials.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <Button mode="contained" onPress={handleSubmit}>
        Submit
      </Button>
    </View>
  );
};

export default UserForm;
