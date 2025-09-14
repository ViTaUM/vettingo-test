'use client';

import { VeterinarianWorkLocation } from '@/lib/types/api';
import { Building2, Clock, MapPin } from 'lucide-react';

interface WorkLocationStatsProps {
  locations: VeterinarianWorkLocation[];
}

export default function WorkLocationStats({ locations }: WorkLocationStatsProps) {
  const totalLocations = locations.length;
  const activeLocations = locations.filter(loc => loc.isActive).length;
  const inactiveLocations = totalLocations - activeLocations;
  
  const locationsWithCoordinates = locations.filter(loc => 
    loc.latitude !== undefined && loc.longitude !== undefined
  ).length;

  const stats = [
    {
      label: 'Total de Locais',
      value: totalLocations,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Locais Ativos',
      value: activeLocations,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Locais Inativos',
      value: inactiveLocations,
      icon: Building2,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      label: 'Com Coordenadas',
      value: locationsWithCoordinates,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`${stat.bgColor} rounded-lg p-4 border border-gray-200`}>
            <div className="flex items-center">
              <div className={`${stat.color} p-2 rounded-lg bg-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 