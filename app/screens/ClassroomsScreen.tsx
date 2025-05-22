import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Card, Button, Chip, Searchbar, Portal, Modal, FAB } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useAuth from "../hooks/useAuth";
import api from "../services/api.service";

interface Classroom {
  id: number;
  name: string;
  capacity: number;
  equipment: string[];
}

type RootStackParamList = {
  ReserveClassroom: { classroom: Classroom };
  AddClassroom: undefined;
  UpdateClassroom: { classroom: Classroom };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ReserveClassroom' | 'AddClassroom' | 'UpdateClassroom'>;

const ClassroomsScreen = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minCapacity, setMinCapacity] = useState<number | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [allEquipment, setAllEquipment] = useState<string[]>([]);
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const navigation = useNavigation<NavigationProp>();

  const fetchAllClassrooms = async () => {
    try {
      const { data } = await api.get("/classrooms");
      setClassrooms(data);
      setFilteredClassrooms(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des salles:", error);
    }
  };

  const fetchAllEquipment = async () => {
    try {
      const { data } = await api.get('/classrooms');
      // Extraire tous les équipements uniques de toutes les salles
      const allEquipment = Array.from(
        new Set(data.flatMap((classroom: { equipment: string[] }) => classroom.equipment))
      ) as string[];
      setAllEquipment(allEquipment);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipements:', error);
    }
  };

  // Rafraîchir les salles et les équipements quand l'écran est focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAllClassrooms();
      fetchAllEquipment();
    }, [])
  );

  useEffect(() => {
    filterClassrooms();
  }, [classrooms, searchQuery, minCapacity, selectedEquipment]);

  const filterClassrooms = () => {
    let filtered = [...classrooms];

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter((classroom) =>
        classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par capacité minimale
    if (minCapacity) {
      filtered = filtered.filter(
        (classroom) => classroom.capacity >= minCapacity
      );
    }

    // Filtre par équipements
    if (selectedEquipment.length > 0) {
      filtered = filtered.filter((classroom) =>
        selectedEquipment.every((equipment) =>
          classroom.equipment.includes(equipment)
        )
      );
    }

    setFilteredClassrooms(filtered);
  };

  const handleReserve = (classroom: Classroom) => {
    navigation.navigate('ReserveClassroom', { classroom });
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((e) => e !== equipment)
        : [...prev, equipment]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMinCapacity(null);
    setSelectedEquipment([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        <Searchbar
          placeholder="Rechercher une salle..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Button
          mode="outlined"
          onPress={() => setShowFilters(true)}
          style={styles.filterButton}
        >
          Filtres
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showFilters}
          onDismiss={() => setShowFilters(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Filtres</Text>
          
          <Text style={styles.filterTitle}>Capacité minimale</Text>
          <View style={styles.capacityContainer}>
            {[5, 10, 20, 30, 50].map((capacity) => (
              <Chip
                key={capacity}
                selected={minCapacity === capacity}
                onPress={() => setMinCapacity(minCapacity === capacity ? null : capacity)}
                style={styles.capacityChip}
              >
                {capacity}+
              </Chip>
            ))}
          </View>

          <Text style={styles.filterTitle}>Équipements</Text>
          <View style={styles.equipmentFilterContainer}>
            {allEquipment.map((equipment) => (
              <Chip
                key={equipment}
                selected={selectedEquipment.includes(equipment)}
                onPress={() => toggleEquipment(equipment)}
                style={styles.equipmentChip}
              >
                {equipment}
              </Chip>
            ))}
          </View>

          <View style={styles.modalActions}>
            <Button onPress={clearFilters}>Réinitialiser</Button>
            <Button mode="contained" onPress={() => setShowFilters(false)}>
              Appliquer
            </Button>
          </View>
        </Modal>
      </Portal>

      <ScrollView style={styles.classroomsContainer}>
        {filteredClassrooms.map((classroom) => (
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
              {isAdmin && (
                <Button 
                  mode="outlined" 
                  onPress={() => navigation.navigate('UpdateClassroom', { classroom })}
                  style={styles.updateButton}
                >
                  Modifier
                </Button>
              )}
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      {isAdmin && (
        <FAB
          icon="plus"
          style={styles.fab}
          color="white"
          onPress={() => navigation.navigate('AddClassroom')}
        />
      )}
    </View>
  );
};

export default ClassroomsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filterButton: {
    marginLeft: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  capacityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  capacityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
  classroomsContainer: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
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
  updateButton: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
  },
});
