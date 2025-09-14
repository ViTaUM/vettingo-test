'use client';

import UIButton from '@/components/ui/button';
import { createWorkSchedule, deleteWorkSchedule, getWorkSchedules, updateWorkSchedule } from '@/lib/api/vet-work-locations';
import { WorkSchedule } from '@/lib/types/api';
import { Calendar, Clock, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface WorkScheduleModalProps {
  locationId: number;
  locationName: string;
  isOpen: boolean;
  onClose: () => void;
  onScheduleChange?: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

export default function WorkScheduleModal({ locationId, locationName, isOpen, onClose, onScheduleChange }: WorkScheduleModalProps) {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSchedules = useCallback(async () => {
    if (!locationId) return;
    
    setLoading(true);
    try {
      const result = await getWorkSchedules(locationId, { orderBy: 'dayOfWeek', orderDirection: 'asc' });
      if (result.success && result.schedules) {
        setSchedules(result.schedules);
      } else {
        toast.error(result.error || 'Erro ao carregar horários');
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      toast.error('Erro ao carregar horários');
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    if (isOpen && locationId) {
      loadSchedules();
    }
  }, [isOpen, locationId, loadSchedules]);

  const handleCreateSchedule = async (dayOfWeek: number) => {
    setSaving(true);
    try {
      const result = await createWorkSchedule(locationId, {
        dayOfWeek,
        startTime: '08:00:00',
        endTime: '18:00:00'
      });
      if (result.success && result.schedule) {
        setSchedules(prev => [...prev, result.schedule!]);
        onScheduleChange?.();
        toast.success('Horário criado com sucesso');
      } else {
        toast.error(result.error || 'Erro ao criar horário');
      }
    } catch (error) {
      console.error('Erro ao criar horário:', error);
      toast.error('Erro ao criar horário');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSchedule = async (scheduleId: number, data: { startTime?: string; endTime?: string; isActive?: boolean }) => {
    setSaving(true);
    try {
      const result = await updateWorkSchedule(scheduleId, data);
      if (result.success && result.schedule) {
        setSchedules(prev => prev.map(s => s.id === scheduleId ? result.schedule! : s));
        onScheduleChange?.();
        toast.success('Horário atualizado com sucesso');
      } else {
        toast.error(result.error || 'Erro ao atualizar horário');
      }
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
      toast.error('Erro ao atualizar horário');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) {
      return;
    }

    setSaving(true);
    try {
      console.log('Tentando excluir horário ID:', scheduleId);
      const result = await deleteWorkSchedule(scheduleId);
      console.log('Resultado da exclusão:', result);
      
      if (result.success) {
        // Atualizar o estado local
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
        
        // Notificar o componente pai para atualizar
        onScheduleChange?.();
        
        // Mostrar mensagem de sucesso
        toast.success(result.message || 'Horário excluído com sucesso');
      } else {
        console.error('Erro na API:', result.error);
        toast.error(result.error || 'Erro ao excluir horário');
      }
    } catch (error) {
      console.error('Erro ao excluir horário:', error);
      toast.error('Erro inesperado ao excluir horário');
    } finally {
      setSaving(false);
    }
  };

  const handleSetAllWeekdays = async () => {
    setSaving(true);
    try {
      const weekdays = DAYS_OF_WEEK.slice(1, 6); // Segunda a Sexta
      const promises = weekdays.map(async (day) => {
        const existingSchedule = schedules.find(s => s.dayOfWeek === day.value);
        
        if (existingSchedule) {
          if (!existingSchedule.isActive) {
            return updateWorkSchedule(existingSchedule.id, { isActive: true });
          }
          return existingSchedule;
        } else {
          return createWorkSchedule(locationId, {
            dayOfWeek: day.value,
            startTime: '08:00:00',
            endTime: '18:00:00'
          });
        }
      });

             const results = await Promise.all(promises);
       const validSchedules = results
         .filter((r): r is { success: boolean; schedule: WorkSchedule } => 'success' in r && r.success && !!r.schedule)
         .map(r => r.schedule);
      
      // Manter horários existentes de fim de semana
      const weekendSchedules = schedules.filter(s => s.dayOfWeek === 0 || s.dayOfWeek === 6);
      const allSchedules = [...validSchedules, ...weekendSchedules];
      
      setSchedules(allSchedules);
      toast.success('Horários de semana configurados com sucesso');
    } catch (error) {
      console.error('Erro ao configurar horários de semana:', error);
      toast.error('Erro ao configurar horários de semana');
    } finally {
      setSaving(false);
    }
  };

  const getScheduleForDay = (dayOfWeek: number) => {
    return schedules.find(s => s.dayOfWeek === dayOfWeek);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Horários de Trabalho - {locationName}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <UIButton
              onClick={handleSetAllWeekdays}
              variant="outline"
              size="sm"
              disabled={saving}
              className="text-xs">
              Segunda a Sexta
            </UIButton>
            <UIButton
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700">
              <X className="h-4 w-4" />
            </UIButton>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Carregando horários...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => {
                const schedule = getScheduleForDay(day.value);
                const isActive = schedule?.isActive || false;
                
                return (
                  <div key={day.value} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <UIButton
                          onClick={() => {
                            if (schedule) {
                              handleUpdateSchedule(schedule.id, { isActive: !isActive });
                            } else {
                              handleCreateSchedule(day.value);
                            }
                          }}
                          variant={isActive ? "solid" : "outline"}
                          size="sm"
                          disabled={saving}
                          className={isActive ? "bg-blue-600 hover:bg-blue-700" : ""}>
                          {day.label}
                        </UIButton>
                        
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      
                      {schedule && (
                        <UIButton
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          variant="ghost"
                          size="sm"
                          disabled={saving}
                          className="text-red-500 hover:text-red-700">
                          Excluir
                        </UIButton>
                      )}
                    </div>
                    
                    {isActive && schedule && (
                      <div className="flex items-center space-x-4">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">Início:</label>
                          <input
                            type="time"
                            value={schedule.startTime.substring(0, 5)}
                            onChange={(e) => handleUpdateSchedule(schedule.id, { startTime: e.target.value + ':00' })}
                            disabled={saving}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <span className="text-gray-500">-</span>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-700">Fim:</label>
                          <input
                            type="time"
                            value={schedule.endTime.substring(0, 5)}
                            onChange={(e) => handleUpdateSchedule(schedule.id, { endTime: e.target.value + ':00' })}
                            disabled={saving}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 