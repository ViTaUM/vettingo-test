// Enums
export enum Gender {
  M = 'M', // Masculino
  F = 'F', // Feminino
  O = 'O', // Outro
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  VETERINARIAN = 'VETERINARIAN',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
  INCOMPLETE = 'INCOMPLETE',
}

// Novos tipos para respostas da API
export interface PaginationMetaResponseDto {
  page: number; // página atual
  pageSize: number; // tamanho da página
  totalPages: number; // total de páginas
  total: number; // total de registros
  hasNext: boolean; // indica se há próxima página
  hasPrevious: boolean; // indica se há página anterior
}

export interface CountMetaResponseDto {
  activeCount: number; // quantidade de registros ativos
  inactiveCount: number; // quantidade de registros inativos
}

export interface PaginatedResponse<T> {
  pagination: PaginationMetaResponseDto;
  meta: CountMetaResponseDto;
  items: T[];
}

export interface ErrorResponseDto {
  statusCode: number; // código de status HTTP
  message: string; // mensagem de erro
  details?: unknown; // detalhes do erro (array para validações)
  error: string; // tipo do erro
  timestamp: string; // timestamp do erro
  path?: string; // caminho da requisição que gerou o erro
}

export interface LoginResponseDto {
  token: string;
}

export interface RegisterResponseDto {
  user: User;
  message: string;
}

// Interfaces Principais
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  role: Role;
  wantsNewsletter: boolean;
  cpf: string;
  birthDate: Date;
  gender: Gender;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Veterinarian {
  id: number;
  userId: number;
  bio: string | null;
  crmv: string;
  crmvStateId: number;
  phoneId?: number;
  professionalEmailId?: number;
  providesEmergencyService: boolean;
  providesHomeService: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Campos opcionais que podem vir em outras respostas
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  website?: string | null;
  phoneNumber?: string; // Kept for compatibility with existing usage if any
  professionalEmail?: string; // Kept for compatibility with existing usage if any
  profilePhotos?: string;
  deletedAt?: string | null;
  city?: City;
  state?: State;
  emails?: UserEmail[];
  phones?: UserPhone[];
  workLocations?: VeterinarianWorkLocation[];
  specializations?: SpecializationCategory[];
}

export interface VeterinarianSearchResult {
  id: number;
  name: string; // Nome completo
  crmv: string;
  bio: string | null;
  website?: string | null;
  avatar?: string | null;
  emergencial: boolean; // Serviço de emergência
  domiciliary: boolean; // Serviço domiciliar
  address?: string;
  schedule?: string; // JSON string com horários
  // Campos calculados/derivados que podem não vir do backend
  userId?: number;
  veterinarianId?: number;
  firstName?: string;
  lastName?: string;
  crmvStateId?: number;
  providesEmergencyService?: boolean;
  providesHomeService?: boolean;
  workLocationsCount?: string;
  isCurrentlyAttending?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserBillingInfo {
  id: number;
  userId: number;
  cpf?: string;
  cnpj?: string;
  fullName?: string;
  companyName?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipCode: string;
  cityId: number;
  stateId: number;
  stripeCustomerId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface State {
  id: number;
  name: string;
  uf: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface City {
  id: number;
  name: string;
  active: boolean;
  stateId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpecializationCategory {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  specializations: Specialization[];
}

export interface Specialization {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface SubscriptionPlanData {
  id: number;
  name: string;
  slug: SubscriptionPlan;
  description?: string;
  priceMonthly?: number;
  priceYearly?: number;
  features?: string;
  maxListings?: number;
  maxPhotos?: number;
  highlightListings: boolean;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface UserEmail {
  id: number;
  userId: number;
  email: string;
  isActive: boolean;
  isPublic: boolean;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPhone {
  id: number;
  userId: number;
  number: string;
  ddd: string;
  ddi: string;
  isPublic: boolean;
  isPrimary: boolean;
  isWhatsApp: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface WorkSchedule {
  id: number;
  vetWorkLocationId: number;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  startTime: string; // formato "HH:MM:SS"
  endTime: string; // formato "HH:MM:SS"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VeterinarianWorkLocation {
  id: number;
  veterinarianId: number;
  stateId: number;
  cityId: number;
  name: string;
  address: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  id: number;
  userId: number;
  type: string; // 'personal', 'work', 'billing', etc.
  label?: string; // ex: "Casa", "Clínica Principal"
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipCode: string;
  cityId: number;
  stateId: number;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Pet {
  id: number;
  name: string;
  ownerId: number;
  petTypeId: number;
  breed?: string;
  birthDate?: Date; // Date object
  gender?: Gender; // M, F ou O
  weight?: string; // Ex: "3.5kg"
  hasPedigree: boolean;
  pedigreeNumber?: string;
  avatar?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// Mapper para compatibilidade com resposta da nova API
export function mapPaginatedResponse<T>(response: PaginatedResponse<T>): PaginatedResult<T> {
  return {
    data: response.items,
    pagination: {
      page: response.pagination.page,
      perPage: response.pagination.pageSize,
      total: response.pagination.total,
      totalPages: response.pagination.totalPages,
    },
  };
}

export interface VeterinarianProfile {
  id: number;
  veterinarianId: number;
  crmv: string;
  crmvState: string;
  biography?: string;
  experience?: string;
  emergencyService: boolean;
  homeService: boolean;
  onlineService: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserSpecialization {
  id: number;
  userId: number;
  specializationId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  specialization: Specialization;
}

// Pet Type Category Interfaces
export interface PetTypeCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string; // format: date-time
  updatedAt: string; // format: date-time
  deletedAt?: string | null; // format: date-time
}

export interface CreatePetTypeCategoryDto {
  name: string; // min: 2, max: 100
  description?: string; // max: 500, nullable
}

export interface UpdatePetTypeCategoryDto {
  isActive?: boolean; // default: true
}

export interface PetTypeCategoryListResponseDto {
  total: number;
  meta: CountMetaResponseDto;
  items: PetTypeCategory[];
}

// Novos interfaces para estatísticas de categorias
export interface PetTypeCategoryStatisticsResponse {
  categories: PetTypeCategory[];
  totalActive: number;
  totalInactive: number;
}

export interface PetTypeCategoryStatisticsResponseDto {
  categories: PetTypeCategory[];
  totalActive: number;
  totalInactive: number;
}

// Pet Type Interfaces
export interface PetType {
  id: number; // ID único do tipo de pet
  categoryId: number; // ID da categoria
  name: string; // min: 2, max: 100
  description?: string | null; // max: 500
  isActive: boolean; // default: true
  createdAt: string; // format: date-time
  updatedAt: string; // format: date-time
  deletedAt?: string | null; // format: date-time
}

export interface CreatePetTypeDto {
  categoryId: number; // min: 1
  name: string; // min: 2, max: 100
  description?: string; // max: 500, nullable
}

export interface UpdatePetTypeDto {
  isActive?: boolean; // default: true
}

export interface PetTypeListResponseDto {
  total: number;
  meta: CountMetaResponseDto;
  items: PetType[];
}

export interface PetTypesByCategoryResponseDto {
  petTypes: PetType[];
  total: number;
  categoryInfo: CategoryInfoResponseDto;
  meta: CountMetaResponseDto;
}

export interface CategoryInfoResponseDto {
  id: number; // ID da categoria
  name: string; // nome da categoria
}

// Pet Creation and Update DTOs
export interface CreatePetDto {
  name: string; // min: 2, max: 100
  petTypeId: number;
  breed?: string; // max: 100
  birthDate?: string; // format: date
  gender?: 'M' | 'F' | 'O';
  weight?: string; // max: 20, ex: "25.5kg"
  hasPedigree?: boolean; // default: false
  pedigreeNumber?: string; // pattern: ^[A-Z0-9\-]{3,20}$, required if hasPedigree is true
  avatar?: string; // URL
  description?: string; // max: 500
}

export interface UpdatePetDto {
  name?: string; // min: 2, max: 100
  ownerId?: number;
  petTypeId?: number;
  breed?: string; // max: 100
  birthDate?: string; // format: date
  gender?: 'M' | 'F' | 'O';
  weight?: string; // max: 20
  hasPedigree?: boolean;
  pedigreeNumber?: string; // pattern: ^[A-Z0-9\-]{3,20}$
  avatar?: string;
  description?: string; // max: 500
}

export interface VetReview {
  id: number;
  anonymous: boolean;
  authorName?: string;
  authorAvatar?: string;
  veterinarianId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VetReviewRemoveRequest {
  id: number;
  veterinarianId: number;
  reviewId: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface VetReviewsResponse {
  reviews: VetReview[];
  total: number;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateVetReviewDto {
  veterinarianId: number;
  anonymous: boolean;
  authorName?: string;
  authorAvatar?: string;
  rating: number;
  comment?: string;
}

export interface CreateRemoveRequestDto {
  reviewId: number;
  reason: string;
}

export enum VeterinarianApprovalStatus {
  WAITING_DATA = 'WAITING_DATA',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface VeterinarianApproval {
  id: number;
  veterinarianId: number;
  rgFrontImageUrl?: string;
  rgBackImageUrl?: string;
  crmvDocumentImageUrl?: string;
  status: VeterinarianApprovalStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: number;
  rejectedAt?: string;
  rejectedBy?: number;
  rejectionReason?: string;
}

export interface SubmitApprovalDocumentsDto {
  rgFrontImage: string;
  rgBackImage: string;
  crmvDocumentImage: string;
}
