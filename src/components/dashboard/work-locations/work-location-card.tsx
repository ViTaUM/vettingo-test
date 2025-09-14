'use client';

import UIButton from '@/components/ui/button';
import { getWorkSchedules } from '@/lib/api/vet-work-locations';
import { VeterinarianWorkLocation, WorkSchedule } from '@/lib/types/api';
import { Building2, Clock, Edit, MapPin, Settings, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import WorkScheduleModal from './work-schedule-modal';

interface WorkLocationCardProps {
  location: VeterinarianWorkLocation;
  onEdit: () => void;
  onDelete: () => void;
}

const DAYS_OF_WEEK = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export default function WorkLocationCard({ location, onEdit, onDelete }: WorkLocationCardProps) {
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, [location.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSchedules = async () => {
    setLoadingSchedules(true);
    try {
      const result = await getWorkSchedules(location.id, { active: true, orderBy: 'dayOfWeek', orderDirection: 'asc' });
      if (result.success && result.schedules) {
        setSchedules(result.schedules);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const getAvailableDays = () => {
    if (schedules.length === 0) {
      return [];
    }
    
    return schedules
      .filter(schedule => schedule.isActive)
      .map(schedule => DAYS_OF_WEEK[schedule.dayOfWeek])
      .slice(0, 3); // Mostrar apenas os primeiros 3 dias
  };

  const getScheduleText = () => {
    if (schedules.length === 0) {
      return loadingSchedules ? 'Carregando...' : 'Horários não definidos';
    }

    const availableSchedules = schedules.filter(s => s.isActive);
    if (availableSchedules.length === 0) {
      return 'Não disponível';
    }

    const firstSchedule = availableSchedules[0];
    return `${firstSchedule.startTime.substring(0, 5)} - ${firstSchedule.endTime.substring(0, 5)}`;
  };

  const availableDays = getAvailableDays();
  const hasMoreDays = schedules.filter(s => s.isActive).length > 3;

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
          </div>
          <div className="flex space-x-2">
            <UIButton
              onClick={() => setShowScheduleModal(true)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-600">
              <Settings className="h-4 w-4" />
            </UIButton>
            <UIButton
              onClick={onEdit}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-600">
              <Edit className="h-4 w-4" />
            </UIButton>
            <UIButton
              onClick={onDelete}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </UIButton>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="mr-2 mt-0.5 h-4 w-4 text-gray-400" />
            <div className="text-sm text-gray-600">
              <p className="font-medium">{location.address}, {location.number}</p>
              {location.complement && (
                <p className="text-gray-500">{location.complement}</p>
              )}
              <p className="text-gray-500">{location.neighborhood}</p>
              <p className="text-gray-500">CEP: {location.zipCode}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="mr-2 mt-0.5 h-4 w-4 text-gray-400" />
            <div className="text-sm text-gray-600">
              <p className="font-medium">{getScheduleText()}</p>
              {availableDays.length > 0 && (
                <p className="text-gray-500">
                  {availableDays.join(', ')}
                  {hasMoreDays && ' e mais...'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              ID: {location.id}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              location.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {location.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>

      <WorkScheduleModal
        locationId={location.id}
        locationName={location.name}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onScheduleChange={loadSchedules}
      />
    </>
  );
} 