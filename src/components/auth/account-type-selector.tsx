'use client';

import { User, Stethoscope, Check } from 'lucide-react';
import SelectableCard from '@/components/ui/selectable-card';

interface AccountTypeSelectorProps {
  value: 'USER' | 'VETERINARIAN';
  onChange: (value: 'USER' | 'VETERINARIAN') => void;
  disabled?: boolean;
}

export default function AccountTypeSelector({ value, onChange, disabled }: AccountTypeSelectorProps) {
  const handleCardSelect = (id: string) => {
    onChange(id as 'USER' | 'VETERINARIAN');
  };

  const cardOptions = [
    {
      id: 'USER',
      title: 'Tutor',
      description: 'Para tutores que buscam cuidados veterinários para seus pets',
      icon: User,
      selectedColor: 'blue' as const,
      spotlightColor: 'blue',
      features: [
        { icon: Check, text: 'Buscar veterinários' },
        { icon: Check, text: 'Avaliar serviços' },
        { icon: Check, text: 'Gestão de pets' },
      ],
    },
    {
      id: 'VETERINARIAN',
      title: 'Veterinário',
      description: 'Para profissionais que desejam oferecer seus serviços',
      icon: Stethoscope,
      selectedColor: 'emerald' as const,
      spotlightColor: 'emerald',
      features: [
        { icon: Check, text: 'Perfil profissional' },
        { icon: Check, text: 'Gerenciar clientes' },
        { icon: Check, text: 'Dashboard Analytics' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Que tipo de conta você deseja criar?</h3>
        <p className="mt-1 text-sm text-gray-600">
          Escolha o tipo que melhor se adequa ao seu perfil. Você poderá alterar suas preferências posteriormente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cardOptions.map((option) => (
          <SelectableCard
            key={option.id}
            id={option.id}
            title={option.title}
            description={option.description}
            icon={option.icon}
            features={option.features}
            isSelected={value === option.id}
            onSelect={handleCardSelect}
            disabled={disabled}
            selectedColor={option.selectedColor}
            spotlightColor={option.spotlightColor}
            className="rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
