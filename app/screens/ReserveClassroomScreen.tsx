import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigation, useRoute } from '@react-navigation/native';
import ReservationService from '../services/reservationService';

interface RouteParams {
  classroom: {
    id: number;
    name: string;
    capacity: number;
    equipment: string[];
  };
}

const ReserveClassroomScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { classroom } = route.params as RouteParams;

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleReserve = async () => {
    try {
      await ReservationService.createReservation({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        classroomId: classroom.id,
      });
      Alert.alert('Succès', 'Réservation créée avec succès');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer la réservation');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Réservation de {classroom.name}</Text>
        <Text style={styles.subtitle}>Capacité: {classroom.capacity} personnes</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date et heure de début</Text>
          <Button
            mode="outlined"
            onPress={() => setShowStartPicker(true)}
            style={styles.dateButton}
          >
            {format(startTime, 'PPp', { locale: fr })}
          </Button>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  setStartTime(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date et heure de fin</Text>
          <Button
            mode="outlined"
            onPress={() => setShowEndPicker(true)}
            style={styles.dateButton}
          >
            {format(endTime, 'PPp', { locale: fr })}
          </Button>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="datetime"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  setEndTime(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.equipmentContainer}>
          <Text style={styles.equipmentTitle}>Équipements disponibles :</Text>
          <View style={styles.equipmentList}>
            {classroom.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentItem}>
                <Text style={styles.equipmentText}>• {item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={[styles.button, styles.cancelButton]}
          >
            Annuler
          </Button>
          <Button
            mode="contained"
            onPress={handleReserve}
            style={[styles.button, styles.reserveButton]}
          >
            Confirmer la réservation
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dateButton: {
    borderColor: '#ddd',
  },
  equipmentContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  equipmentItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 8,
  },
  reserveButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
  },
});

export default ReserveClassroomScreen; 