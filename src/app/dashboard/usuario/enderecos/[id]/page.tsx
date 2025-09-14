'use client';

import UIButton from '@/components/ui/button';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import { UserAddress } from '@/lib/types/api';
import {
  MapPin,
  Home,
  Building,
  CreditCard,
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Dados mockados (mesmos da página principal)
const mockAddresses: UserAddress[] = [
  {
    id: 1,
    userId: 1,
    type: 'personal',
    label: 'Casa',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    zipCode: '01000-000',
    cityId: 1,
    stateId: 1,
    isPrimary: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    userId: 1,
    type: 'work',
    label: 'Trabalho',
    street: 'Avenida Paulista',
    number: '1000',
    complement: 'Sala 1501',
    neighborhood: 'Bela Vista',
    zipCode: '01310-100',
    cityId: 1,
    stateId: 1,
    isPrimary: false,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 3,
    userId: 1,
    type: 'billing',
    label: 'Endereço de Cobrança',
    street: 'Rua Augusta',
    number: '500',
    complement: 'Loja 10',
    neighborhood: 'Consolação',
    zipCode: '01212-000',
    cityId: 1,
    stateId: 1,
    isPrimary: false,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 4,
    userId: 1,
    type: 'other',
    label: 'Casa da Praia',
    street: 'Rua da Praia',
    number: '789',
    complement: 'Casa 2',
    neighborhood: 'Centro',
    zipCode: '11600-000',
    cityId: 2,
    stateId: 1,
    isPrimary: false,
    isActive: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

export default function AddressDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addressId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<UserAddress | null>(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        setLoading(true);

        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Por enquanto usando dados mockados
        // const result = await getUserAddresses();
        // if (result.success && result.addresses) {
        //   const foundAddress = result.addresses.find(a => a.id === addressId);
        //   if (foundAddress) {
        //     setAddress(foundAddress);
        //   } else {
        //     toast.error('Endereço não encontrado');
        //     router.push('/dashboard/usuario/enderecos');
        //   }
        // } else {
        //   toast.error('Erro ao carregar endereços');
        //   router.push('/dashboard/usuario/enderecos');
        // }

        const foundAddress = mockAddresses.find((a) => a.id === addressId);
        if (foundAddress) {
          setAddress(foundAddress);
        } else {
          toast.error('Endereço não encontrado');
          router.push('/dashboard/usuario/enderecos');
        }
      } catch (error) {
        toast.error('Erro inesperado ao carregar endereço' + error);
        router.push('/dashboard/usuario/enderecos');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [addressId, router]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return Home;
      case 'work':
        return Building;
      case 'billing':
        return CreditCard;
      default:
        return MapPin;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'personal':
        return 'Pessoal';
      case 'work':
        return 'Trabalho';
      case 'billing':
        return 'Cobrança';
      default:
        return 'Outro';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'work':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'billing':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return <PetDataLoading type="general" size="lg" inline={true} />;
  }

  if (!address) {
    return null;
  }

  const TypeIcon = getTypeIcon(address.type);
  const typeColor = getTypeColor(address.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/usuario/enderecos">
            <UIButton variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </UIButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes do Endereço</h1>
            <p className="text-gray-600">Informações completas sobre o endereço</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <UIButton variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </UIButton>
          <UIButton variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </UIButton>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações principais */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status e informações básicas */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${typeColor}`}>
                  <TypeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{address.label || getTypeLabel(address.type)}</h2>
                  <p className="text-sm text-gray-600">{getTypeLabel(address.type)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {address.isPrimary && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    <Star className="mr-1 h-4 w-4" />
                    Principal
                  </span>
                )}
                <div className="flex items-center">
                  {address.isActive ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">Ativo</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">Inativo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium text-gray-900">{getTypeLabel(address.type)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Usuário ID</p>
                  <p className="font-medium text-gray-900">{address.userId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Endereço Completo */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <MapPin className="mr-2 h-5 w-5 text-blue-600" />
              Endereço Completo
            </h2>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Rua</p>
                  <p className="font-medium text-gray-900">{address.street}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Número</p>
                  <p className="font-medium text-gray-900">{address.number}</p>
                </div>
              </div>

              {address.complement && (
                <div>
                  <p className="text-sm text-gray-600">Complemento</p>
                  <p className="font-medium text-gray-900">{address.complement}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Bairro</p>
                  <p className="font-medium text-gray-900">{address.neighborhood}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">CEP</p>
                  <p className="font-medium text-gray-900">{address.zipCode}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600">Cidade ID</p>
                  <p className="font-medium text-gray-900">{address.cityId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Estado ID</p>
                  <p className="font-medium text-gray-900">{address.stateId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status da Conta */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Status do Endereço</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center">
                  {address.isActive ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">Ativo</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">Inativo</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Endereço Principal</span>
                <div className="flex items-center">
                  {address.isPrimary ? (
                    <div className="flex items-center text-yellow-600">
                      <Star className="mr-1 h-4 w-4" />
                      <span className="text-sm font-medium">Sim</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Não</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Criado em</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(address.createdAt)}</span>
              </div>

              {address.updatedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Última atualização</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(address.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Ações</h2>

            <div className="space-y-3">
              <UIButton variant="outline" className="w-full justify-center">
                <Edit className="mr-2 h-4 w-4" />
                Editar Endereço
              </UIButton>

              {!address.isPrimary && (
                <UIButton variant="outline" className="w-full justify-center">
                  <Star className="mr-2 h-4 w-4" />
                  Definir como Principal
                </UIButton>
              )}

              {address.isActive ? (
                <UIButton variant="outline" className="w-full justify-center">
                  <XCircle className="mr-2 h-4 w-4" />
                  Desativar
                </UIButton>
              ) : (
                <UIButton variant="outline" className="w-full justify-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Ativar
                </UIButton>
              )}

              <UIButton variant="outline" className="w-full justify-center text-red-600 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Endereço
              </UIButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
