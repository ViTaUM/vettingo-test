import UserProfileForm from '@/components/dashboard/settings/user-profile-form';
import VeterinarianApprovalStatusComponent from '@/components/dashboard/settings/veterinarian-approval-status';
import VeterinarianProfileForm from '@/components/dashboard/settings/veterinarian-profile-form';
import { getCurrentUser, getUserEmails, getUserPhones } from '@/lib/api/users';
import { getCurrentVeterinarian, getVeterinarianApprovalStatus } from '@/lib/api/veterinarians';
import { VeterinarianApproval } from '@/lib/types/api';

export default async function VeterinarianProfilePage() {
  const { user } = await getCurrentUser();
  const { emails } = await getUserEmails();
  const { phones } = await getUserPhones();
  const { veterinarian } = await getCurrentVeterinarian();

  if (!user) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Erro ao carregar perfil</h2>
        <p className="text-gray-600">Não foi possível carregar as informações do usuário.</p>
      </div>
    );
  }

  let approval: VeterinarianApproval | undefined;
  if (veterinarian) {
    approval = await getVeterinarianApprovalStatus(veterinarian.id).then((res) => res.approval);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="mt-1 text-sm text-gray-600">Gerencie suas informações pessoais e profissionais.</p>
      </div>

      {veterinarian && <VeterinarianApprovalStatusComponent veterinarianId={veterinarian.id} approval={approval} />}
      <UserProfileForm user={user} emails={emails || []} phones={phones || []} />
      <VeterinarianProfileForm veterinarian={veterinarian} emails={emails || []} phones={phones || []} />
    </div>
  );
}
