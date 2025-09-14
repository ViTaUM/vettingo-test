import { Search } from 'lucide-react';

export default function SearchPrompt() {
  return (
    <div className="rounded-xl bg-white p-8 text-center shadow-md">
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 mb-4 rounded-full p-4">
          <Search className="text-primary h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold">Selecione uma cidade</h3>
        <p className="mb-6 text-gray-600">Por favor, selecione uma cidade para buscar veterinários.</p>
      </div>
    </div>
  );
}
