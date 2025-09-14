'use server';

import { apiRequest } from './config';

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

export interface VetReviewsResponse {
  data: VetReview[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface VetReviewFilters {
  page?: number;
  perPage?: number;
  rating?: number;
  minRating?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  anonymous?: boolean;
  orderBy?: 'rating' | 'createdAt' | 'authorName';
  orderDirection?: 'asc' | 'desc';
}

export interface RemoveReviewRequest {
  reviewId: number;
  reason: string;
}

export interface RemoveRequest {
  id: number;
  veterinarianId: number;
  reviewId: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export const getVetReviews = async (
  veterinarianId: number,
  filters: VetReviewFilters = {}
): Promise<VetReviewsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('veterinarianId', veterinarianId.toString());
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return apiRequest<VetReviewsResponse>(`/vet-reviews?${queryParams}`);
};

export const getMyVetReviews = async (filters: VetReviewFilters = {}): Promise<VetReviewsResponse> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return apiRequest<VetReviewsResponse>(`/vet-reviews/me?${queryParams}`);
};

export const createVetReview = async (reviewData: {
  veterinarianId: number;
  rating: number;
  comment?: string;
  anonymous?: boolean;
  authorName?: string;
  authorAvatar?: string;
}): Promise<VetReview> => {
  return apiRequest<VetReview>('/vet-reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
};

export const requestReviewRemoval = async (requestData: RemoveReviewRequest): Promise<RemoveRequest> => {
  return apiRequest<RemoveRequest>('/vet-reviews/remove-request', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
};

export const getRemoveRequests = async (filters: { page?: number; perPage?: number } = {}): Promise<{
  data: RemoveRequest[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}> => {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  return apiRequest<{
    data: RemoveRequest[];
    meta: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    };
  }>(`/vet-reviews/remove-requests?${queryParams}`);
}; 

export async function getMyVetReviewsServerAction(filters: VetReviewFilters = {}): Promise<{
  success: boolean;
  data?: VetReviewsResponse;
  error?: string;
}> {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiRequest<{
      reviews: VetReview[];
      total: number;
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>(`/vet-reviews/me?${queryParams}`);

    if (!response || !response.reviews) {
      return {
        success: false,
        error: 'Estrutura de dados inválida retornada pela API',
      };
    }

    const convertedResponse: VetReviewsResponse = {
      data: response.reviews,
      meta: response.pagination
    };

    return { success: true, data: convertedResponse };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao carregar reviews',
    };
  }
} 