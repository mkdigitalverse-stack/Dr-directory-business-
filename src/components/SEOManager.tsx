import { useEffect } from "react";
import { Provider, ProviderType } from "../types";

interface SEOManagerProps {
  view: string;
  provider?: Provider | null;
  locality?: string;
  specialty?: string;
}

export default function SEOManager({ view, provider, locality, specialty }: SEOManagerProps) {
  useEffect(() => {
    // 1. Determine Title & Meta Description
    let title = "Trusted Healthcare Directory Lucknow | Find Doctors, Clinics & Hospitals";
    let description = "Find verified doctors, super specialty hospitals, local medical clinics, and diagnostic labs in Lucknow, UP. Book appointments online, read patient reviews, and access medical guidance.";
    let canonical = "https://lucknow.healthcare.directory";

    if (view === "about") {
      title = "About Our Lucknow Healthcare Ecosystem & Verification Standards";
      description = "Discover our mission to connect patient communities with medical professionals in Lucknow. Read about our NMC credential verification standards.";
      canonical = "https://lucknow.healthcare.directory/about";
    } else if (view === "dashboard") {
      title = "Healthcare Provider Dashboard | Claim Your Lucknow Medical Listing";
      description = "Access patient analytics, manage clinic appointments, respond to patient reviews, and audit your Local SEO score from the provider dashboard.";
      canonical = "https://lucknow.healthcare.directory/dashboard";
    } else if (view === "search") {
      const displaySpecialty = specialty ? specialty.toUpperCase() : "Doctors";
      const displayLocality = locality ? `in ${locality}` : "across Lucknow";
      title = `Best ${displaySpecialty} ${displayLocality} | Verified Providers`;
      description = `Find and book top ${displaySpecialty} ${displayLocality}. Read patient satisfaction ratings, check consulting fees, landmarks, and appointment slot availability.`;
      canonical = `https://lucknow.healthcare.directory/search?specialty=${specialty || ""}&locality=${locality || ""}`;
    } else if (view === "profile" && provider) {
      const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;
      const primarySpecialty = provider.specialties[0] || "Specialist";
      title = `${typeLabel} - ${primarySpecialty} in ${provider.localityId.replace("-", " ")} Lucknow | Appointment Booking`;
      description = `Book an appointment with ${typeLabel} (${provider.qualification}), leading ${primarySpecialty} located in ${provider.address}. Registration Number: ${provider.medicalRegistrationNumber || "Verified Clinic"}. Reviews & fees details.`;
      canonical = `https://lucknow.healthcare.directory/provider/${provider.id}`;
    }

    // Update document title
    document.title = title;

    // Helper to update meta tag
    const updateMetaTag = (selector: string, attribute: string, val: string) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        const parts = selector.split("[");
        if (parts.length > 1) {
          const attrParts = parts[1].replace("]", "").split("=");
          const attrName = attrParts[0];
          const attrVal = attrParts[1].replace(/['"]/g, "");
          tag.setAttribute(attrName, attrVal);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute(attribute, val);
    };

    // Indexing safety: set robots directive
    const isPrivateView = ["dashboard", "admin", "verification"].includes(view) || 
      (view === "profile" && provider && provider.status && provider.status !== "APPROVED");
    
    const robotsDirective = isPrivateView ? "noindex, nofollow" : "index, follow";
    updateMetaTag("meta[name='robots']", "content", robotsDirective);

    updateMetaTag("meta[name='description']", "content", description);
    updateMetaTag("meta[property='og:title']", "content", title);
    updateMetaTag("meta[property='og:description']", "content", description);
    updateMetaTag("meta[property='og:url']", "content", canonical);
    updateMetaTag("meta[property='og:type']", "content", "website");
    updateMetaTag("meta[name='twitter:card']", "content", "summary_large_image");
    updateMetaTag("meta[name='twitter:title']", "content", title);
    updateMetaTag("meta[name='twitter:description']", "content", description);

    // 2. Inject Dynamic Schema.org LD-JSON
    let schemaObj: any = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Lucknow Healthcare Directory",
      "url": "https://lucknow.healthcare.directory",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lucknow.healthcare.directory/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    if (view === "profile" && provider) {
      if (provider.type === ProviderType.DOCTOR) {
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "Physician",
          "name": `Dr. ${provider.name}`,
          "image": provider.image,
          "telephone": "+91-522-401189",
          "medicalSpecialty": provider.specialties.join(", "),
          "address": {
            "@type": "PostalAddress",
            "streetAddress": provider.address,
            "addressLocality": "Lucknow",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "IN",
            "postalCode": "226010"
          },
          "priceRange": `INR ${provider.consultationFee}`,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": provider.rating,
            "reviewCount": provider.reviewsCount,
            "bestRating": "5",
            "worstRating": "1"
          },
          "knowsAbout": provider.treatments.concat(provider.specialties),
          "medicalRegistrationNumber": provider.medicalRegistrationNumber
        };
      } else if (provider.type === ProviderType.HOSPITAL) {
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "Hospital",
          "name": provider.name,
          "image": provider.image,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": provider.address,
            "addressLocality": "Lucknow",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "IN"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": provider.rating,
            "reviewCount": provider.reviewsCount
          }
        };
      } else {
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "name": provider.name,
          "image": provider.image,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": provider.address,
            "addressLocality": "Lucknow",
            "addressRegion": "Uttar Pradesh"
          }
        };
      }
    } else if (view === "search") {
      schemaObj = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://lucknow.healthcare.directory"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Search",
            "item": canonical
          }
        ]
      };
    }

    // Clean up any old injected schema scripts
    const oldScript = document.getElementById("healthcare-seo-schema");
    if (oldScript) {
      oldScript.remove();
    }

    // Create and inject new schema
    const script = document.createElement("script");
    script.id = "healthcare-seo-schema";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schemaObj);
    document.head.appendChild(script);

    return () => {
      // Cleanup effect if required
    };
  }, [view, provider, locality, specialty]);

  return null; // Side-effect only component
}
