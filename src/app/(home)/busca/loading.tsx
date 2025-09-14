import { PetLoading } from '@/components/ui/pet-loading';

export default function Loading() {
  return (
    <div className="bg-accent min-h-screen">
      <PetLoading message="Carregando resultados..." petType="random" size="lg" />
    </div>
  );
}
