import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ReservationService from '../services/reservationService';
import { Reservation } from '../services/reservationService';
import { useFocusEffect } from '@react-navigation/native';

const ReservationsScreen = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await ReservationService.getMyReservations();
      setReservations(data);
    } catch (error: any) {
      if (error.message === "Vous devez être connecté pour voir vos réservations") {
        Alert.alert('Erreur', 'Vous devez être connecté pour voir vos réservations');
      } else {
        Alert.alert('Erreur', error.message || 'Impossible de charger les réservations');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Rafraîchir les réservations quand l'écran est focus
  useFocusEffect(
    React.useCallback(() => {
      fetchReservations();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchReservations();
  }, []);

  const handleDeleteReservation = async (id: number) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cette réservation ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ReservationService.deleteReservation(id);
              fetchReservations();
              Alert.alert('Succès', 'Réservation supprimée avec succès');
            } catch (error: any) {
              if (error.message === "Vous devez être connecté pour supprimer une réservation") {
                Alert.alert('Erreur', 'Vous devez être connecté pour supprimer une réservation');
              } else {
                Alert.alert('Erreur', error.message || 'Impossible de supprimer la réservation');
              }
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement des réservations...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.reservationsContainer}>
        {reservations.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                Vous n'avez aucune réservation pour le moment
              </Text>
            </Card.Content>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id} style={styles.card}>
              <Card.Title
                title={reservation.classroom.name}
                titleStyle={styles.cardTitle}
              />
              <Card.Content>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Début :</Text>
                  <Text style={styles.timeValue}>
                    {format(new Date(reservation.startTime), 'PPp', { locale: fr })}
                  </Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeLabel}>Fin :</Text>
                  <Text style={styles.timeValue}>
                    {format(new Date(reservation.endTime), 'PPp', { locale: fr })}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button
                  mode="contained"
                  onPress={() => handleDeleteReservation(reservation.id)}
                  style={styles.deleteButton}
                  buttonColor="#ff4444"
                >
                  Supprimer
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  reservationsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    width: 60,
  },
  timeValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  emptyCard: {
    marginTop: 16,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 16,
  },
});

export default ReservationsScreen;
