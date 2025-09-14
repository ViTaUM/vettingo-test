import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatGrid } from '@/components/dashboard/stats';
import VeterinarianProfileBanner from '@/components/dashboard/veterinarian-profile-banner';
import { getCurrentUser } from '@/lib/api/users';
import { getCurrentVeterinarian, getVeterinarianWorkLocations } from '@/lib/api/veterinarians';
import { Heart, MapPin, Settings, Star, User } from 'lucide-react';
import Link from 'next/link';

export default async function VeterinarioDashboardPage() {
  const { user } = await getCurrentUser();
  const { veterinarian } = await getCurrentVeterinarian();
  
  if (!user || !veterinarian) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Erro ao carregar dashboard</h2>
        <p className="text-gray-600">Não foi possível carregar as informações do usuário.</p>
      </div>
    );
  }

  const { workLocations } = await getVeterinarianWorkLocations({ active: true });
  
  const totalLocais = workLocations?.length || 0;
  const locaisAtivos = workLocations?.filter(loc => loc.isActive).length || 0;
  
  const stats = {
    totalLocais,
    locaisAtivos,
    totalReviews: 0,
    avaliacaoMedia: 0,
  };

  return (
    <div className="space-y-6">
      <VeterinarianProfileBanner veterinarian={veterinarian} />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo de volta, {user.firstName}!</p>
      </div>

      <StatGrid
        stats={[
          {
            label: 'Locais de Atendimento',
            value: stats.totalLocais,
            icon: MapPin,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
          {
            label: 'Locais Ativos',
            value: stats.locaisAtivos,
            icon: Heart,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
          },
          {
            label: 'Total de Reviews',
            value: stats.totalReviews,
            icon: Star,
            iconColor: 'text-yellow-600',
            iconBgColor: 'bg-yellow-100',
          },
          {
            label: 'Avaliação Média',
            value: stats.avaliacaoMedia,
            icon: Star,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
          },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Locais de Atendimento</h3>
          <Link
            href="/dashboard/veterinario/locais"
            className="text-sm text-blue-600 hover:text-blue-700">
            Gerenciar locais
          </Link>
        </div>
        
        {workLocations && workLocations.length > 0 ? (
          <div className="space-y-3">
            {workLocations.slice(0, 3).map((location) => (
              <div key={location.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="font-medium text-gray-900">{location.name}</p>
                  <p className="text-sm text-gray-600">{location.address}, {location.number}</p>
                  <p className="text-xs text-gray-500">{location.neighborhood}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    location.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {location.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
            {workLocations.length > 3 && (
              <div className="text-center">
                <Link
                  href="/dashboard/veterinario/locais"
                  className="text-sm text-blue-600 hover:text-blue-700">
                  Ver mais {workLocations.length - 3} locais...
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum local cadastrado</h3>
            <p className="mb-4 text-gray-500">Cadastre seu primeiro local de atendimento para começar.</p>
            <Link
              href="/dashboard/veterinario/locais"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              <MapPin className="mr-2 h-4 w-4" />
              Cadastrar Local
            </Link>
          </div>
        )}
      </div>

      <QuickActions
        actions={[
          {
            title: 'Gerenciar Locais',
            description: 'Adicionar ou editar locais de atendimento',
            icon: MapPin,
            href: '/dashboard/veterinario/locais',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBgColor: 'hover:bg-blue-100',
          },
          {
            title: 'Ver Reviews',
            description: 'Consultar feedback dos tutores',
            icon: Star,
            href: '/dashboard/veterinario/reviews',
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            hoverBgColor: 'hover:bg-yellow-100',
          },
          {
            title: 'Meu Perfil',
            description: 'Atualizar dados profissionais',
            icon: User,
            href: '/dashboard/veterinario/perfil',
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverBgColor: 'hover:bg-green-100',
          },
          {
            title: 'Configurações',
            description: 'Preferências da conta',
            icon: Settings,
            href: '/dashboard/veterinario/configuracoes',
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverBgColor: 'hover:bg-purple-100',
          },
        ]}
      />
    </div>
  );
}
