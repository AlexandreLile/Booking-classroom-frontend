import { Context } from "hono";
import { ReservationService } from "../services/reservationService";
import { createReservationSchema } from "../schemas/reservationSchema";
import { ZodError } from "zod";

export const createReservation = async (c: Context) => {
  console.log("createReservation", c.req.json());
  try {
    const user = c.get("user");
    console.log("user", user);
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const body = await c.req.json();
    const validatedData = createReservationSchema.parse(body);

    const reservation = await ReservationService.createReservation({
      ...validatedData,
      userId: user.userId,
    });

    return c.json(reservation, 201);
  } catch (error: unknown) {
    console.error("Error creating reservation:", error);
    if (error instanceof ZodError) {
      return c.json({ error: "Invalid input data" }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to create reservation" }, 500);
  }
};

export const getMyReservations = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const reservations = await ReservationService.getReservationsByUser(user.userId);
    return c.json(reservations);
  } catch (error) {
    console.error("Error getting reservations:", error);
    return c.json({ error: "Failed to get reservations" }, 500);
  }
};

export const getClassroomReservations = async (c: Context) => {
  try {
    const classroomId = parseInt(c.req.param("classroomId"));
    if (isNaN(classroomId)) {
      return c.json({ error: "Invalid classroom ID" }, 400);
    }

    const reservations = await ReservationService.getReservationsByClassroom(
      classroomId
    );
    return c.json(reservations);
  } catch (error) {
    console.error("Error getting classroom reservations:", error);
    return c.json({ error: "Failed to get classroom reservations" }, 500);
  }
};

export const getReservationById = async (c: Context) => {
  try {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid reservation ID" }, 400);
    }

    const reservation = await ReservationService.getReservationById(id);
    if (!reservation) {
      return c.json({ error: "Reservation not found" }, 404);
    }

    return c.json(reservation);
  } catch (error) {
    console.error("Error getting reservation:", error);
    return c.json({ error: "Failed to get reservation" }, 500);
  }
};

export const deleteReservation = async (c: Context) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid reservation ID" }, 400);
    }

    await ReservationService.deleteReservation(id, user.userId);
    return c.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to delete reservation" }, 500);
  }
};
