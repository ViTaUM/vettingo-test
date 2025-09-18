'use server';

import { apiRequest } from '@/lib/api/config';

export interface CreateAppointmentDto {
  tutorName: string;
  petName: string;
  vetWorkId: number;
  consultationDate: string; // formato "YYYY-MM-DD"
  time: string; // formato "HH:MM:SS"
  reason?: string;
}

export interface Appointment {
  id: number;
  tutorName: string;
  petName: string;
  vetWorkId: number;
  consultationDate: string;
  time: string;
  reason?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export async function createAppointment(data: CreateAppointmentDto): Promise<{
  success: boolean;
  appointment?: Appointment;
  error?: string;
}> {
  try {
    const appointment = await apiRequest<Appointment>('/dashboard/scheduling', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar agendamento',
    };
  }
}

export async function getUserAppointments(): Promise<{
  success: boolean;
  appointments?: Appointment[];
  error?: string;
}> {
  try {
    const appointments = await apiRequest<Appointment[]>('/appointments', {
      next: {
        revalidate: 60,
        tags: ['appointments'],
      },
    });
    return { success: true, appointments };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar agendamentos',
    };
  }
}

export async function getAppointmentById(id: number): Promise<{
  success: boolean;
  appointment?: Appointment;
  error?: string;
}> {
  try {
    const appointment = await apiRequest<Appointment>(`/appointments/${id}`);
    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar agendamento',
    };
  }
}

export async function updateAppointment(id: number, data: Partial<CreateAppointmentDto>): Promise<{
  success: boolean;
  appointment?: Appointment;
  error?: string;
}> {
  try {
    const appointment = await apiRequest<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { success: true, appointment };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar agendamento',
    };
  }
}

export async function cancelAppointment(id: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    await apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
    });
    return { success: true, message: 'Agendamento cancelado com sucesso' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao cancelar agendamento',
    };
  }
} 