// Shared Application Type (matches backend response)
export interface IApplication {
  id: number;
  jobId?: number;
  role: string;
  company: string;
  location: string;
  salary: string;
  date: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  logo: string;
  jobUrl?: string;
  url?: string;
  description?: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
  appliedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileURL: string | null;
  authProvider: string;
}

export interface ApplicationStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}