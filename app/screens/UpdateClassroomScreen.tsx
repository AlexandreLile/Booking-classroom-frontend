import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, Text, Chip, Checkbox, Divider, Snackbar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../hooks/useAuth';

interface RouteParams {
  classroom: {
    id: number;
    name: string;
    capacity: number;
    equipment: string[];
  };
}

const UpdateClassroomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { classroom } = route.params as RouteParams;
  const { user } = useAuth();
  const [name, setName] = useState(classroom.name);
  const [capacity, setCapacity] = useState(classroom.capacity.toString());
  const [equipment, setEquipment] = useState<string[]>(classroom.equipment);
  const [newEquipment, setNewEquipment] = useState('');
  const [existingEquipment, setExistingEquipment] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      navigation.goBack();
      return;
    }
    fetchExistingEquipment();
  }, [user]);

  const fetchExistingEquipment = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/classrooms');
      const data = await response.json();
      const allEquipment = Array.from(
        new Set(data.flatMap((classroom: { equipment: string[] }) => classroom.equipment))
      ) as string[];
      setExistingEquipment(allEquipment);
    } catch (error) {
      console.error('Erreur lors de la récupération des équipements:', error);
    }
  };

  const handleAddEquipment = () => {
    if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
      setEquipment([...equipment, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const handleRemoveEquipment = (item: string) => {
    setEquipment(equipment.filter(e => e !== item));
  };

  const toggleEquipment = (item: string) => {
    if (equipment.includes(item)) {
      handleRemoveEquipment(item);
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validation
      if (!name.trim()) {
        setError('Le nom de la salle est requis');
        return;
      }

      if (!capacity.trim() || isNaN(parseInt(capacity)) || parseInt(capacity) <= 0) {
        setError('La capacité doit être un nombre positif');
        return;
      }

      if (equipment.length === 0) {
        setError('Veuillez sélectionner au moins un équipement');
        return;
      }

      // Récupérer le token depuis AsyncStorage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour modifier une salle');
        return;
      }

      const requestData = {
        name: name.trim(),
        capacity: parseInt(capacity),
        equipment,
      };

      console.log('Envoi des données:', requestData);

      try {
        const response = await fetch(`http://localhost:8000/api/classrooms/${classroom.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        console.log('Réponse du serveur:', data);

        if (response.ok) {
          navigation.goBack();
        } else {
          const errorMessage = data.error || data.message || 'Erreur lors de la modification de la salle';
          console.error('Erreur serveur:', errorMessage);
          setError(errorMessage);
        }
      } catch (fetchError) {
        console.error('Erreur de requête:', fetchError);
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
          setError('Une erreur est survenue lors de la communication avec le serveur');
        }
      }
    } catch (error) {
      console.error('Erreur complète:', error);
      if (error instanceof Error) {
        setError(`Erreur: ${error.message}`);
      } else {
        setError('Une erreur inattendue est survenue');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Modifier la salle</Text>

        <TextInput
          label="Nom de la salle"
          value={name}
          onChangeText={setName}
          style={styles.input}
          error={!!error && !name.trim()}
        />

        <TextInput
          label="Capacité"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="numeric"
          style={styles.input}
          error={!!error && (!capacity.trim() || isNaN(parseInt(capacity)) || parseInt(capacity) <= 0)}
        />

        <View style={styles.equipmentSection}>
          <Text style={styles.sectionTitle}>Équipements existants</Text>
          <View style={styles.existingEquipmentList}>
            {existingEquipment.map((item, index) => (
              <View key={index} style={styles.checkboxContainer}>
                <Checkbox
                  status={equipment.includes(item) ? 'checked' : 'unchecked'}
                  onPress={() => toggleEquipment(item)}
                />
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Ajouter un nouvel équipement</Text>
          <View style={styles.equipmentInput}>
            <TextInput
              label="Nouvel équipement"
              value={newEquipment}
              onChangeText={setNewEquipment}
              style={styles.equipmentTextInput}
            />
            <Button mode="contained" onPress={handleAddEquipment}>
              Ajouter
            </Button>
          </View>

          {equipment.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Équipements sélectionnés</Text>
              <View style={styles.equipmentList}>
                {equipment.map((item, index) => (
                  <Chip
                    key={index}
                    onClose={() => handleRemoveEquipment(item)}
                    style={styles.equipmentChip}
                  >
                    {item}
                  </Chip>
                ))}
              </View>
            </>
          )}
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={loading}
          loading={loading}
        >
          Mettre à jour la salle
        </Button>
      </View>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        action={{
          label: 'OK',
          onPress: () => setError(null),
        }}
        duration={5000}
      >
        {error}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  equipmentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  existingEquipmentList: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  equipmentText: {
    marginLeft: 8,
    fontSize: 16,
  },
  divider: {
    marginVertical: 16,
  },
  equipmentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  equipmentTextInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentChip: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
  },
});

export default UpdateClassroomScreen; 