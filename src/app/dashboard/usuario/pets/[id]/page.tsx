'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPetById } from '@/lib/api/pets';
import { getPetVaccines, createPetVaccine, deletePetVaccine, PetVaccine, CreatePetVaccineDto } from '@/lib/api/vaccines';
import { getPetDocumentsAction, createPetDocumentAction, PetDocument, CreatePetDocumentDto } from '@/lib/actions/pet-documents';
import { ArrowLeft, Edit3, Calendar, FileText, Syringe, Plus, Eye, Download, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import UIButton from '@/components/ui/button';
import { Pet } from '@/lib/types/api';
import { formatAge } from '@/utils/age';
import { PawPrint, Weight, Heart, Info } from 'lucide-react';

// Interfaces para dados mock (mantendo apenas para consultas)
interface Consultation {
  id: number;
  date: string;
  veterinarian: string;
  clinic: string;
  reason: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

export default function PetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const petId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'documents' | 'vaccines'>('overview');
  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isConsultationDetailsModalOpen, setIsConsultationDetailsModalOpen] = useState(false);
  const [isDocumentViewModalOpen, setIsDocumentViewModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<PetDocument | null>(null);
  const [vaccines, setVaccines] = useState<PetVaccine[]>([]);
  const [documents, setDocuments] = useState<PetDocument[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [vaccineFormData, setVaccineFormData] = useState({
    vaccineName: '',
    vaccinationDate: '',
    nextDueDate: '',
    vetId: 1,
    batchNumber: '',
    status: 'PENDENTE' as 'PENDENTE' | 'APLICADA' | 'ATRASADA' | 'NÃO APLICADA',
    notes: '',
  });
  const [documentFormData, setDocumentFormData] = useState({
    title: '',
    file: null as File | null,
  });
  const [consultationFormData, setConsultationFormData] = useState({
    date: '',
    veterinarian: '',
    clinic: '',
    reason: '',
  });

  // Mock data para consultas e documentos (mantendo apenas estes)
  const mockConsultations: Consultation[] = [
    {
      id: 1,
      date: '2024-12-15',
      veterinarian: 'Dr. Maria Silva',
      clinic: 'Clínica VetCare',
      reason: 'Consulta de rotina',
      status: 'completed',
    },
    {
      id: 2,
      date: '2024-12-28',
      veterinarian: 'Dr. João Santos',
      clinic: 'Pet Hospital',
      reason: 'Vacinação anual',
      status: 'scheduled',
    },
  ];

  // Função para carregar documentos da API
  const loadDocuments = async () => {
    if (!petId) return;
    
    setLoadingDocuments(true);
    try {
      const result = await getPetDocumentsAction(petId);
      if (result.success && result.documents) {
        setDocuments(result.documents);
      } else {
        setDocuments([]);
        if (result.error) {
          console.error('Erro ao carregar documentos:', result.error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar documentos:', error);
      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Função para carregar vacinas da API
  const loadVaccines = async () => {
    if (!petId) return;
    
    setLoadingVaccines(true);
    try {
      const result = await getPetVaccines(petId);
      if (result.success && result.vaccines) {
        // Filtrar vacinas que não foram deletadas (sem deletedAt ou deletedAt null)
        const activeVaccines = result.vaccines.filter(vaccine => !vaccine.deletedAt);
        setVaccines(activeVaccines);
      } else {
        setVaccines([]);
        if (result.error) {
          console.error('Erro ao carregar vacinas:', result.error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar vacinas:', error);
      setVaccines([]);
    } finally {
      setLoadingVaccines(false);
    }
  };

  useEffect(() => {
    const fetchPet = async () => {
      const result = await getPetById(petId);
      if (result.success && result.pet) {
        setPet(result.pet);
      } else {
        toast.error('Pet não encontrado');
        router.push('/dashboard/usuario');
      }
      setLoading(false);
    };

    if (petId) {
      fetchPet();
      // Carregar vacinas da API
      loadVaccines();
      // Carregar documentos da API
      loadDocuments();
      // Inicializar com dados mock apenas para consultas
      setConsultations(mockConsultations);
    }
  }, [petId, router, loadDocuments, loadVaccines, mockConsultations]);

  const formatBirthDate = (birthDate: Date) => {
    return new Date(birthDate).toLocaleDateString('pt-BR');
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case 'M':
        return 'Macho';
      case 'F':
        return 'Fêmea';
      case 'O':
        return 'Outro';
      default:
        return 'Não informado';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APLICADA':
        return 'bg-green-100 text-green-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ATRASADA':
        return 'bg-red-100 text-red-800';
      case 'NÃO APLICADA':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APLICADA':
        return 'Aplicada';
      case 'PENDENTE':
        return 'Pendente';
      case 'ATRASADA':
        return 'Atrasada';
      case 'NÃO APLICADA':
        return 'Não Aplicada';
      default:
        return status;
    }
  };



  const handleVaccineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!vaccineFormData.vaccineName || !vaccineFormData.vaccinationDate || !vaccineFormData.status) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Preparar dados para API
      const vaccineData: CreatePetVaccineDto = {
        vaccineName: vaccineFormData.vaccineName,
        vaccinationDate: vaccineFormData.vaccinationDate,
        nextDueDate: vaccineFormData.nextDueDate || undefined,
        vetId: vaccineFormData.vetId,
        batchNumber: vaccineFormData.batchNumber || undefined,
        status: vaccineFormData.status,
        notes: vaccineFormData.notes || undefined,
      };

      // Chamar API para criar vacina
      const result = await createPetVaccine(petId, vaccineData);

      if (result.success && result.vaccine) {
        // Adicionar à lista de vacinas
        setVaccines([...vaccines, result.vaccine]);
        toast.success('Vacina registrada com sucesso!');
        setIsVaccineModalOpen(false);
        resetVaccineForm();
      } else {
        toast.error(result.error || 'Erro ao registrar vacina');
      }
    } catch (error) {
      toast.error('Erro ao registrar vacina');
      console.error('Erro ao registrar vacina:', error);
    }
  };

  const resetVaccineForm = () => {
    setVaccineFormData({
      vaccineName: '',
      vaccinationDate: '',
      nextDueDate: '',
      vetId: 1,
      batchNumber: '',
      status: 'PENDENTE' as 'PENDENTE' | 'APLICADA' | 'ATRASADA' | 'NÃO APLICADA',
      notes: '',
    });
  };

  const handleDeleteVaccine = async (vaccineId: number) => {
    // Confirmar antes de deletar
    if (!confirm('Tem certeza que deseja excluir esta vacina? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const result = await deletePetVaccine(vaccineId);
      
      if (result.success) {
        // Recarregar a lista de vacinas para refletir a exclusão
        await loadVaccines();
        toast.success('Vacina excluída com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao excluir vacina');
      }
    } catch (error) {
      toast.error('Erro ao excluir vacina');
      console.error('Erro ao excluir vacina:', error);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!documentFormData.title || !documentFormData.file) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Converter arquivo para base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(documentFormData.file!);
      });

      console.log('Dados do documento:', {
        petId,
        title: documentFormData.title,
        fileSize: documentFormData.file!.size,
        fileType: documentFormData.file!.type,
        base64Length: base64.length
      });

      // Preparar dados para API
      const documentData: CreatePetDocumentDto = {
        title: documentFormData.title,
        document: base64,
      };

      // Chamar API para criar documento
      const result = await createPetDocumentAction(petId, documentData);

      if (result.success && result.document) {
        // Adicionar à lista de documentos
        setDocuments([...documents, result.document]);
        toast.success('Documento adicionado com sucesso!');
        setIsDocumentModalOpen(false);
        resetDocumentForm();
      } else {
        toast.error(result.error || 'Erro ao adicionar documento');
      }
    } catch (error) {
      toast.error('Erro ao adicionar documento');
      console.error('Erro ao adicionar documento:', error);
    }
  };

  const resetDocumentForm = () => {
    setDocumentFormData({
      title: '',
      file: null,
    });
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!consultationFormData.date || !consultationFormData.veterinarian || !consultationFormData.clinic || !consultationFormData.reason) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se a data não é no passado
    const selectedDate = new Date(consultationFormData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('A data da consulta deve ser hoje ou uma data futura');
      return;
    }

    const newConsultation: Consultation = {
      id: consultations.length + 1,
      date: consultationFormData.date,
      veterinarian: consultationFormData.veterinarian,
      clinic: consultationFormData.clinic,
      reason: consultationFormData.reason,
      status: 'scheduled',
    };

    // Adicionar à lista de consultas
    setConsultations([...consultations, newConsultation]);
    
    toast.success('Consulta agendada com sucesso!');
    setIsConsultationModalOpen(false);
    resetConsultationForm();
  };

  const resetConsultationForm = () => {
    setConsultationFormData({
      date: '',
      veterinarian: '',
      clinic: '',
      reason: '',
    });
  };

  const handleViewConsultationDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsConsultationDetailsModalOpen(true);
  };

  const closeConsultationDetailsModal = () => {
    setIsConsultationDetailsModalOpen(false);
    setSelectedConsultation(null);
  };

  const handleViewDocument = (document: PetDocument) => {
    setSelectedDocument(document);
    setIsDocumentViewModalOpen(true);
  };

  const closeDocumentViewModal = () => {
    setIsDocumentViewModalOpen(false);
    setSelectedDocument(null);
  };

  const handleDownloadDocument = (doc: PetDocument) => {
    toast.success(`Baixando ${doc.title}...`);
    
    // Download usando a URL do documento
    const link = document.createElement('a');
    link.href = doc.document; // URL do documento
    link.download = doc.title;
    link.target = '_blank'; // Abrir em nova aba para evitar problemas de CORS
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-500">Carregando informações do pet...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center">
        <p className="text-gray-500">Pet não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/usuario" className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
            <p className="mt-2 text-gray-600">Informações completas e histórico médico</p>
          </div>
          <Link href={`/dashboard/usuario/pets/${petId}/editar`}>
            <UIButton variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" />
              Editar Pet
            </UIButton>
          </Link>
        </div>
      </div>

      {/* Pet Info Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            {pet.avatar ? (
              <Image
                src={pet.avatar}
                alt={pet.name}
                width={120}
                height={120}
                className="h-30 w-30 rounded-full object-cover ring-4 ring-blue-100"
              />
            ) : (
              <div className="flex h-30 w-30 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 ring-4 ring-blue-100">
                <PawPrint className="h-12 w-12 text-blue-600" />
              </div>
            )}
            {pet.hasPedigree && (
              <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400">
                <Heart className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                <p className="text-gray-600">{pet.breed || 'Sem raça definida'}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="w-20 text-gray-500">Gênero:</span>
                  <span className="font-medium text-gray-900">{getGenderLabel(pet.gender)}</span>
                </div>
                {pet.birthDate && (
                  <>
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-gray-500">Idade:</span>
                      <span className="font-medium text-gray-900">{formatAge(new Date(pet.birthDate))}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-20 text-gray-500">Nasceu em:</span>
                      <span className="font-medium text-gray-900">{formatBirthDate(pet.birthDate)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {pet.weight && (
                <div className="flex items-center text-sm">
                  <Weight className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Peso:</span>
                  <span className="ml-auto font-medium text-gray-900">{pet.weight}</span>
                </div>
              )}

              {pet.hasPedigree && pet.pedigreeNumber && (
                <div className="flex items-center text-sm">
                  <Heart className="mr-2 h-4 w-4 text-yellow-500" />
                  <span className="text-gray-500">Pedigree:</span>
                  <span className="ml-auto font-medium text-gray-900">{pet.pedigreeNumber}</span>
                </div>
              )}

              <div className="flex items-center text-sm">
                <div className={`mr-2 h-2 w-2 rounded-full ${pet.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                <span className="text-gray-500">{pet.isActive ? 'Ativo' : 'Inativo'}</span>
              </div>
            </div>
          </div>
        </div>

        {pet.description && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <div className="flex items-start">
              <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
              <div>
                <span className="text-sm font-medium text-gray-700">Observações:</span>
                <p className="mt-1 text-sm text-gray-600">{pet.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Eye },
            { id: 'consultations', label: 'Consultas', icon: Calendar },
            { id: 'documents', label: 'Documentos', icon: FileText },
            { id: 'vaccines', label: 'Vacinas', icon: Syringe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'consultations' | 'documents' | 'vaccines')}
              className={`flex items-center border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}>
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <Calendar className="mx-auto mb-3 h-8 w-8 text-blue-600" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Consultas</h3>
              <p className="mb-1 text-3xl font-bold text-blue-600">{consultations.length}</p>
              <p className="text-sm text-gray-500">Total realizadas</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <FileText className="mx-auto mb-3 h-8 w-8 text-emerald-600" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Documentos</h3>
              <p className="mb-1 text-3xl font-bold text-emerald-600">{documents.length}</p>
              <p className="text-sm text-gray-500">Arquivos salvos</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
              <Syringe className="mx-auto mb-3 h-8 w-8 text-purple-600" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Vacinas</h3>
              <p className="mb-1 text-3xl font-bold text-purple-600">{vaccines.length}</p>
              <p className="text-sm text-gray-500">Aplicadas</p>
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Consultas</h3>
              <UIButton size="sm" onClick={() => setIsConsultationModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Agendar Consulta
              </UIButton>
            </div>

            <div className="space-y-3">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{consultation.reason}</h4>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {consultation.status === 'completed'
                            ? 'Realizada'
                            : consultation.status === 'scheduled'
                              ? 'Agendada'
                              : 'Cancelada'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {consultation.veterinarian} • {consultation.clinic}
                      </p>
                      <p className="text-sm text-gray-400">{new Date(consultation.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <UIButton variant="ghost" size="sm" onClick={() => handleViewConsultationDetails(consultation)}>
                      Ver Detalhes
                    </UIButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Documentos e Exames</h3>
              <UIButton size="sm" onClick={() => setIsDocumentModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Documento
              </UIButton>
            </div>

            <div className="space-y-3">
              {loadingDocuments ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-gray-500">Carregando documentos...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Nenhum documento cadastrado</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                    Ainda não há documentos registrados para este pet. Clique no botão acima para adicionar o primeiro documento.
                  </p>
                  <UIButton size="sm" onClick={() => setIsDocumentModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Documento
                  </UIButton>
                </div>
              ) : (
                documents.map((document) => (
                  <div key={document.id} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">📄</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-medium text-gray-900">{document.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(document.createdAt).toLocaleDateString('pt-BR')} • {document.documentLength} MB
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <UIButton variant="ghost" size="sm" onClick={() => handleViewDocument(document)}>
                          <Eye className="h-4 w-4" />
                        </UIButton>
                        <UIButton variant="ghost" size="sm" onClick={() => handleDownloadDocument(document)}>
                          <Download className="h-4 w-4" />
                        </UIButton>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'vaccines' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Carteira de Vacinação</h3>
              <UIButton size="sm" onClick={() => setIsVaccineModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Vacina
              </UIButton>
            </div>

            <div className="space-y-3">
              {loadingVaccines ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-gray-500">Carregando vacinas...</p>
                </div>
              ) : vaccines.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Syringe className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Nenhuma vacina cadastrada</h3>
                  <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                    Ainda não há vacinas registradas para este pet. Clique no botão acima para registrar a primeira vacina.
                  </p>
                  <UIButton size="sm" onClick={() => setIsVaccineModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Primeira Vacina
                  </UIButton>
                </div>
              ) : (
                vaccines.map((vaccine) => (
                <div key={vaccine.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{vaccine.vaccineName}</h4>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(vaccine.status)}`}>
                          {getStatusLabel(vaccine.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {vaccine.status === 'APLICADA' ? 'Aplicada em: ' : 'Data: '}
                        {new Date(vaccine.vaccinationDate).toLocaleDateString('pt-BR')}
                      </p>
                      {vaccine.nextDueDate && (
                        <p className="text-sm text-gray-500">
                          Próxima dose: {new Date(vaccine.nextDueDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                      {vaccine.notes && (
                        <p className="text-sm text-gray-500">
                          Observações: {vaccine.notes}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {vaccine.batchNumber && `Lote: ${vaccine.batchNumber} • `}
                        Veterinário ID: {vaccine.vetId} • Registrado em: {new Date(vaccine.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {/* Botão de excluir */}
                    <button
                      onClick={() => handleDeleteVaccine(vaccine.id)}
                      className="ml-4 flex-shrink-0 rounded-full p-1 text-red-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      title="Excluir vacina"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Registro de Vacina */}
      {isVaccineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Registrar Nova Vacina</h3>
              <button
                onClick={() => {
                  setIsVaccineModalOpen(false);
                  resetVaccineForm();
                }}
                className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleVaccineSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Vacina *
                </label>
                <input
                  type="text"
                  required
                  value={vaccineFormData.vaccineName}
                  onChange={(e) => setVaccineFormData({ ...vaccineFormData, vaccineName: e.target.value })}
                  placeholder="Ex: V10 (Déctupla), Antirrábica..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Vacinação *
                </label>
                <input
                  type="date"
                  required
                  value={vaccineFormData.vaccinationDate}
                  onChange={(e) => setVaccineFormData({ ...vaccineFormData, vaccinationDate: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Próxima Dose (opcional)
                </label>
                <input
                  type="date"
                  value={vaccineFormData.nextDueDate}
                  onChange={(e) => setVaccineFormData({ ...vaccineFormData, nextDueDate: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número do Lote (opcional)
                </label>
                <input
                  type="text"
                  value={vaccineFormData.batchNumber}
                  onChange={(e) => setVaccineFormData({ ...vaccineFormData, batchNumber: e.target.value })}
                  placeholder="Ex: VAC2024001"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  required
                  value={vaccineFormData.status}
                  onChange={(e) => setVaccineFormData({ ...vaccineFormData, status: e.target.value as 'PENDENTE' | 'APLICADA' | 'ATRASADA' | 'NÃO APLICADA' })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="APLICADA">Aplicada</option>
                  <option value="ATRASADA">Atrasada</option>
                  <option value="NÃO APLICADA">Não Aplicada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  rows={3}
                  value={vaccineFormData.notes}
                  onChange={(e) => setVaccineFormData({ ...vaccineFormData, notes: e.target.value })}
                  placeholder="Ex: Fórmula nova, reações observadas..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <UIButton
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsVaccineModalOpen(false);
                    resetVaccineForm();
                  }}>
                  Cancelar
                </UIButton>
                <UIButton type="submit" className="flex-1">
                  Registrar Vacina
                </UIButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Documento */}
      {isDocumentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Adicionar Novo Documento</h3>
              <button
                onClick={() => {
                  setIsDocumentModalOpen(false);
                  resetDocumentForm();
                }}
                className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Documento *
                </label>
                <input
                  type="text"
                  required
                  value={documentFormData.title}
                  onChange={(e) => setDocumentFormData({ ...documentFormData, title: e.target.value })}
                  placeholder="Ex: Exame de Sangue - Janeiro 2025"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Arquivo *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setDocumentFormData({ ...documentFormData, file: e.target.files?.[0] || null })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Formatos aceitos: PDF, JPG, PNG, DOC, DOCX (máx. 10MB)
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <UIButton
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsDocumentModalOpen(false);
                    resetDocumentForm();
                  }}>
                  Cancelar
                </UIButton>
                <UIButton type="submit" className="flex-1">
                  Adicionar Documento
                </UIButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Agendar Consulta */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Agendar Nova Consulta</h3>
              <button
                onClick={() => {
                  setIsConsultationModalOpen(false);
                  resetConsultationForm();
                }}
                className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConsultationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data e Hora da Consulta *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={consultationFormData.date}
                  onChange={(e) => setConsultationFormData({ ...consultationFormData, date: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinário *
                </label>
                <input
                  type="text"
                  required
                  value={consultationFormData.veterinarian}
                  onChange={(e) => setConsultationFormData({ ...consultationFormData, veterinarian: e.target.value })}
                  placeholder="Ex: Dr. Maria Silva"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clínica/Hospital *
                </label>
                <input
                  type="text"
                  required
                  value={consultationFormData.clinic}
                  onChange={(e) => setConsultationFormData({ ...consultationFormData, clinic: e.target.value })}
                  placeholder="Ex: Clínica VetCare"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Consulta *
                </label>
                <textarea
                  required
                  rows={3}
                  value={consultationFormData.reason}
                  onChange={(e) => setConsultationFormData({ ...consultationFormData, reason: e.target.value })}
                  placeholder="Ex: Consulta de rotina, vacinação, exame..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <UIButton
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsConsultationModalOpen(false);
                    resetConsultationForm();
                  }}>
                  Cancelar
                </UIButton>
                <UIButton type="submit" className="flex-1">
                  Agendar Consulta
                </UIButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Consulta */}
      {isConsultationDetailsModalOpen && selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detalhes da Consulta</h3>
              <button
                onClick={closeConsultationDetailsModal}
                className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedConsultation.status)}`}>
                  {selectedConsultation.status === 'completed'
                    ? 'Realizada'
                    : selectedConsultation.status === 'scheduled'
                      ? 'Agendada'
                      : 'Cancelada'}
                </span>
              </div>

              {/* Data */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Data e Hora:</span>
                </div>
                <p className="text-gray-900 ml-8">
                  {new Date(selectedConsultation.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {selectedConsultation.date.includes('T') && (
                  <p className="text-gray-600 ml-8 text-sm">
                    às {new Date(selectedConsultation.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>

              {/* Veterinário */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Heart className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Veterinário:</span>
                </div>
                <p className="text-gray-900 ml-8">{selectedConsultation.veterinarian}</p>
              </div>

              {/* Clínica */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Info className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Local:</span>
                </div>
                <p className="text-gray-900 ml-8">{selectedConsultation.clinic}</p>
              </div>

              {/* Motivo */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-3 mb-2">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Motivo da Consulta:</span>
                </div>
                <p className="text-gray-900 ml-8">{selectedConsultation.reason}</p>
              </div>

              {/* Informações adicionais baseadas no status */}
              {selectedConsultation.status === 'scheduled' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Consulta Agendada</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Lembre-se de chegar com 15 minutos de antecedência.
                  </p>
                </div>
              )}

              {selectedConsultation.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Consulta Realizada</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Esta consulta foi concluída com sucesso.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
              <UIButton onClick={closeConsultationDetailsModal}>
                Fechar
              </UIButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização de Documento */}
      {isDocumentViewModalOpen && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="mx-4 w-full max-w-4xl h-[80vh] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedDocument.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(selectedDocument.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <UIButton 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDownloadDocument(selectedDocument)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </UIButton>
                <button
                  onClick={closeDocumentViewModal}
                  className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="h-full border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
              {/* Visualização do documento */}
              <div className="text-center w-full h-full p-4">
                {/* Preview do documento se for imagem */}
                {selectedDocument.document.toLowerCase().includes('.jpg') || 
                 selectedDocument.document.toLowerCase().includes('.jpeg') || 
                 selectedDocument.document.toLowerCase().includes('.png') || 
                 selectedDocument.document.toLowerCase().includes('.gif') ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={selectedDocument.document} 
                        alt={selectedDocument.title}
                        className="max-w-full max-h-full object-contain rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          // Se a imagem não carregar, mostrar fallback
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback se a imagem não carregar */}
                      <div className="hidden text-center">
                        <div className="mb-4">
                          <span className="text-6xl">📄</span>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Documento não pode ser visualizado
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Clique em "Baixar" para acessar o documento
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Para documentos não-imagem (PDF, DOC, etc.)
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="mb-4">
                      <span className="text-6xl">📄</span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Visualização de Documento
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Documento veterinário
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 max-w-md mx-auto">
                      <div className="text-left space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Título:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedDocument.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Data:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(selectedDocument.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Tamanho:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedDocument.documentLength} MB
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Clique em "Baixar" para salvar o documento
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  