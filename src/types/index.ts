export interface Visit {
  id: string;
  patientName: string;
  insuranceCompany: string;
  location: string;
  date: string;
  time: string;
  revenue: number;
  reminder: boolean;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}