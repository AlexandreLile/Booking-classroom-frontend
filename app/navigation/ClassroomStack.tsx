import { createStackNavigator } from "@react-navigation/stack";
import ClassroomsScreen from "../screens/ClassroomsScreen";
import ReserveClassroomScreen from "../screens/ReserveClassroomScreen";
import AddClassroomScreen from "../screens/AddClassroomScreen";
import UpdateClassroomScreen from "../screens/UpdateClassroomScreen";

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
      <Stack.Screen 
        name="AddClassroom" 
        component={AddClassroomScreen}
        options={{ title: "Ajouter une salle" }}
      />
      <Stack.Screen 
        name="UpdateClassroom" 
        component={UpdateClassroomScreen}
        options={{ title: "Modifier une salle" }}
      />
    </Stack.Navigator>
  );
};

export default ClassroomStack; 