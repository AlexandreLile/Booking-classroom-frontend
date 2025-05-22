import api from "./api.service";

export interface Reservation {
  id: number;
  startTime: string;
  endTime: string;
  classroom: {
    id: number;
    name: string;
  };
}

export interface CreateReservationInput {
  startTime: string;
  endTime: string;
  classroomId: number;
}

const getMyReservations = async () => {
  try {
    const response = await api.get("/reservations/me");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Vous devez être connecté pour voir vos réservations");
    }
    if (error.response?.data) {
      throw error;
    }
    throw new Error("Une erreur est survenue lors de la récupération des réservations");
  }
};

const createReservation = async (data: CreateReservationInput) => {
  try {
    const response = await api.post("/reservations", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Vous devez être connecté pour créer une réservation");
    }
    if (error.response?.data) {
      throw error;
    }
    throw new Error("Une erreur est survenue lors de la création de la réservation");
  }
};

const updateReservation = async (id: number, startTime: string, endTime: string) => {
  try {
    const response = await api.patch(`/reservations/${id}`, { startTime, endTime });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Vous devez être connecté pour modifier une réservation");
    }
    if (error.response?.data) {
      throw error;
    }
    throw new Error("Une erreur est survenue lors de la mise à jour de la réservation");
  }
};

const deleteReservation = async (id: number) => {
  try {
    await api.delete(`/reservations/${id}`);
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Vous devez être connecté pour supprimer une réservation");
    }
    if (error.response?.data) {
      throw error;
    }
    throw new Error("Une erreur est survenue lors de la suppression de la réservation");
  }
};

const ReservationService = {
  getMyReservations,
  createReservation,
  updateReservation,
  deleteReservation,
};

export default ReservationService; 