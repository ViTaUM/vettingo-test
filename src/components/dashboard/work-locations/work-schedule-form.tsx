'use client';

import UIButton from '@/components/ui/button';
import { createWorkSchedule, getWorkSchedules, updateWorkSchedule } from '@/lib/api/vet-work-locations';
import { WorkSchedule } from '@/lib/types/api';
import { Calendar, Clock } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface WorkScheduleFormProps {
  locationId?: number;
  schedule: WorkSchedule[];
  onChange: (schedule: WorkSchedule[]) => void;
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

export default function WorkScheduleForm({ locationId, schedule, onChange }: WorkScheduleFormProps) {
  const [schedules, setSchedules] = useState<WorkSchedule[]>(schedule);
  const [loading, setLoading] = useState(false);

  const loadSchedules = useCallback(async () => {
    if (!locationId) return;
    
    setLoading(true);
    try {
      const result = await getWorkSchedules(locationId, { active: true, orderBy: 'dayOfWeek', orderDirection: 'asc' });
      if (result.success && result.schedules) {
        setSchedules(result.schedules);
        onChange(result.schedules);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    } finally {
      setLoading(false);
    }
  }, [locationId, onChange]);

  useEffect(() => {
    if (locationId) {
      loadSchedules();
    }
  }, [locationId, loadSchedules]);

  const handleDayToggle = async (dayOfWeek: number) => {
    if (!locationId) return;

    const existingSchedule = schedules.find(s => s.dayOfWeek === dayOfWeek);
    
    if (existingSchedule) {
      // Se já existe, desativar
      try {
        const result = await updateWorkSchedule(existingSchedule.id, { isActive: false });
        if (result.success) {
          const updatedSchedules = schedules.map(s => 
            s.id === existingSchedule.id ? { ...s, isActive: false } : s
          );
          setSchedules(updatedSchedules);
          onChange(updatedSchedules);
        }
      } catch (error) {
        console.error('Erro ao desativar horário:', error);
      }
    } else {
      // Se não existe, criar novo
      try {
        const result = await createWorkSchedule(locationId, {
          dayOfWeek,
          startTime: '08:00:00',
          endTime: '18:00:00'
        });
        if (result.success && result.schedule) {
          const updatedSchedules = [...schedules, result.schedule];
          setSchedules(updatedSchedules);
          onChange(updatedSchedules);
        }
      } catch (error) {
        console.error('Erro ao criar horário:', error);
      }
    }
  };

  const handleTimeChange = async (scheduleId: number, field: 'startTime' | 'endTime', value: string) => {
    try {
      const result = await updateWorkSchedule(scheduleId, { [field]: value });
      if (result.success && result.schedule) {
        const updatedSchedules = schedules.map(s => 
          s.id === scheduleId ? result.schedule! : s
        );
        setSchedules(updatedSchedules);
        onChange(updatedSchedules);
      }
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
    }
  };

  const handleSetAllDays = async (isActive: boolean) => {
    if (!locationId) return;

    const promises = DAYS_OF_WEEK.map(async (day) => {
      const existingSchedule = schedules.find(s => s.dayOfWeek === day.value);
      
      if (existingSchedule) {
        if (existingSchedule.isActive !== isActive) {
          return updateWorkSchedule(existingSchedule.id, { isActive });
        }
        return existingSchedule;
      } else if (isActive) {
        const result = await createWorkSchedule(locationId, {
          dayOfWeek: day.value,
          startTime: '08:00:00',
          endTime: '18:00:00'
        });
        return result.schedule;
      }
      return null;
    });

    try {
      const results = await Promise.all(promises);
      const validSchedules = results.filter(Boolean) as WorkSchedule[];
      setSchedules(validSchedules);
      onChange(validSchedules);
    } catch (error) {
      console.error('Erro ao configurar horários:', error);
    }
  };

  const handleSetWeekdays = async () => {
    if (!locationId) return;

    const weekdays = DAYS_OF_WEEK.slice(1, 6); // Segunda a Sexta
    const promises = weekdays.map(async (day) => {
      const existingSchedule = schedules.find(s => s.dayOfWeek === day.value);
      
      if (existingSchedule) {
        if (!existingSchedule.isActive) {
          return updateWorkSchedule(existingSchedule.id, { isActive: true });
        }
        return existingSchedule;
      } else {
        const result = await createWorkSchedule(locationId, {
          dayOfWeek: day.value,
          startTime: '08:00:00',
          endTime: '18:00:00'
        });
        return result.schedule;
      }
    });

    try {
      const results = await Promise.all(promises);
      const validSchedules = results.filter(Boolean) as WorkSchedule[];
      
      // Manter horários existentes de fim de semana
      const weekendSchedules = schedules.filter(s => s.dayOfWeek === 0 || s.dayOfWeek === 6);
      const allSchedules = [...validSchedules, ...weekendSchedules];
      
      setSchedules(allSchedules);
      onChange(allSchedules);
    } catch (error) {
      console.error('Erro ao configurar horários de semana:', error);
    }
  };

  const isDayActive = (dayOfWeek: number) => {
    return schedules.some(s => s.dayOfWeek === dayOfWeek && s.isActive);
  };

  const getScheduleForDay = (dayOfWeek: number) => {
    return schedules.find(s => s.dayOfWeek === dayOfWeek);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Carregando horários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          <h4 className="text-md font-medium text-gray-900">Horários de Trabalho</h4>
        </div>
        <div className="flex space-x-2">
          <UIButton
            onClick={() => handleSetWeekdays()}
            variant="outline"
            size="sm"
            className="text-xs">
            Segunda a Sexta
          </UIButton>
          <UIButton
            onClick={() => handleSetAllDays(true)}
            variant="outline"
            size="sm"
            className="text-xs">
            Todos os Dias
          </UIButton>
          <UIButton
            onClick={() => handleSetAllDays(false)}
            variant="outline"
            size="sm"
            className="text-xs">
            Limpar Todos
          </UIButton>
        </div>
      </div>

      <div className="grid gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const isActive = isDayActive(day.value);
          const schedule = getScheduleForDay(day.value);
          
          return (
            <div key={day.value} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <UIButton
                  onClick={() => handleDayToggle(day.value)}
                  variant={isActive ? "solid" : "outline"}
                  size="sm"
                  className={isActive ? "bg-blue-600 hover:bg-blue-700" : ""}>
                  {day.label}
                </UIButton>
                
                {isActive && schedule && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      value={schedule.startTime.substring(0, 5)}
                      onChange={(e) => handleTimeChange(schedule.id, 'startTime', e.target.value + ':00')}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={schedule.endTime.substring(0, 5)}
                      onChange={(e) => handleTimeChange(schedule.id, 'endTime', e.target.value + ':00')}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                )}
              </div>
              
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {isActive ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 