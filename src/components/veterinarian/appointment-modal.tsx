'use client';

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Calendar, Clock, User, Heart, MessageSquare, X } from 'lucide-react';
import { Fragment, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { usePets } from '@/hooks/use-pets';
import { createAppointment, CreateAppointmentDto } from '@/lib/api/appointments';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vetId: number;
  vetName: string;
  availableSchedule: Array<{
    dayName: string;
    hours: string;
  }>;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  vetId,
  vetName,
  availableSchedule,
}: AppointmentModalProps) {
  const { user } = useAuthStatus();
  const { pets, loading: petsLoading } = usePets();
  
  // Garantir que availableSchedule seja sempre um array válido
  const safeAvailableSchedule = Array.isArray(availableSchedule) ? availableSchedule : [];
  
  const [formData, setFormData] = useState<CreateAppointmentDto>({
    tutorName: '',
    petName: '',
    vetWorkId: vetId,
    consultationDate: '',
    time: '',
    reason: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeOptions, setShowTimeOptions] = useState(false);

  // Preencher nome do tutor quando o usuário for carregado
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`;
      setFormData(prev => ({ ...prev, tutorName: fullName }));
    }
  }, [user]);

  // Atualizar vetWorkId quando vetId mudar
  useEffect(() => {
    setFormData(prev => ({ ...prev, vetWorkId: vetId }));
  }, [vetId]);

  // Processar horários disponíveis baseado na data selecionada
  useEffect(() => {
    if (formData.consultationDate) {
      const selectedDate = new Date(formData.consultationDate);
      const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Mapear dias da semana
      const dayNamesPortuguese = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const selectedDayName = dayNamesPortuguese[dayOfWeek];
      
      // console.log('Processing times for:', selectedDayName, 'schedule:', safeAvailableSchedule);
      
      let times: string[] = [];
      
      // Encontrar horários para o dia selecionado
      const daySchedule = safeAvailableSchedule.find(schedule => 
        schedule && schedule.dayName && schedule.dayName.toLowerCase() === selectedDayName.toLowerCase()
      );
      
      if (daySchedule && daySchedule.hours && typeof daySchedule.hours === 'string') {
        // Processar string de horários (ex: "08:00-12:00, 14:00-18:00")
        const timeRanges = daySchedule.hours.split(',').map(range => range.trim());
        
        timeRanges.forEach(range => {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(time => time.trim());
            if (start && end && start.includes(':') && end.includes(':')) {
              try {
                // Processar horários de início e fim
                const startParts = start.split(':');
                const endParts = end.split(':');
                const startHour = parseInt(startParts[0]);
                const startMinute = parseInt(startParts[1] || '0');
                const endHour = parseInt(endParts[0]);
                const endMinute = parseInt(endParts[1] || '0');
                
                if (!isNaN(startHour) && !isNaN(startMinute) && !isNaN(endHour) && !isNaN(endMinute)) {
                  // Converter para minutos para facilitar cálculos
                  const startTotalMinutes = startHour * 60 + startMinute;
                  const endTotalMinutes = endHour * 60 + endMinute;
                  
                  // Gerar slots de 30 minutos (cada consulta dura 30min)
                  for (let currentMinutes = startTotalMinutes; currentMinutes + 30 <= endTotalMinutes; currentMinutes += 30) {
                    const hour = Math.floor(currentMinutes / 60);
                    const minute = currentMinutes % 60;
                    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
                    times.push(timeString);
                  }
                }
              } catch (error) {
                console.warn('Erro ao processar horário:', range, error);
              }
            }
          }
        });
      } else if (dayOfWeek !== 0) { // Se não há horário específico e não é domingo, gerar horários padrão
        // Horários padrão: 8h às 12h e 14h às 18h
        const defaultRanges = [
          { start: 8 * 60, end: 12 * 60 }, // 8h às 12h
          { start: 14 * 60, end: 18 * 60 } // 14h às 18h
        ];
        
        defaultRanges.forEach(range => {
          for (let currentMinutes = range.start; currentMinutes + 30 <= range.end; currentMinutes += 30) {
            const hour = Math.floor(currentMinutes / 60);
            const minute = currentMinutes % 60;
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
            times.push(timeString);
          }
        });
      }
      
      // console.log('Generated times:', times);
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  }, [formData.consultationDate, safeAvailableSchedule]);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Fechar calendário se clicar fora do seu container
      if (showCalendar && !target.closest('[data-calendar-container]')) {
        setShowCalendar(false);
      }
      
      // Fechar opções de horário se clicar fora do seu container
      if (showTimeOptions && !target.closest('[data-time-container]')) {
        setShowTimeOptions(false);
      }
    };

    if (showCalendar || showTimeOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCalendar, showTimeOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tutorName || !formData.petName || !formData.consultationDate || !formData.time) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const response = await createAppointment(formData);
      
      if (response.success) {
        toast.success('Agendamento realizado com sucesso!');
        onSuccess();
        handleClose();
      } else {
        toast.error(response.error || 'Erro ao realizar agendamento');
      }
    } catch (error) {
      toast.error('Erro ao realizar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      tutorName: user ? `${user.firstName} ${user.lastName}` : '',
      petName: '',
      vetWorkId: vetId,
      consultationDate: '',
      time: '',
      reason: '',
    });
    setAvailableTimes([]);
    setShowCalendar(false);
    setShowTimeOptions(false);
    onClose();
  };

  const handleInputChange = (field: keyof CreateAppointmentDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Fechar dropdowns após seleção
    if (field === 'consultationDate') {
      setShowCalendar(false);
    }
    if (field === 'time') {
      setShowTimeOptions(false);
    }
  };

  // Verificar se uma data está disponível
  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    const dayNamesPortuguese = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayName = dayNamesPortuguese[dayOfWeek];
    
    // console.log('Checking date:', date, 'dayName:', dayName, 'availableSchedule:', safeAvailableSchedule);
    
    // Se não há schedule disponível, liberar todas as datas (exceto domingo)
    if (!safeAvailableSchedule || safeAvailableSchedule.length === 0) {
      return dayOfWeek !== 0; // Não permitir domingos
    }
    
    return safeAvailableSchedule.some(schedule => 
      schedule && schedule.dayName && schedule.dayName.toLowerCase() === dayName.toLowerCase()
    );
  };

  // Gerar calendário do mês atual e próximo
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const days = [];

    // Adicionar dias do mês atual (a partir de hoje)
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let day = today.getDate() + 1; day <= daysInCurrentMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push(date);
    }

    // Adicionar dias do próximo mês
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInNextMonth && days.length < 30; day++) {
      const date = new Date(nextYear, nextMonth, day);
      days.push(date);
    }

    return days.filter(date => isDateAvailable(date));
  };

  // Formatar horário no padrão "08h às 08h30min"
  const formatTimeRange = (timeString: string) => {
    const startTime = timeString.substring(0, 5);
    const [hour, minute] = startTime.split(':').map(Number);
    const endMinutes = hour * 60 + minute + 30;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    
    const startFormatted = `${hour}h${minute > 0 ? minute.toString().padStart(2, '0') + 'min' : ''}`;
    const endFormatted = `${endHour}h${endMin > 0 ? endMin.toString().padStart(2, '0') + 'min' : ''}`;
    
    return `${startFormatted} às ${endFormatted}`;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 px-6 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                          Agendar Consulta
                        </DialogTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Com {vetName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                  {/* Nome do Tutor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Nome do Tutor
                    </label>
                    <input
                      type="text"
                      value={formData.tutorName}
                      onChange={(e) => handleInputChange('tutorName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite seu nome completo"
                      required
                      disabled={!!user} // Desabilitar se o usuário estiver logado
                    />
                  </div>

                  {/* Nome do Pet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Heart className="h-4 w-4 inline mr-2" />
                      Nome do Pet
                    </label>
                    {petsLoading ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        Carregando pets...
                      </div>
                    ) : pets.length > 0 ? (
                      <select
                        value={formData.petName}
                        onChange={(e) => handleInputChange('petName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Selecione um pet</option>
                        {pets.map((pet) => (
                          <option key={pet.id} value={pet.name}>
                            {pet.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData.petName}
                        onChange={(e) => handleInputChange('petName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite o nome do seu pet"
                        required
                      />
                    )}
                  </div>

                  {/* Data da Consulta */}
                  <div className="relative" data-calendar-container>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Data da Consulta
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.consultationDate ? new Date(formData.consultationDate).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : ''}
                        onClick={() => setShowCalendar(!showCalendar)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
                        placeholder="Clique para selecionar uma data"
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      
                      {showCalendar && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-3">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-600">Selecione uma data disponível:</p>
                            <button
                              type="button"
                              onClick={() => setShowCalendar(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-7 gap-1 max-h-40 overflow-y-auto">
                            {(() => {
                              const calendarDays = generateCalendarDays();
                              // console.log('Calendar days generated:', calendarDays.length, calendarDays);
                              
                              if (calendarDays.length === 0) {
                                // Se não há datas específicas, gerar próximos 14 dias (exceto domingos)
                                const fallbackDays = [];
                                const today = new Date();
                                for (let i = 1; i <= 14; i++) {
                                  const date = new Date(today);
                                  date.setDate(today.getDate() + i);
                                  if (date.getDay() !== 0) { // Não incluir domingos
                                    fallbackDays.push(date);
                                  }
                                }
                                return fallbackDays.map((date) => {
                                  const dateString = date.toISOString().split('T')[0];
                                  const isSelected = formData.consultationDate === dateString;
                                  
                                  return (
                                    <button
                                      key={dateString}
                                      type="button"
                                      onClick={() => handleInputChange('consultationDate', dateString)}
                                      className={`
                                        p-2 text-xs rounded-md transition-colors
                                        ${isSelected 
                                          ? 'bg-blue-600 text-white' 
                                          : 'bg-gray-50 hover:bg-blue-50 text-gray-700'
                                        }
                                      `}
                                    >
                                      <div className="font-medium">{date.getDate()}</div>
                                      <div className="text-xs opacity-75">
                                        {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                                      </div>
                                    </button>
                                  );
                                });
                              }
                              
                              return calendarDays.map((date) => {
                                const dateString = date.toISOString().split('T')[0];
                                const isSelected = formData.consultationDate === dateString;
                                
                                return (
                                  <button
                                    key={dateString}
                                    type="button"
                                    onClick={() => handleInputChange('consultationDate', dateString)}
                                    className={`
                                      p-2 text-xs rounded-md transition-colors
                                      ${isSelected 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-50 hover:bg-blue-50 text-gray-700'
                                      }
                                    `}
                                  >
                                    <div className="font-medium">{date.getDate()}</div>
                                    <div className="text-xs opacity-75">
                                      {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                                    </div>
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horário */}
                  <div className="relative" data-time-container>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Horário (Consulta de 30 minutos)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.time ? formatTimeRange(formData.time) : ''}
                        onClick={() => {
                          if (formData.consultationDate) {
                            setShowTimeOptions(!showTimeOptions);
                          }
                        }}
                        readOnly
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white ${
                          !formData.consultationDate ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        placeholder={
                          !formData.consultationDate 
                            ? 'Primeiro selecione uma data' 
                            : availableTimes.length === 0 
                              ? 'Nenhum horário disponível' 
                              : 'Clique para selecionar um horário'
                        }
                        required
                        disabled={!formData.consultationDate}
                      />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      
                      {showTimeOptions && formData.consultationDate && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                          <div className="flex items-center justify-between p-3 border-b border-gray-200">
                            <p className="text-sm text-gray-600">Horários disponíveis:</p>
                            <button
                              type="button"
                              onClick={() => setShowTimeOptions(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="py-2">
                            {availableTimes.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-4">
                                Nenhum horário disponível para esta data
                              </p>
                            ) : (
                              availableTimes.map((time) => {
                                const isSelected = formData.time === time;
                                
                                return (
                                  <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleInputChange('time', time)}
                                    className={`
                                      w-full px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50
                                      ${isSelected ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}
                                    `}
                                  >
                                    {formatTimeRange(time)}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Motivo (Opcional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                      Motivo da Consulta (Opcional)
                    </label>
                    <textarea
                      value={formData.reason || ''}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Descreva brevemente o motivo da consulta..."
                      rows={3}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Agendando...' : 'Agendar Consulta'}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 