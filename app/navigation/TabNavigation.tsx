import ProfilScreen from "../screens/ProfilScreen";
import ReservationsScreen from "../screens/ReservationsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import ClassroomStack from "./ClassroomStack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

type TabParamList = {
  Classrooms: undefined;
  Reservations: undefined;
  Profil: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigation = () => {
  const screenOptions = ({ route }: BottomTabScreenProps<TabParamList>) => ({
    tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
      let iconName: keyof typeof Ionicons.glyphMap;

      if (route.name === "Classrooms") {
        iconName = focused ? "school" : "school-outline";
      } else if (route.name === "Profil") {
        iconName = focused ? "person" : "person-outline";
      } else if (route.name === "Reservations") {
        iconName = focused ? "calendar" : "calendar-outline";
      } else {
        iconName = "help-circle";
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
  });

  return (
    <Tab.Navigator initialRouteName="Profil" screenOptions={screenOptions}>
      <Tab.Screen 
        name="Classrooms" 
        component={ClassroomStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Reservations" component={ReservationsScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
