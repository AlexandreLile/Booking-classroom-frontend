import { AuthContextProvider } from "./context/AuthContext";
import MainNavigation from "./navigation/MainNavigation";
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <AuthContextProvider>
        <MainNavigation />
      </AuthContextProvider>
    </PaperProvider>
  );
}
