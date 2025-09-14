export interface PetType {
  id: number;
  name: string;
  icon?: string;
}

export const PET_TYPES: PetType[] = [
  { id: 1, name: 'Cão', icon: '🐕' },
  { id: 2, name: 'Gato', icon: '🐱' },
  { id: 3, name: 'Pássaro', icon: '🐦' },
  { id: 4, name: 'Peixe', icon: '🐠' },
  { id: 5, name: 'Hamster', icon: '🐹' },
  { id: 6, name: 'Coelho', icon: '🐰' },
  { id: 7, name: 'Réptil', icon: '🦎' },
  { id: 8, name: 'Outro', icon: '🐾' },
];

export function getPetTypeById(id: number): PetType | undefined {
  return PET_TYPES.find((type) => type.id === id);
}

export function getPetTypeName(id: number): string {
  const petType = getPetTypeById(id);
  return petType?.name || 'Desconhecido';
}

export function getPetTypeIcon(id: number): string {
  const petType = getPetTypeById(id);
  return petType?.icon || '🐾';
}
