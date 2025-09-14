'use client';

import { City, State } from '@/lib/types/api';
import FormCombobox from './combobox';

type LocationSelectorProps = {
  states: State[];
  cities: City[];
  selectedState?: State;
  selectedCity?: City;
  onStateChange: (stateId: string) => void;
  onCityChange: (cityId: string) => void;
  required?: boolean;
  className?: string;
  isLoadingCities?: boolean;
};

export default function LocationSelector({
  states,
  cities,
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  required = false,
  className,
  isLoadingCities = false,
}: LocationSelectorProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <FormCombobox
          label="Estado"
          name="state"
          required={required}
          options={[
            ...states.map((state) => ({
              value: state.id.toString(),
              label: `${state.name} (${state.uf})`,
            })),
          ]}
          value={selectedState?.id.toString()}
          onChange={(value) => onStateChange?.(value)}
        />
      </div>

      <div className="mb-4">
        <FormCombobox
          label="Cidade"
          name="city"
          required={required}
          options={[
            ...cities.map((city) => ({
              value: city.id.toString(),
              label: city.name,
            })),
          ]}
          value={selectedCity?.id.toString()}
          onChange={(value) => onCityChange?.(value)}
          disabled={isLoadingCities || !selectedState}
        />
      </div>
    </div>
  );
}
