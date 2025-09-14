// src/utils/mock-data.ts

export const mockReviews = [
  {
    id: 'rev1',
    userName: 'Ana Silva',
    userAvatar: '/placeholder-avatar.png', // Placeholder path
    rating: 5,
    comment: 'Excelente atendimento! Muito atencioso e cuidadoso com meu cachorro.',
    date: '2024-04-28T10:30:00Z',
  },
  {
    id: 'rev2',
    userName: 'Carlos Souza',
    userAvatar: '/placeholder-avatar.png',
    rating: 4,
    comment: 'Bom profissional, explicou tudo direitinho. A clínica poderia ser mais organizada.',
    date: '2024-04-25T15:00:00Z',
  },
  {
    id: 'rev3',
    userName: 'Mariana Lima',
    userAvatar: '/placeholder-avatar.png',
    rating: 2,
    comment:
      'Não gostei da abordagem, pareceu um pouco apressado e não respondeu todas as minhas dúvidas claramente. A consulta foi cara.', // Exemplo de review negativa
    date: '2024-04-20T09:15:00Z',
  },
];

export const mockAddresses = [
  {
    id: 'addr1',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    isPrimary: true, // Indicate primary address if needed
  },
  {
    id: 'addr2',
    street: 'Avenida Principal',
    number: '456',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01400-000',
    isPrimary: false,
  },
];

// Mock user data for profile editing (can be expanded based on Prisma schema)
export const mockVetUserData = {
  id: 'vet-user-123',
  firstName: 'Dr. João',
  lastName: 'Pereira',
  email: 'joao.pereira@vetmail.com',
  avatar: '/vet-avatar.png', // Placeholder
};

export const mockVetProfileData = {
  id: 'vet-profile-456',
  crmv: 'SP-12345',
  bio: 'Veterinário apaixonado por animais, com 10 anos de experiência em clínica de pequenos animais. Especializado em dermatologia e cardiologia veterinária.',
  phone: '(11) 98765-4321',
  website: 'https://joaovet.com.br',
  instagram: '@joaovet',
  linkedin: 'linkedin.com/in/joaovet',
  userId: 'vet-user-123',
  specialties: [
    // Example based on schema, might need fetching real specialties
    { id: 'spec1', name: 'Dermatologia' },
    { id: 'spec2', name: 'Cardiologia' },
  ],
};
