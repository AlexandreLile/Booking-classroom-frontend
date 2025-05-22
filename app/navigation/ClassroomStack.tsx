import { createStackNavigator } from "@react-navigation/stack";
import ClassroomsScreen from "../screens/ClassroomsScreen";
import ReserveClassroomScreen from "../screens/ReserveClassroomScreen";

const Stack = createStackNavigator();

const ClassroomStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ClassroomsList" 
        component={ClassroomsScreen}
        options={{ title: "Salles" }}
      />
      <Stack.Screen 
        name="ReserveClassroom" 
        component={ReserveClassroomScreen}
        options={{ title: "Réserver une salle" }}
      />
    </Stack.Navigator>
  );
};

export default ClassroomStack; 