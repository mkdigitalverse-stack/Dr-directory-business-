import { State, City, Locality, Provider, ProviderType, HealthPackage, Article, Review } from "./types";

// Lucknow Localities
export const LOCALITIES: Locality[] = [
  { id: "gomti-nagar", name: "Gomti Nagar", zone: "East", cityId: "lucknow" },
  { id: "indira-nagar", name: "Indira Nagar", zone: "East", cityId: "lucknow" },
  { id: "hazratganj", name: "Hazratganj", zone: "Central", cityId: "lucknow" },
  { id: "aliganj", name: "Aliganj", zone: "North", cityId: "lucknow" },
  { id: "ashiyana", name: "Ashiyana", zone: "South", cityId: "lucknow" },
  { id: "alambagh", name: "Alambagh", zone: "South", cityId: "lucknow" },
  { id: "rajajipuram", name: "Rajajipuram", zone: "West", cityId: "lucknow" },
  { id: "jankipuram", name: "Jankipuram", zone: "North", cityId: "lucknow" },
  { id: "mahanagar", name: "Mahanagar", zone: "Central", cityId: "lucknow" },
  { id: "vikas-nagar", name: "Vikas Nagar", zone: "North", cityId: "lucknow" }
];

export const CITIES: City[] = [
  {
    id: "lucknow",
    name: "Lucknow",
    stateId: "uttar-pradesh",
    localities: LOCALITIES
  },
  {
    id: "kanpur",
    name: "Kanpur",
    stateId: "uttar-pradesh",
    localities: [
      { id: "civil-lines-kanpur", name: "Civil Lines", cityId: "kanpur" },
      { id: "swaroop-nagar", name: "Swaroop Nagar", cityId: "kanpur" }
    ]
  },
  {
    id: "noida",
    name: "Noida",
    stateId: "uttar-pradesh",
    localities: [
      { id: "sector-62", name: "Sector 62", cityId: "noida" },
      { id: "sector-15", name: "Sector 15", cityId: "noida" }
    ]
  }
];

export const STATES: State[] = [
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    cities: CITIES
  },
  {
    id: "delhi",
    name: "Delhi NCR",
    cities: [
      {
        id: "new-delhi",
        name: "New Delhi",
        stateId: "delhi",
        localities: [
          { id: "connaught-place", name: "Connaught Place", cityId: "new-delhi" },
          { id: "saket", name: "Saket", cityId: "new-delhi" }
        ]
      }
    ]
  }
];

export const SPECIALTIES = [
  { id: "cardiology", name: "Cardiology", icon: "Heart" },
  { id: "dentistry", name: "Dentistry", icon: "Smile" },
  { id: "gynecology", name: "Gynecology & Obstetrics", icon: "Baby" },
  { id: "orthopedics", name: "Orthopedics & Joint Replacement", icon: "Activity" },
  { id: "dermatology", name: "Dermatology", icon: "Sparkles" },
  { id: "pediatrics", name: "Pediatrics & Neonatal Care", icon: "User" },
  { id: "endocrinology", name: "Endocrinology & Diabetes", icon: "Flame" },
  { id: "ophthalmology", name: "Ophthalmology (Eye)", icon: "Eye" },
  { id: "neurology", name: "Neurology", icon: "Cpu" },
  { id: "general-medicine", name: "General Medicine", icon: "Stethoscope" }
];

export const TREATMENTS = [
  "Dental Implant",
  "IVF",
  "Pregnancy Care",
  "Diabetes Management",
  "Heart Valve Care",
  "Knee Replacement",
  "Eye Cataract Surgery",
  "Skin Laser Treatment",
  "Root Canal Therapy",
  "Hypertension Management",
  "Thyroid Disorders",
  "Arthritis Management"
];

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: "dr-anand-verma",
    name: "Anand Verma",
    title: "Dr.",
    type: ProviderType.DOCTOR,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "MCI-45892",
    qualification: "MD, DM (Cardiology), FACC",
    experienceYears: 18,
    specialties: ["Cardiology", "General Medicine"],
    treatments: ["Heart Valve Care", "Hypertension Management", "Heart Care"],
    conditionsManaged: ["Arrhythmia", "Coronary Artery Disease", "Heart Failure", "Hypertension"],
    localityId: "gomti-nagar",
    cityId: "lucknow",
    address: "B-2, Patrakar Puram Crossing, Gomti Nagar, Lucknow, UP - 226010",
    consultationFee: 800,
    languages: ["English", "Hindi"],
    availability: [
      {
        day: "Monday",
        slots: [
          { id: "mon-1", time: "10:00 AM", isAvailable: true },
          { id: "mon-2", time: "11:30 AM", isAvailable: true },
          { id: "mon-3", time: "05:00 PM", isAvailable: true },
          { id: "mon-4", time: "06:30 PM", isAvailable: false }
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { id: "wed-1", time: "10:00 AM", isAvailable: true },
          { id: "wed-2", time: "11:30 AM", isAvailable: false },
          { id: "wed-3", time: "05:00 PM", isAvailable: true }
        ]
      },
      {
        day: "Friday",
        slots: [
          { id: "fri-1", time: "10:00 AM", isAvailable: true },
          { id: "fri-2", time: "11:30 AM", isAvailable: true },
          { id: "fri-3", time: "05:00 PM", isAvailable: true }
        ]
      }
    ],
    about: "Dr. Anand Verma is a senior Interventional Cardiologist in Gomti Nagar, Lucknow, with over 18 years of clinical expertise. He specializes in complex angioplasties, coronary stenting, pacemakers, and heart failure management. He is a life-member of the Cardiological Society of India.",
    services: [
      "Interventional Cardiology",
      "Echocardiography (2D Echo)",
      "Treadmill Test (TMT)",
      "Holter Monitoring",
      "Ambulatory Blood Pressure Monitoring"
    ],
    facilities: ["Advanced ECG", "Ultrasonic Echo Laboratory", "In-house Pharmacy", "Valet Parking"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "ICICI Lombard", "Niva Bupa"],
    emergencyServices: true,
    awards: ["Best Cardiologist Award UP Healthcare Summit 2023", "Sharda Seva Puraskar 2021"],
    memberships: ["Cardiological Society of India (CSI)", "Indian College of Cardiology (ICC)"],
    education: [
      "MBBS - King George's Medical University (KGMU), Lucknow",
      "MD (Medicine) - KGMU, Lucknow",
      "DM (Cardiology) - Sanjay Gandhi Post Graduate Institute of Medical Sciences (SGPGIMS), Lucknow"
    ],
    landmarks: ["Near Patrakar Puram Police Station", "Opposite Lucknow One Mall"],
    rating: 4.8,
    reviewsCount: 124,
    seoScore: 95
  },
  {
    id: "dr-shambhavi-mishra",
    name: "Shambhavi Mishra",
    title: "Dr.",
    type: ProviderType.DOCTOR,
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "UPMC-89547",
    qualification: "MS (Obstetrics & Gynecology), IVF Specialist",
    experienceYears: 12,
    specialties: ["Gynecology", "Pregnancy Care"],
    treatments: ["IVF", "Pregnancy Care", "Hysteroscopy"],
    conditionsManaged: ["Infertility", "PCOS/PCOD", "High-Risk Pregnancy", "Fibroids"],
    localityId: "hazratganj",
    cityId: "lucknow",
    address: "Flat 101, Halwasiya Court, Hazratganj, Lucknow, UP - 226001",
    consultationFee: 700,
    languages: ["English", "Hindi", "Urdu"],
    availability: [
      {
        day: "Tuesday",
        slots: [
          { id: "tue-1", time: "11:00 AM", isAvailable: true },
          { id: "tue-2", time: "12:30 PM", isAvailable: true },
          { id: "tue-3", time: "04:30 PM", isAvailable: true }
        ]
      },
      {
        day: "Thursday",
        slots: [
          { id: "thu-1", time: "11:00 AM", isAvailable: true },
          { id: "thu-2", time: "12:30 PM", isAvailable: false },
          { id: "thu-3", time: "04:30 PM", isAvailable: true }
        ]
      },
      {
        day: "Saturday",
        slots: [
          { id: "sat-1", time: "11:00 AM", isAvailable: true },
          { id: "sat-2", time: "12:30 PM", isAvailable: true }
        ]
      }
    ],
    about: "Dr. Shambhavi Mishra is a renowned Gynecologist, Obstetrician, and Reproductive Endocrinologist in Hazratganj, Lucknow. She is dedicated to providing compassionate, evidence-based maternity and IVF solutions with a patient-centric approach.",
    services: [
      "In Vitro Fertilization (IVF)",
      "Intrauterine Insemination (IUI)",
      "High-Risk Obstetric Care",
      "Laparoscopic Gynae Surgery"
    ],
    facilities: ["Advanced USG Scan", "Modular Embryology Lab", "Cozy Recovery Suites"],
    insuranceAccepted: ["Aditya Birla Health", "Care Health Insurance", "Star Health"],
    emergencyServices: true,
    awards: ["UP Woman Achiever in Medicine 2024", "Excellence in Fertility Services Award"],
    memberships: ["Federation of Obstetric and Gynaecological Societies of India (FOGSI)", "Indian Society for Assisted Reproduction (ISAR)"],
    education: [
      "MBBS - KGMU, Lucknow",
      "MS (Obstetrics & Gynecology) - Institute of Medical Sciences, BHU, Varanasi",
      "Fellowship in Reproductive Medicine - NUH, Singapore"
    ],
    landmarks: ["Near Hazratganj Metro Station Exit 2", "Behind Mayfair Cinema Building"],
    rating: 4.9,
    reviewsCount: 96,
    seoScore: 92
  },
  {
    id: "dr-vivek-tandon",
    name: "Vivek Tandon",
    title: "Dr.",
    type: ProviderType.DOCTOR,
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "MCI-77312",
    qualification: "MCh (Orthopedics), Joint Replacement Fellowship",
    experienceYears: 15,
    specialties: ["Orthopedics"],
    treatments: ["Knee Replacement", "Arthritis Management"],
    conditionsManaged: ["Osteoarthritis", "Ligament Tears", "Joint Pain", "Spine Disorders"],
    localityId: "aliganj",
    cityId: "lucknow",
    address: "Sec-B, Kapoorthala Crossing, Aliganj, Lucknow, UP - 226024",
    consultationFee: 600,
    languages: ["English", "Hindi"],
    availability: [
      {
        day: "Monday",
        slots: [
          { id: "mon-o1", time: "02:00 PM", isAvailable: true },
          { id: "mon-o2", time: "03:30 PM", isAvailable: true }
        ]
      },
      {
        day: "Tuesday",
        slots: [
          { id: "tue-o1", time: "02:00 PM", isAvailable: true },
          { id: "tue-o2", time: "03:30 PM", isAvailable: false }
        ]
      },
      {
        day: "Thursday",
        slots: [
          { id: "thu-o1", time: "02:00 PM", isAvailable: true },
          { id: "thu-o2", time: "03:30 PM", isAvailable: true }
        ]
      }
    ],
    about: "Dr. Vivek Tandon is a leading Joint Replacement and Orthopedic Surgeon based in Aliganj, Lucknow. He specializes in minimally invasive total knee and hip replacements and sports injury ligament reconstructions.",
    services: [
      "Total Knee Replacement (TKR)",
      "Total Hip Replacement (THR)",
      "Arthroscopic ACL/PCL Surgery",
      "Fracture Management"
    ],
    facilities: ["Digital X-Ray Lab", "Advanced Physiotherapy Unit", "Wheelchair Accessible Clinic"],
    insuranceAccepted: ["SBI General Health", "Niva Bupa", "HDFC ERGO"],
    emergencyServices: false,
    awards: ["UP Excellence in Orthopedic Surgery 2022"],
    memberships: ["Indian Orthopaedic Association (IOA)", "Uttar Pradesh Orthopaedic Association (UPOA)"],
    education: [
      "MBBS - GSVM Medical College, Kanpur",
      "MS (Orthopedics) - KGMU, Lucknow",
      "Fellowship in Joint Replacement - Munich, Germany"
    ],
    landmarks: ["Near Kapoorthala Chauraha", "Opposite Bank of Baroda Regional Branch"],
    rating: 4.7,
    reviewsCount: 88,
    seoScore: 89
  },
  {
    id: "dr-ritu-singhal",
    name: "Ritu Singhal",
    title: "Dr.",
    type: ProviderType.DOCTOR,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "UPMC-10332",
    qualification: "MDS (Orthodontics & Dentofacial Orthopedics)",
    experienceYears: 10,
    specialties: ["Dentistry"],
    treatments: ["Dental Implant", "Root Canal Therapy", "Teeth Alignment"],
    conditionsManaged: ["Dental Caries", "Malocclusion", "Gingivitis", "Impacted Teeth"],
    localityId: "indira-nagar",
    cityId: "lucknow",
    address: "C-821, Shalimar Plaza, Faizabad Road, Indira Nagar, Lucknow, UP - 226016",
    consultationFee: 400,
    languages: ["English", "Hindi"],
    availability: [
      {
        day: "Monday",
        slots: [
          { id: "mon-d1", time: "10:00 AM", isAvailable: true },
          { id: "mon-d2", time: "11:00 AM", isAvailable: true },
          { id: "mon-d3", time: "12:00 PM", isAvailable: true }
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { id: "wed-d1", time: "10:00 AM", isAvailable: true },
          { id: "wed-d2", time: "11:00 AM", isAvailable: false },
          { id: "wed-d3", time: "12:00 PM", isAvailable: true }
        ]
      },
      {
        day: "Saturday",
        slots: [
          { id: "sat-d1", time: "10:00 AM", isAvailable: true },
          { id: "sat-d2", time: "11:00 AM", isAvailable: true }
        ]
      }
    ],
    about: "Dr. Ritu Singhal is a compassionate and highly skilled Orthodontist and Cosmetic Dentist practicing in Indira Nagar, Lucknow. She is dedicated to creating flawless smiles with invisible aligners and durable dental implants.",
    services: [
      "Invisalign & Clear Aligners",
      "Metal and Ceramic Braces",
      "Single-sitting Root Canal (RCT)",
      "Smile Designing"
    ],
    facilities: ["3D Intraoral Scanner", "RVG Digital Dental X-Ray", "Sterile Dental Operatory"],
    insuranceAccepted: ["Religare Health", "ManipalCigna"],
    emergencyServices: false,
    awards: ["Best Dentist in Lucknow Central 2023"],
    memberships: ["Indian Dental Association (IDA)", "Indian Orthodontic Society (IOS)"],
    education: [
      "BDS - Faculty of Dental Sciences, KGMU, Lucknow",
      "MDS (Orthodontics) - Faculty of Dental Sciences, KGMU, Lucknow"
    ],
    landmarks: ["Near Lekhraj Metro Station", "Above Shalimar Sweets"],
    rating: 4.6,
    reviewsCount: 64,
    seoScore: 88
  },
  {
    id: "gomti-nagar-multispecialty-clinic",
    name: "Gomti Nagar Multispecialty Clinic",
    type: ProviderType.CLINIC,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-CLN-88219",
    experienceYears: 15,
    specialties: ["Cardiology", "Dentistry", "Gynecology", "General Medicine"],
    treatments: ["Diabetes Management", "Hypertension Management", "Root Canal Therapy", "Pregnancy Care"],
    localityId: "gomti-nagar",
    cityId: "lucknow",
    address: "CP-4, Viraj Khand, Gomti Nagar, Lucknow, UP - 226010",
    consultationFee: 500,
    languages: ["English", "Hindi"],
    availability: [
      {
        day: "Monday",
        slots: [
          { id: "cl-1", time: "09:00 AM", isAvailable: true },
          { id: "cl-2", time: "12:00 PM", isAvailable: true },
          { id: "cl-3", time: "06:00 PM", isAvailable: true }
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { id: "cl-4", time: "09:00 AM", isAvailable: true },
          { id: "cl-5", time: "12:00 PM", isAvailable: true },
          { id: "cl-6", time: "06:00 PM", isAvailable: true }
        ]
      },
      {
        day: "Friday",
        slots: [
          { id: "cl-7", time: "09:00 AM", isAvailable: true },
          { id: "cl-8", time: "12:00 PM", isAvailable: true },
          { id: "cl-9", time: "06:00 PM", isAvailable: true }
        ]
      }
    ],
    about: "Gomti Nagar Multispecialty Clinic is a premier family healthcare destination offering high-quality outpatient care, consultation diagnostics, and preventive medicine under one roof. Established in 2011, it serves over 20,000 satisfied patients.",
    services: [
      "Consultation of Senior Specialists",
      "Fully Automated Clinical Lab",
      "Minor Surgical Procedures",
      "Vaccination and Preventive Care"
    ],
    facilities: ["Advanced ECG Unit", "X-Ray Lab", "Air-Conditioned Waiting Hall", "Ample Parking"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "SBI General"],
    emergencyServices: true,
    awards: ["Most Trusted Outpatient Clinic Award Lucknow 2023"],
    education: ["NABL Accredited Lab Partnership", "State-of-the-Art Diagnostic Devices"],
    landmarks: ["Near Sahara Hospital Road", "Opposite Singapore Mall Entrance"],
    rating: 4.7,
    reviewsCount: 215,
    seoScore: 94
  },
  {
    id: "avadh-super-specialty-hospital",
    name: "Avadh Super Specialty Hospital",
    type: ProviderType.HOSPITAL,
    image: "https://images.unsplash.com/photo-1586773860418-d3b3de97e963?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-HSP-44391",
    experienceYears: 25,
    specialties: ["Cardiology", "Gynecology", "Orthopedics", "Neurology", "Pediatrics"],
    treatments: ["Heart Valve Care", "IVF", "Pregnancy Care", "Knee Replacement", "Spine Surgery"],
    localityId: "ashiyana",
    cityId: "lucknow",
    address: "Sector G, Kanpur Road, Ashiyana, Lucknow, UP - 226012",
    consultationFee: 1000,
    languages: ["English", "Hindi", "Urdu", "Punjabi"],
    availability: [
      {
        day: "Monday",
        slots: [{ id: "h-mon", time: "24 Hours Open (Emergency)", isAvailable: true }]
      },
      {
        day: "Tuesday",
        slots: [{ id: "h-tue", time: "24 Hours Open (Emergency)", isAvailable: true }]
      },
      {
        day: "Wednesday",
        slots: [{ id: "h-wed", time: "24 Hours Open (Emergency)", isAvailable: true }]
      },
      {
        day: "Thursday",
        slots: [{ id: "h-thu", time: "24 Hours Open (Emergency)", isAvailable: true }]
      },
      {
        day: "Friday",
        slots: [{ id: "h-fri", time: "24 Hours Open (Emergency)", isAvailable: true }]
      },
      {
        day: "Saturday",
        slots: [{ id: "h-sat", time: "24 Hours Open (Emergency)", isAvailable: true }]
      },
      {
        day: "Sunday",
        slots: [{ id: "h-sun", time: "24 Hours Open (Emergency)", isAvailable: true }]
      }
    ],
    about: "Avadh Super Specialty Hospital is a 300-bedded state-of-the-art medical institution in Ashiyana, Lucknow. It is equipped with advanced modular ICUs, ultra-modern cath labs, emergency critical care beds, and a specialized IVF and organ transplant wing. Fully NABH and NABL accredited.",
    services: [
      "24/7 Level-1 Trauma and Emergency Care",
      "Coronary Artery Bypass Grafting (CABG)",
      "Comprehensive Joint Replacement & Trauma",
      "NICU and Pediatric Emergency Unit",
      "Advanced Organ Transplant Wing"
    ],
    facilities: [
      "4 Advanced Modular OTs",
      "24/7 Blood Bank & Trauma Center",
      "MRI and CT Scan Facility",
      "Ambulance Services with Ventilator Support",
      "Inpatient Multi-cuisine Cafeteria"
    ],
    insuranceAccepted: ["Star Health", "Max Bupa", "HDFC Ergo", "ICICI Lombard", "CGHS", "ECHS"],
    emergencyServices: true,
    awards: ["Best Hospital in Central Uttar Pradesh 2024", "National Patient Safety Initiative Excellence"],
    memberships: ["National Accreditation Board for Hospitals (NABH)", "Association of Healthcare Providers India (AHPI)"],
    education: ["DNB Postgraduate Training Center", "Nursing Excellence Certified"],
    landmarks: ["Near Ashiyana Power House Chauraha", "Opposite Smriti Vihar Park"],
    rating: 4.9,
    reviewsCount: 1420,
    seoScore: 98
  },
  {
    id: "lucknow-pathology-labs",
    name: "Lucknow Clinical Diagnostics & Pathology Labs",
    type: ProviderType.LAB,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351167?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-LAB-12894",
    experienceYears: 20,
    specialties: ["General Medicine"],
    treatments: ["Diabetes Management", "Blood Test Profiles", "Hormonal Assays"],
    localityId: "mahanagar",
    cityId: "lucknow",
    address: "Block A, Mandir Marg, Mahanagar, Lucknow, UP - 226006",
    consultationFee: 200,
    languages: ["English", "Hindi"],
    availability: [
      {
        day: "Monday",
        slots: [
          { id: "lab-1", time: "07:00 AM (Home Sample)", isAvailable: true },
          { id: "lab-2", time: "09:00 AM", isAvailable: true },
          { id: "lab-3", time: "03:00 PM", isAvailable: true }
        ]
      },
      {
        day: "Wednesday",
        slots: [
          { id: "lab-4", time: "07:00 AM (Home Sample)", isAvailable: true },
          { id: "lab-5", time: "09:00 AM", isAvailable: true }
        ]
      },
      {
        day: "Saturday",
        slots: [
          { id: "lab-6", time: "07:00 AM (Home Sample)", isAvailable: true },
          { id: "lab-7", time: "09:00 AM", isAvailable: true }
        ]
      }
    ],
    about: "Lucknow Clinical Diagnostics & Pathology Labs is a NABL-accredited laboratory providing premium diagnostic and path testing services. With highly sterile protocols and home collection facilities across Lucknow, we deliver reports within 6-12 hours with absolute accuracy.",
    services: [
      "NABL Accredited Lab Pathology",
      "Home Sample Collection across Lucknow",
      "Corporate Health Screenings",
      "Allergy Profiles & DNA Assays"
    ],
    facilities: ["NABL Accredited Setup", "Barcoded Sample Tracking", "Fully Automated Analyzers", "Wheelchair Accessible"],
    insuranceAccepted: ["Reimbursable by all Major Corporates and Insurances"],
    emergencyServices: true,
    awards: ["UP Quality Diagnostic Laboratory 2023"],
    education: ["NABL Certificate No. MC-3102"],
    landmarks: ["Near Mahanagar Chauraha", "Beside Central Bank of India"],
    rating: 4.8,
    reviewsCount: 382,
    seoScore: 91
  },

  // --- ADDITIONAL CLINICS (min 4 in section) ---
  {
    id: "hazratganj-dental-care-clinic",
    name: "Hazratganj Dental Care & Implant Center",
    type: ProviderType.CLINIC,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-CLN-99102",
    experienceYears: 12,
    specialties: ["Dentistry"],
    treatments: ["Dental Implant", "Root Canal Therapy", "Teeth Alignment"],
    localityId: "hazratganj",
    cityId: "lucknow",
    address: "22, Mahatma Gandhi Marg, Hazratganj, Lucknow, UP - 226001",
    consultationFee: 400,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Monday", slots: [{ id: "cl2-1", time: "10:00 AM", isAvailable: true }, { id: "cl2-2", time: "05:00 PM", isAvailable: true }] },
      { day: "Tuesday", slots: [{ id: "cl2-3", time: "10:00 AM", isAvailable: true }, { id: "cl2-4", time: "05:00 PM", isAvailable: true }] },
      { day: "Thursday", slots: [{ id: "cl2-5", time: "10:00 AM", isAvailable: true }, { id: "cl2-6", time: "05:00 PM", isAvailable: true }] }
    ],
    about: "Hazratganj Dental Care & Implant Center provides state-of-the-art painless root canal therapy, digital smile design, and dental implant surgeries using German imported equipment.",
    services: ["Painless Root Canal", "3D Dental Implants", "Laser Teeth Whitening", "Orthodontic Aligners"],
    facilities: ["3D Intraoral Scanner", "Sterile Dental Operatory", "Digital RVG X-Ray"],
    insuranceAccepted: ["Star Health", "Care Insurance"],
    emergencyServices: false,
    awards: ["Best Dental Clinic Lucknow 2023"],
    education: ["MDS Certified Dental Surgeons"],
    landmarks: ["Near Hazratganj Metro Gate 1", "Opposite Janpath Market"],
    rating: 4.8,
    reviewsCount: 178,
    seoScore: 92
  },
  {
    id: "aliganj-skin-laser-clinic",
    name: "Aliganj Skin & Cosmetic Laser Clinic",
    type: ProviderType.CLINIC,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-CLN-77182",
    experienceYears: 14,
    specialties: ["Dermatology"],
    treatments: ["Skin Laser Treatment", "Acne Scar Therapy", "Anti-Aging Consultation"],
    localityId: "aliganj",
    cityId: "lucknow",
    address: "Sector C, Near Engineering College Chauraha, Aliganj, Lucknow, UP - 226024",
    consultationFee: 600,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Monday", slots: [{ id: "cl3-1", time: "11:00 AM", isAvailable: true }, { id: "cl3-2", time: "04:00 PM", isAvailable: true }] },
      { day: "Wednesday", slots: [{ id: "cl3-3", time: "11:00 AM", isAvailable: true }, { id: "cl3-4", time: "04:00 PM", isAvailable: true }] },
      { day: "Friday", slots: [{ id: "cl3-5", time: "11:00 AM", isAvailable: true }, { id: "cl3-6", time: "04:00 PM", isAvailable: true }] }
    ],
    about: "Specialized cosmetology and dermatology clinic offering advanced US-FDA approved laser treatments, medical facials, psoriasis management, and hair restoration therapies.",
    services: ["US-FDA Laser Hair Reduction", "Chemical Peels & Acne Care", "Hair PRP Therapy", "Pigmentation Treatment"],
    facilities: ["US-FDA Approved Laser Machines", "Private Procedure Rooms", "Digital Skin Analyzer"],
    insuranceAccepted: ["HDFC ERGO", "Niva Bupa"],
    emergencyServices: false,
    awards: ["Excellence in Clinical Dermatology UP 2024"],
    education: ["MD Dermatology Specialists"],
    landmarks: ["Near Kapoorthala Chauraha", "Beside SBI Branch"],
    rating: 4.7,
    reviewsCount: 142,
    seoScore: 90
  },
  {
    id: "indira-nagar-mother-child-clinic",
    name: "Indira Nagar Mother & Child Wellness Clinic",
    type: ProviderType.CLINIC,
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-CLN-55201",
    experienceYears: 16,
    specialties: ["Gynecology", "Pediatrics"],
    treatments: ["Pregnancy Care", "Pediatric Vaccination", "Child Nutrition Consultation"],
    localityId: "indira-nagar",
    cityId: "lucknow",
    address: "B-104, Bhootnath Market Main Road, Indira Nagar, Lucknow, UP - 226016",
    consultationFee: 500,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Tuesday", slots: [{ id: "cl4-1", time: "09:30 AM", isAvailable: true }, { id: "cl4-2", time: "06:00 PM", isAvailable: true }] },
      { day: "Thursday", slots: [{ id: "cl4-3", time: "09:30 AM", isAvailable: true }, { id: "cl4-4", time: "06:00 PM", isAvailable: true }] },
      { day: "Saturday", slots: [{ id: "cl4-5", time: "09:30 AM", isAvailable: true }, { id: "cl4-6", time: "06:00 PM", isAvailable: true }] }
    ],
    about: "Comprehensive outpatient clinic focusing on prenatal ultrasound monitoring, pediatric growth tracking, vaccination drives, and adolescent gynecological health.",
    services: ["Antenatal & Postnatal Care", "Complete Child Vaccination", "PCOS Management", "Growth & Development Assessment"],
    facilities: ["High-Resolution Ultrasound", "Painless Vaccination Unit", "Child Friendly Play Corner"],
    insuranceAccepted: ["Star Health", "Aditya Birla"],
    emergencyServices: true,
    awards: ["Best Pediatric & Gynae OPD Indira Nagar 2023"],
    education: ["MS Gynae & MD Pediatrics Board Certified"],
    landmarks: ["Opposite Bhootnath Temple Entrance", "Above City Kart"],
    rating: 4.9,
    reviewsCount: 198,
    seoScore: 93
  },

  // --- ADDITIONAL HOSPITALS (min 4 in section) ---
  {
    id: "kgmu-med-city-hospital",
    name: "MedCity Multi-Specialty Hospital Gomti Nagar",
    type: ProviderType.HOSPITAL,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-HSP-88320",
    experienceYears: 20,
    specialties: ["Cardiology", "Orthopedics", "Neurology", "General Medicine"],
    treatments: ["Heart Valve Care", "Knee Replacement", "Spine Surgery", "Stroke Rehabilitation"],
    localityId: "gomti-nagar",
    cityId: "lucknow",
    address: "TC-34, Vibhuti Khand, Gomti Nagar, Lucknow, UP - 226010",
    consultationFee: 900,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Monday", slots: [{ id: "h2-1", time: "24 Hours Emergency", isAvailable: true }] },
      { day: "Tuesday", slots: [{ id: "h2-2", time: "24 Hours Emergency", isAvailable: true }] }
    ],
    about: "MedCity Hospital is a 200-bed tertiary care hospital equipped with Level-3 ICUs, cardiac cath lab, 24/7 emergency stroke unit, and advanced neurosurgery wing in Vibhuti Khand.",
    services: ["24/7 Cardiac & Neuro Emergency", "Modular Cardiac Cath Lab", "Minimal Access Laparoscopic Surgery", "Joint Replacement Wing"],
    facilities: ["200 Bedded Ward & ICU", "128-Slice CT Scan", "3.0 Tesla MRI", "24/7 Blood Storage Bank"],
    insuranceAccepted: ["Star Health", "Max Bupa", "HDFC ERGO", "CGHS", "Ayushman Bharat"],
    emergencyServices: true,
    awards: ["NABH Excellence Award 2023", "Top Multi-Specialty Hospital UP"],
    education: ["DNB Super-Specialty Medical Facility"],
    landmarks: ["Near Pick Up Bhawan", "Opposite Vibhuti Khand Police Station"],
    rating: 4.8,
    reviewsCount: 890,
    seoScore: 96
  },
  {
    id: "hazratganj-heart-trauma-hospital",
    name: "Hazratganj Heart & Trauma Super Specialty Hospital",
    type: ProviderType.HOSPITAL,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-HSP-66109",
    experienceYears: 22,
    specialties: ["Cardiology", "Orthopedics", "Emergency Care"],
    treatments: ["Heart Care", "Hypertension Management", "Fracture Surgery", "Arthroplasty"],
    localityId: "hazratganj",
    cityId: "lucknow",
    address: "4, Park Road, Hazratganj, Lucknow, UP - 226001",
    consultationFee: 850,
    languages: ["English", "Hindi", "Urdu"],
    availability: [
      { day: "Monday", slots: [{ id: "h3-1", time: "24 Hours Emergency", isAvailable: true }] }
    ],
    about: "Hazratganj Heart & Trauma Hospital is a pioneer in rapid cardiac intervention and emergency polytrauma care located in central Lucknow.",
    services: ["Primary Angioplasty in Heart Attack", "Polytrauma Critical Care", "24/7 Ambulance Fleet", "Dialysis Unit"],
    facilities: ["24/7 Cardiac Care Unit (CCU)", "Digital X-Ray & Sonography", "In-house Pathology & Pharmacy"],
    insuranceAccepted: ["Star Health", "ICICI Lombard", "Care Health", "ECHS"],
    emergencyServices: true,
    awards: ["Best Emergency Trauma Hospital Central Lucknow 2024"],
    education: ["NABH Accredited Tertiary Center"],
    landmarks: ["Near Civil Hospital", "Behind Governor House Road"],
    rating: 4.7,
    reviewsCount: 650,
    seoScore: 94
  },
  {
    id: "apollo-lucknow-specialty-hospital",
    name: "Apollo Lucknow Medical & Surgical Center",
    type: ProviderType.HOSPITAL,
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-HSP-33100",
    experienceYears: 18,
    specialties: ["Gynecology", "Pediatrics", "General Medicine", "Dermatology"],
    treatments: ["IVF", "Pregnancy Care", "Pediatric Surgery", "Health Screenings"],
    localityId: "alambagh",
    cityId: "lucknow",
    address: "Plot 12, VIP Road, Alambagh, Lucknow, UP - 226005",
    consultationFee: 800,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Monday", slots: [{ id: "h4-1", time: "24 Hours Emergency", isAvailable: true }] }
    ],
    about: "150-bedded super specialty institution offering comprehensive maternity suites, neonatal ICUs, advanced day-care surgery, and multispecialty OPD clinics in South Lucknow.",
    services: ["High Risk Obstetrics & Neonatology", "Advanced Laparoscopy", "Daycare Chemotherapy Unit", "Preventive Health Hub"],
    facilities: ["Advanced Level-3 NICU/PICU", "Private Deluxe Patient Rooms", "24/7 Emergency & Pharmacy"],
    insuranceAccepted: ["Star Health", "Niva Bupa", "Tata AIG", "SBI General"],
    emergencyServices: true,
    awards: ["Excellence in Patient Care Alambagh 2023"],
    education: ["NABH Accredited Institution"],
    landmarks: ["Near Alambagh Bus Terminal", "Beside Phoenix United Mall"],
    rating: 4.8,
    reviewsCount: 720,
    seoScore: 95
  },

  // --- ADDITIONAL DIAGNOSTIC PATHOLOGY LABS (min 4 in section) ---
  {
    id: "dr-lal-pathlabs-gomtinagar",
    name: "Dr. Lal PathLabs & Diagnostics Gomti Nagar",
    type: ProviderType.LAB,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-LAB-44120",
    experienceYears: 25,
    specialties: ["General Medicine"],
    treatments: ["Diabetes Management", "Thyroid Profile", "Full Body Blood Test"],
    localityId: "gomti-nagar",
    cityId: "lucknow",
    address: "B1/4, Patrakar Puram Crossing, Gomti Nagar, Lucknow, UP - 226010",
    consultationFee: 250,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Monday", slots: [{ id: "lab2-1", time: "06:30 AM (Home Sample)", isAvailable: true }] }
    ],
    about: "Dr. Lal PathLabs is India's premier NABL accredited diagnostic network. Features 100% automated analyzers, barcode sample tracking, and digital PDF reports in 6 hours.",
    services: ["Complete Full Body Screening", "Hormonal & Vitamin Panels", "Cancer Marker Tests", "Free Home Sample Pickup"],
    facilities: ["NABL & CAP Accredited Lab", "Cold-chain Sample Box Dispatch", "Wheelchair Friendly Entry"],
    insuranceAccepted: ["Corporate Wellness Reimbursements Accepted"],
    emergencyServices: true,
    awards: ["Best Diagnostic Lab Chain India"],
    education: ["NABL Certified MC-1022"],
    landmarks: ["Opposite Patrakar Puram Market", "Near Barbeque Nation"],
    rating: 4.9,
    reviewsCount: 512,
    seoScore: 97
  },
  {
    id: "thyrocare-indiranagar-express-lab",
    name: "Thyrocare Express Pathology & Wellness Lab",
    type: ProviderType.LAB,
    image: "https://images.unsplash.com/photo-1579153138244-3917a00b01d7?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-LAB-99201",
    experienceYears: 18,
    specialties: ["General Medicine"],
    treatments: ["Thyroid Profile", "Lipid Profile", "Vitamin D & B12 Test"],
    localityId: "indira-nagar",
    cityId: "lucknow",
    address: "Sector 11, Main Market, Indira Nagar, Lucknow, UP - 226016",
    consultationFee: 199,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Monday", slots: [{ id: "lab3-1", time: "07:00 AM (Home Sample)", isAvailable: true }] }
    ],
    about: "High-speed automated pathology laboratory specializing in affordable thyroid panels, cardiac risk markers, diabetes monitoring, and preventative health packages.",
    services: ["Aarogyam Full Body Packages", "Thyroid Profile (T3, T4, TSH)", "Lipid & Liver Screenings", "Home Blood Collection"],
    facilities: ["Fully Automated Immunoassay Analyzers", "Online PDF Download", "Free Home Phlebotomist"],
    insuranceAccepted: ["Self-Pay Discount Packages"],
    emergencyServices: false,
    awards: ["Affordable Preventive Diagnostics Award"],
    education: ["ISO 9001:2015 & NABL Accredited"],
    landmarks: ["Near Munshipulia Metro Station", "Beside Dominos Pizza"],
    rating: 4.7,
    reviewsCount: 320,
    seoScore: 92
  },
  {
    id: "srl-diagnostics-alambagh",
    name: "SRL Diagnostics & Imaging Center Alambagh",
    type: ProviderType.LAB,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351167?q=80&w=400&auto=format&fit=crop",
    verified: true,
    medicalRegistrationNumber: "REG-LAB-66712",
    experienceYears: 22,
    specialties: ["General Medicine", "Ophthalmology"],
    treatments: ["Blood Test Profiles", "Allergy Testing", "ECG & Ultrasound"],
    localityId: "alambagh",
    cityId: "lucknow",
    address: "34, VIP Road, Alambagh, Lucknow, UP - 226005",
    consultationFee: 300,
    languages: ["English", "Hindi"],
    availability: [
      { day: "Monday", slots: [{ id: "lab4-1", time: "07:00 AM (Home Sample)", isAvailable: true }] }
    ],
    about: "Comprehensive NABL certified pathology and imaging center equipped with high frequency X-Ray, ECG, 4D Ultrasound, and automated biochemistry analyzers.",
    services: ["NABL Blood & Pathology Tests", "Digital X-Ray & ECG", "4D Color Doppler USG", "Home Sample Collection"],
    facilities: ["Sterile Sample Collection Bay", "Ample Parking Space", "Air-conditioned Patient Lounge"],
    insuranceAccepted: ["Accepted by All Major Insurance TPA Providers"],
    emergencyServices: true,
    awards: ["Top Pathology Center South Lucknow 2023"],
    education: ["NABL Accredited Laboratory"],
    landmarks: ["Opposite Alambagh Bus Stand Gate 2", "Near Metro Pillar 42"],
    rating: 4.8,
    reviewsCount: 410,
    seoScore: 94
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    providerId: "dr-anand-verma",
    patientName: "Sanjay Srivastava",
    rating: 5,
    comment: "Dr. Verma explained my coronary treatment so clearly and answered all my queries. The staff was incredibly warm and the clinic was clean. Highly recommended!",
    date: "2026-06-25",
    verified: true,
    metrics: {
      doctorBehavior: 5,
      waitingTime: 4,
      cleanliness: 5,
      staffBehavior: 5,
      communication: 5,
      treatmentSatisfaction: 5
    }
  },
  {
    id: "rev-2",
    providerId: "dr-anand-verma",
    patientName: "Pooja Rastogi",
    rating: 4.5,
    comment: "Excellent experience. The waiting time was about 15 minutes which is great for such a senior doctor. He changed my heart medicine and my BP is now perfectly stable.",
    date: "2026-06-28",
    verified: true,
    metrics: {
      doctorBehavior: 5,
      waitingTime: 3.5,
      cleanliness: 5,
      staffBehavior: 4.5,
      communication: 4.5,
      treatmentSatisfaction: 5
    }
  },
  {
    id: "rev-3",
    providerId: "dr-shambhavi-mishra",
    patientName: "Nisha Dwivedi",
    rating: 5,
    comment: "Dr. Shambhavi is an absolute lifesaver. After 3 failed attempts elsewhere, her customized IVF treatment successfully worked for us. We are blessed with a healthy baby girl. I can never thank her enough.",
    date: "2026-07-01",
    verified: true,
    metrics: {
      doctorBehavior: 5,
      waitingTime: 4,
      cleanliness: 5,
      staffBehavior: 5,
      communication: 5,
      treatmentSatisfaction: 5
    }
  },
  {
    id: "rev-4",
    providerId: "dr-vivek-tandon",
    patientName: "Ramesh Chandra",
    rating: 4.8,
    comment: "My mother underwent knee replacement surgery under Dr. Tandon. She is now walking comfortably after just 4 weeks. Highly professional care.",
    date: "2026-07-03",
    verified: true,
    metrics: {
      doctorBehavior: 5,
      waitingTime: 4,
      cleanliness: 4.5,
      staffBehavior: 4.5,
      communication: 5,
      treatmentSatisfaction: 5
    }
  }
];

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: "lucknow-full-body",
    name: "Lucknow Swasthya Premium Full Body",
    description: "Our most popular comprehensive healthcare package covering 84 key test parameters, specifically structured for adult screening.",
    testsIncluded: [
      "Complete Blood Count (CBC)",
      "Diabetes Profile (HbA1c, Fasting Blood Sugar)",
      "Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Thyroid Profile (T3, T4, TSH)",
      "Urine Routine Analysis"
    ],
    price: 1499,
    originalPrice: 3500,
    duration: "6-12 Hours (Report Delivery)",
    recommendedFor: "Men & Women aged 18+ years, once a year.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "active-heart-package",
    name: "Active Heart Care Screening",
    description: "Advanced cardiac-focused package to detect early indicators of cardiovascular stress, coronary blockage, or cholesterol overload.",
    testsIncluded: [
      "Lipid Profile Plus",
      "High Sensitivity C-Reactive Protein (hs-CRP)",
      "Apolipoprotein A1 & B",
      "Serum Homocysteine",
      "Electrocardiogram (ECG) Screening",
      "Consultation Voucher"
    ],
    price: 2499,
    originalPrice: 5000,
    duration: "1 Day (Includes ECG Voucher)",
    recommendedFor: "Individuals with family history of diabetes/heart ailments or sedentary lifestyles.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "senior-citizen-vital-shield",
    name: "Senior Citizen Vital Health Shield",
    description: "Tailored geriatrics health evaluation designed for adults aged 50+, covering joint markers, bone density, cardiac risk, and metabolic panels.",
    testsIncluded: [
      "Comprehensive Blood & Anemia Panel",
      "Vitamin D3 & Calcium Assessment",
      "HbA1c & Average Blood Glucose",
      "Kidney & Uric Acid Profile",
      "Cardiac Marker Screening",
      "Rheumatoid Factor (RA Factor)"
    ],
    price: 1999,
    originalPrice: 4200,
    duration: "6 Hours (Fast Track Home Sample)",
    recommendedFor: "Seniors aged 50+ seeking complete preventive monitoring.",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "women-wellness-hormonal-package",
    name: "Women Wellness & Hormonal Profile",
    description: "Specialized package focusing on female hormonal balance, thyroid health, iron stores, PCOS screening, and reproductive wellness.",
    testsIncluded: [
      "Complete Hormonal Panel (FSH, LH, Prolactin)",
      "Thyroid Profile (T3, T4, TSH)",
      "Serum Ferritin & Iron Studies",
      "PCOS Risk Indicators",
      "Vitamin B12 & D3 Levels",
      "Urine Microalbumin"
    ],
    price: 1799,
    originalPrice: 3800,
    duration: "8 Hours (Report Delivery)",
    recommendedFor: "Women of all age groups for reproductive and hormonal checkups.",
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop"
  }
];

export const ARTICLES: Article[] = [
  {
    id: "diabetes-lucknow-guide",
    title: "Managing Type-2 Diabetes: Essential Lucknow Summer Wellness Guide",
    slug: "managing-diabetes-lucknow-summer",
    category: "Preventive Care",
    excerpt: "With temperatures soaring in Uttar Pradesh, managing blood sugar levels is vital. Discover customized regional diets, dehydration prevention strategies, and best practices.",
    content: "When summer temperatures spike in Lucknow, individuals with diabetes face double the risk of heat-related illnesses and erratic blood glucose spikes. High heat affects how your body uses insulin and rapidly triggers dehydration. \n\n### 1. Hydrate Wisely\nInstead of sugary syrups or synthetic sherbets, opt for refreshing local options like salted buttermilk (chaas), fresh lime water without sugar (shikanji), or mint-infused water. Hydration maintains healthy renal perfusion and prevents elevated glycemic spikes.\n\n### 2. Protect Your Meds\nInsulin, glucose meters, and test strips are highly heat-sensitive. Never store them in a direct sunlight zone, car glove box, or near a stove. Keep them in a cool, dark cupboard or insulated bag if travelling down Gomti Nagar or Hazratganj on outdoor duties.\n\n### 3. Seek Early Diagnostics\nRegular blood test profiles (HbA1c checks) every 3 months are highly advised. Our Lucknow Clinical Labs offer safe, barcoded home collections.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop",
    author: "Dr. Anand Verma",
    date: "2026-06-15",
    readTime: "4 min read"
  },
  {
    id: "maternity-care-guide",
    title: "A Comprehensive Timeline for High-Risk Maternity and Prenatal Care",
    slug: "maternity-prenatal-care-timeline",
    category: "Pregnancy Care",
    excerpt: "Preparing for motherhood is beautiful yet demands meticulous medical alignment. Dr. Shambhavi Mishra details standard scans, blood markers, and emotional milestones.",
    content: "Maternity represents a magnificent transition that warrants state-of-the-art prenatal care. For pregnancies with chronic indicators (PCOS, high blood pressure, advanced maternal age), standard tracking schedules must be precisely formulated.\n\n### First Trimester (Weeks 1 to 12)\nEarly booking consultations should be scheduled by Week 6. Critical assessments include:\n- **Viability Ultrasound** to establish active fetal cardiac beats.\n- **Dual Marker Screening & NT Scan** (Weeks 11-13) for early chromosomal diagnostics.\n- Basic systemic tests (Thyroid, Hemoglobin, Blood Type).\n\n### Second Trimester (Weeks 13 to 26)\nKnown as the golden phase of pregnancy, this is when deep developmental structures solidify:\n- **Level-2 Target Scan / Anomaly Scan** (Weeks 18-20) to comprehensively evaluate structural development.\n- Oral Glucose Tolerance Test (OGTT) to rule out gestational diabetes.\n\n### Third Trimester (Weeks 27 to 40)\nFocus shifts to fetal weight, active position, amniotic fluid indexes (AFI), and preparing for a smooth delivery. Ensure regular monitoring with an emergency plan.",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop",
    author: "Dr. Shambhavi Mishra",
    date: "2026-07-02",
    readTime: "6 min read"
  },
  {
    id: "preventive-cardiology-guide",
    title: "Heart Care Essentials: Preventive Cardiology Insights from Senior Specialists",
    slug: "preventive-cardiology-heart-care-guide",
    category: "Cardiology",
    excerpt: "Understanding subtle cardiovascular warning signs, hypertension management, cholesterol profiling, and lifestyle modifications for long-term heart safety.",
    content: "Cardiovascular health is the cornerstone of longevity. Early detection of lipid irregularities, fluctuating blood pressure, and silent arterial inflammation can prevent critical cardiac events.\n\n### Key Cardiac Markers to Monitor\n- **Lipid Profile**: Check LDL, HDL, and Triglycerides regularly.\n- **hs-CRP & Homocysteine**: Indicators of vascular inflammation.\n- **Blood Pressure Tracking**: Aim to maintain readings below 120/80 mmHg.\n\n### Practical Lifestyle Habits\nIncorporate 30 minutes of brisk walking daily, reduce dietary sodium, and ensure routine cardiac screenings at accredited diagnostic centers.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400&auto=format&fit=crop",
    author: "Dr. Anand Verma",
    date: "2026-07-10",
    readTime: "5 min read"
  },
  {
    id: "monsoon-fever-dengue-prevention",
    title: "Monsoon Dengue & Seasonal Fever Prevention Guide for Lucknow Families",
    slug: "monsoon-fever-dengue-prevention-guide",
    category: "Infectious Diseases",
    excerpt: "Essential safety protocols for seasonal flu, viral fever, and mosquito-borne infections. Tips on platelet count monitoring and home hydration management.",
    content: "During the monsoon and post-monsoon months, vector-borne illnesses such as Dengue and Chikungunya see a surge. Prompt recognition of fever symptoms and early diagnostic blood testing are key to safe recovery.\n\n### Warning Signals\n- Sudden high fever accompanied by joint aches or eye pain.\n- Persistent nausea, abdominal tenderness, or severe weakness.\n\n### Early Action Plan\nGet a CBC (Complete Blood Count) and Dengue NS1 Antigen test within 24 hours of fever onset. Maintain fluid intake with ORS, coconut water, and boiled water.",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400&auto=format&fit=crop",
    author: "Dr. Vivek Tandon",
    date: "2026-07-18",
    readTime: "4 min read"
  }
];

export const FAQS = [
  {
    q: "How does the platform ensure that healthcare provider ratings are verified?",
    a: "We use a rigorous patient verification system. A review can only be posted after verifying the appointment through our platform. We look at medical consulting timestamps, SMS/Email OTP confirmation, and patient profiles to eliminate fake or paid reviews entirely."
  },
  {
    q: "Is booking an appointment on this platform free for patients?",
    a: "Yes, searching and booking appointment enquiries on this platform is completely free of charge. Patients only pay the standard consultation fees directly to the doctor or clinic at the time of their appointment."
  },
  {
    q: "How can healthcare providers register and claim their profile?",
    a: "Click on the 'List Your Practice' button, enter your registration metadata (NMC/State Medical Council number, qualifications, and locality), and complete the credentials upload. Our verification team will review your license details against official medical council directories within 24 hours to award the blue verified badge."
  },
  {
    q: "Is my medical data and appointment history secure?",
    a: "Absolutely. We employ strict data encryption and security standards. Your personal and consultation details are encrypted, and we never sell your healthcare records to any third-party marketing companies."
  }
];

export const TESTIMONIALS = [
  {
    quote: "Finding a specialized cardiologist in Gomti Nagar for my father was incredibly easy. We checked Dr. Verma's reviews, booked a Wednesday afternoon slot, and received confirmation instantly. Truly a life-saving portal for Lucknow residents.",
    author: "Amit Kumar Saxena",
    role: "Patient's Son",
    location: "Gomti Nagar, Lucknow"
  },
  {
    quote: "As an IVF specialist, online trust is crucial. Claiming my digital profile on this platform and completing my registration verification significantly improved my online search ranking. I receive highly relevant local inquiries daily.",
    author: "Dr. Shambhavi Mishra",
    role: "Consultant Gynecologist",
    location: "Hazratganj, Lucknow"
  }
];
