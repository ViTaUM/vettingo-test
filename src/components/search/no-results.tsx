'use client';

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface NoResultsProps {
  onResetFilters: () => void;
}

export default function NoResults({ onResetFilters }: NoResultsProps) {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-md">
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 mb-4 rounded-full p-4">
          <Search className="text-primary h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold">Nenhum resultado encontrado</h3>
        <p className="mb-6 text-gray-600">
          Não encontramos veterinários que correspondam aos filtros selecionados.
          <br />
          Tente ajustar seus critérios de busca.
        </p>
        <Button variant="outline" onClick={onResetFilters}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
