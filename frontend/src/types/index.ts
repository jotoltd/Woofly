export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  description?: string;
  imageUrl?: string;
  qrCode: string;
  nfcId: string;
  userId: string;
  ownerPhone?: string;
  ownerEmail?: string;
  vetName?: string;
  vetPhone?: string;
  medicalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
