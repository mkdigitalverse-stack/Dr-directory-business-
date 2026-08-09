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
  LAB = "diagnostic_lab",
  DIAGNOSTIC_LAB = "diagnostic_lab"
}

export type ProviderStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface ProviderLocation {
  id: string;
  isPrimary: boolean;
  address: string;
  locality: string;
  localityId: string;
  city: string;
  cityId: string;
  state: string;
  country: string;
  pinCode: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  whatsApp?: string;
  workingHours?: string;
  status?: "active" | "inactive";
  verificationStatus?: "pending" | "verified" | "rejected";
}

export interface ReviewMetric {
  doctorBehavior?: number; // 1-5
  waitingTime?: number; // 1-5
  cleanliness?: number; // 1-5
  staffBehavior?: number; // 1-5
  communication?: number; // 1-5
  treatmentSatisfaction?: number; // 1-5
}

export type ReviewStatus = "PENDING" | "PUBLISHED" | "REJECTED" | "FLAGGED" | "REMOVED" | "published" | "pending";

export interface ProviderResponseData {
  responseText: string;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewId?: string;
  providerId: string;
  patientUid?: string;
  appointmentId?: string;
  patientName: string;
  rating: number;
  comment: string;
  reviewText?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  verified: boolean;
  isVerified?: boolean;
  status?: ReviewStatus;
  metrics?: ReviewMetric;
  doctorBehaviour?: number;
  staffBehaviour?: number;
  waitingTime?: number;
  cleanliness?: number;
  communication?: number;
  treatmentSatisfaction?: number;
  providerResponse?: string | ProviderResponseData;
  providerResponseDate?: string;
}

export type ReportReason = 
  | "Spam" 
  | "Fake / fraudulent" 
  | "Offensive language" 
  | "Personal information" 
  | "Harassment" 
  | "Irrelevant content" 
  | "Misleading information" 
  | "Other";

export type ReportStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";

export interface ReviewReport {
  id: string;
  reviewId: string;
  providerId: string;
  reportedByUid: string;
  reporterName?: string;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
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

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW" | "pending" | "confirmed" | "cancelled" | "completed";

export interface StructuredService {
  id: string;
  name: string;
  description?: string;
  fee?: number;
  durationMinutes?: number;
}

export interface ProviderBookingSettings {
  onlineBookingEnabled: boolean;
  bookingMode: "instant" | "provider_confirmation";
  appointmentDurationMinutes?: number;
  noticeHoursRequired?: number;
  maxAdvanceDays?: number;
}

export interface Appointment {
  id: string;
  patientUid?: string;
  providerId: string;
  providerOwnerUid?: string;
  providerName: string;
  providerType: ProviderType;
  providerSpecialty?: string;
  providerImage?: string;
  serviceId?: string;
  serviceName?: string;
  locationId?: string;
  locationAddress?: string;
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  patientName: string;
  patientFirstName?: string;
  patientLastName?: string;
  patientEmail: string;
  patientPhone: string;
  patientMobile?: string;
  patientSymptoms?: string;
  patientNote?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: "General" | "Appointments" | "Fees & Payments" | "Insurance & Billing" | "Services & Facilities" | "Emergency";
  helpfulCount?: number;
  askedByPatient?: boolean;
}

export type VerificationStatus = "UNVERIFIED" | "VERIFICATION_PENDING" | "VERIFIED" | "VERIFICATION_REJECTED" | "VERIFICATION_EXPIRED" | "pending_verification" | "verified" | "rejected";

export interface ProviderCredentialData {
  fullName?: string;
  medicalRegistrationNumber?: string;
  registrationAuthority?: string;
  registrationYear?: string;
  qualification?: string;
  specialization?: string;
  legalBusinessName?: string;
  ownershipType?: string;
  licenseNumber?: string;
  responsibleOfficer?: string;
  addressDetails?: string;
  accreditationDetails?: string;
}

export interface VerificationDocumentRef {
  id: string;
  documentType: string;
  documentNumber?: string;
  fileName?: string;
  fileUrl?: string;
  uploadedAt: string;
}

export interface ProviderVerification {
  id: string;
  providerId: string;
  providerName?: string;
  requestedByUid?: string;
  providerType?: ProviderType;
  status: VerificationStatus;
  credentialData?: ProviderCredentialData;
  credentials?: {
    councilName?: string;
    registrationNumber?: string;
    registrationYear?: string;
    clinicLicenseNumber?: string;
  };
  documentReferences?: VerificationDocumentRef[];
  documents?: VerificationDocumentRef[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  reviewNotes?: string;
  notes?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Provider {
  id: string;
  ownerUid?: string;
  status?: ProviderStatus;
  locations?: ProviderLocation[];
  name: string;
  type: ProviderType;
  title?: string; // e.g. "Dr."
  email?: string; // Practitioner email for portal claims
  phone?: string;
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
  faqs?: FAQItem[];
  bookingSettings?: ProviderBookingSettings;
  structuredServices?: StructuredService[];
  directContact?: {
    phone?: string;
    whatsApp?: string;
    website?: string;
    directionsUrl?: string;
  };
  rating: number;
  reviewsCount: number;
  seoScore: number;
  profileCompletenessScore?: number;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
  draftData?: any;
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

export type ViewState = 
  | "home" 
  | "search" 
  | "profile" 
  | "about" 
  | "dashboard"
  | "privacy_policy"
  | "terms"
  | "medical_disclaimer"
  | "review_policy"
  | "provider_verification_policy"
  | "editorial_policy"
  | "contact"
  | "mission"
  | "vision"
  | "core_values";

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
  sort?: "relevance" | "rating" | "experience" | "fee_asc" | "fee_desc";
}

export type UserRole = "patient" | "doctor" | "clinic" | "hospital" | "diagnostic_lab" | "moderator" | "admin";

export type AccountStatus = "active" | "pending_verification" | "suspended" | "rejected" | "inactive";

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  gender: string;
  age: number;
  bloodGroup?: string;
}

export interface VerificationDocument {
  id: string;
  documentType: string;
  documentNumber: string;
  issueDate?: string;
  fileUrl?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export interface ProfileCompleteness {
  score: number;
  breakdown: {
    basicInfo: boolean;
    about: boolean;
    services: boolean;
    gallery: boolean;
    timings: boolean;
    verification: boolean;
    contact: boolean;
    faqs: boolean;
  };
  suggestions: { id: string; label: string; points: number }[];
}

export interface UserProfile {
  uid: string;
  displayName?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  lastLogin?: string;
  medicalRegistrationNumber?: string;
  qualification?: string;
  specialty?: string;
  facilityName?: string;
  address?: string;
  city?: string;
  locality?: string;
  familyMembers?: FamilyMember[];
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  verificationDocuments?: VerificationDocument[];
  profileScore?: ProfileCompleteness;
  providerId?: string;
  providerIds?: string[];
}

export interface ReceptionStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedClinicId: string;
  addedAt: string;
}

export interface HospitalDepartment {
  id: string;
  name: string;
  headDoctor: string;
  doctorCount: number;
  bedCapacity: number;
  availableBeds: number;
}

export interface LabTestItem {
  id: string;
  testName: string;
  category: string;
  price: number;
  sampleRequired: string;
  turnaroundTime: string;
  isHomeCollectionAvailable: boolean;
}

export interface LabReport {
  id: string;
  patientName: string;
  testName: string;
  date: string;
  status: "processing" | "ready" | "delivered";
  reportUrl?: string;
}

export interface AbuseReport {
  id: string;
  targetId: string;
  targetName: string;
  reporterName: string;
  reason: string;
  date: string;
  status: "pending" | "resolved" | "dismissed";
}

export interface AdvertCampaign {
  id: string;
  title: string;
  providerName: string;
  placement: "hero_banner" | "search_top" | "sidebar";
  budget: number;
  clicks: number;
  impressions: number;
  status: "active" | "paused" | "completed";
}

export interface AuditLog {
  id: string;
  actorUid?: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetUser?: string;
  entityType?: string;
  entityId?: string;
  timestamp: string;
  details: string;
}


