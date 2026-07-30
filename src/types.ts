export interface Locality {
  id: string;
  name: string;
  zone?: string;
  cityId: string;
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  localities: Locality[];
}

export interface State {
  id: string;
  name: string;
  cities: City[];
}

export enum ProviderType {
  DOCTOR = "doctor",
  CLINIC = "clinic",
  HOSPITAL = "hospital",
  LAB = "diagnostic_lab"
}

export interface ReviewMetric {
  doctorBehavior: number; // 1-5
  waitingTime: number; // 1-5
  cleanliness: number; // 1-5
  staffBehavior: number; // 1-5
  communication: number; // 1-5
  treatmentSatisfaction: number; // 1-5
}

export interface Review {
  id: string;
  providerId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  metrics: ReviewMetric;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g. "10:00 AM"
  isAvailable: boolean;
}

export interface DayAvailability {
  day: string; // e.g. "Monday"
  slots: TimeSlot[];
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientSymptoms: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  title?: string; // e.g. "Dr."
  email?: string; // Practitioner email for portal claims
  image: string;
  verified: boolean;
  medicalRegistrationNumber?: string;
  qualification?: string;
  experienceYears: number;
  specialties: string[];
  treatments: string[];
  conditionsManaged?: string[];
  localityId: string;
  cityId: string;
  address: string;
  consultationFee: number;
  languages: string[];
  availability: DayAvailability[];
  about: string;
  services: string[];
  facilities?: string[];
  insuranceAccepted?: string[];
  emergencyServices: boolean;
  awards?: string[];
  memberships?: string[];
  education?: string[];
  gallery?: string[];
  videos?: string[];
  landmarks?: string[];
  rating: number;
  reviewsCount: number;
  seoScore: number;
}

export interface HealthPackage {
  id: string;
  name: string;
  description: string;
  testsIncluded: string[];
  price: number;
  originalPrice: number;
  duration: string; // e.g. "1 Day"
  recommendedFor: string;
  image?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

export type ViewState = "home" | "search" | "profile" | "about" | "dashboard";

export interface SearchParams {
  query: string;
  type: ProviderType | "all";
  specialty: string;
  locality: string;
  city: string;
  gender: string;
  experience: string; // e.g. "5+", "10+"
  fee: string; // e.g. "<500", "500-1000", ">1000"
  rating: string; // e.g. "4.0+"
  availability: string; // e.g. "today", "tomorrow"
  insurance: string;
  language: string;
  onlineConsultation: boolean;
  emergencyServices: boolean;
}
