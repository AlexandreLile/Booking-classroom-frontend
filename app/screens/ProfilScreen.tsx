import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import UserForm from "../components/user/UserForm";

const ProfilScreen = () => {
  const { signout } = useAuth();

  return (
    <View style={{ padding: 20, gap: 20 }}>
      <Text>Profil</Text>

      <UserForm />

      <Button mode="outlined" onPress={signout}>
        Signout
      </Button>
    </View>
  );
};

export default ProfilScreen;
