'use server';

import { apiRequest } from '@/lib/api/config';

export interface PetDocument {
  id: number;
  petId: number;
  title: string;
  document: string; // URL do documento
  documentLength: string;
  createdAt: string;
}

export interface CreatePetDocumentDto {
  title: string;
  document: string; // base64
}

export async function getPetDocumentsAction(petId: number): Promise<{ success: boolean; documents?: PetDocument[]; error?: string }> {
  try {
    const data = await apiRequest<PetDocument[]>(`/pet-document/${petId}`, {
      method: 'GET',
    });
    
    return {
      success: true,
      documents: data || [],
    };
  } catch (error) {
    console.error('Erro ao buscar documentos do pet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
}

export async function createPetDocumentAction(petId: number, documentData: CreatePetDocumentDto): Promise<{ success: boolean; document?: PetDocument; error?: string }> {
  try {
    const data = await apiRequest<PetDocument>(`/pet-document/${petId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData),
    });
    
    return {
      success: true,
      document: data,
    };
  } catch (error) {
    console.error('Erro ao criar documento do pet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
    };
  }
} 