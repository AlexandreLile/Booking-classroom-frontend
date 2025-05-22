import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Reservation } from '../services/reservationService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationListProps {
  reservations: Reservation[];
  onDeleteReservation: (id: number) => void;
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations, onDeleteReservation }) => {
  const renderReservation = ({ item }: { item: Reservation }) => (
    <View style={styles.reservationCard}>
      <View style={styles.reservationInfo}>
        <Text style={styles.classroomName}>{item.classroom.name}</Text>
        <Text style={styles.timeText}>
          {format(new Date(item.startTime), 'PPp', { locale: fr })} - {' '}
          {format(new Date(item.endTime), 'p', { locale: fr })}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteReservation(item.id)}
      >
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={reservations}
      renderItem={renderReservation}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Aucune réservation trouvée</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationInfo: {
    flex: 1,
  },
  classroomName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
});

export default ReservationList; 