import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

interface Classroom {
  id: number;
  name: string;
  capacity: number;
  equipment: string[];
}

const ClassroomsScreen = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("ClassroomsScreen useEffect");
    fetchAllClassrooms();
  }, []);

  const fetchAllClassrooms = async () => {
    const response = await fetch("http://localhost:8000/api/classrooms");
    const data = await response.json();
    console.log(data);
    setClassrooms(data);
  };

  const handleReserve = (classroom: Classroom) => {
    navigation.navigate('ReserveClassroom', { classroom });
  };

  return (
    <View>
      <View style={styles.classroomsContainer}>
        {classrooms.map((classroom) => (
          <Card key={classroom.id} style={styles.card}>
            <Card.Title 
              title={classroom.name} 
              titleStyle={styles.cardTitle}
              subtitle={`Capacité: ${classroom.capacity} personnes`}
            />
            <Card.Content>
              <Text style={styles.equipmentTitle}>Équipements :</Text>
              <View style={styles.equipmentContainer}>
                {classroom.equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentItem}>
                    <Text style={styles.equipmentText}>• {item}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => handleReserve(classroom)}
                style={styles.reserveButton}
              >
                Réserver
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </View>
  );
};

export default ClassroomsScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
  },
  classroomsContainer: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
  },
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  equipmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: "#666",
  },
  reserveButton: {
    marginLeft: 'auto',
    backgroundColor: '#007AFF',
  },
});
