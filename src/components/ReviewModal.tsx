import React, { useState } from "react";
import { X, Star, ShieldCheck, AlertCircle } from "lucide-react";
import { Provider, ProviderType, Appointment, UserProfile, Review } from "../types";

interface ReviewModalProps {
  provider: Provider;
  appointment?: Appointment;
  currentUser?: UserProfile | null;
  existingReviews?: Review[];
  onClose: () => void;
  onSubmitReview: (reviewData: Partial<Review>) => void;
}

export default function ReviewModal({
  provider,
  appointment,
  currentUser,
  existingReviews = [],
  onClose,
  onSubmitReview
}: ReviewModalProps) {
  const patientDefaultName = appointment?.patientName || currentUser?.displayName || "Verified Patient";

  const [patientName, setPatientName] = useState(patientDefaultName);
  const [comment, setComment] = useState("");
  const [overallRating, setOverallRating] = useState(5);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Check if appointment has already been reviewed
  const isAlreadyReviewed = appointment && existingReviews.some(r => r.appointmentId === appointment.id);

  // Category ratings initial state
  const [catRatings, setCatRatings] = useState<Record<string, number>>({
    doctorBehaviour: 5,
    staffBehaviour: 5,
    waitingTime: 4,
    cleanliness: 5,
    communication: 5,
    treatmentSatisfaction: 5
  });

  const updateCatScore = (key: string, val: number) => {
    setCatRatings(prev => ({ ...prev, [key]: val }));
  };

  // Provider Type Category Adaptation
  const getRelevantCategories = () => {
    switch (provider.type) {
      case ProviderType.DOCTOR:
        return [
          { key: "doctorBehaviour", label: "Doctor Behaviour" },
          { key: "communication", label: "Communication Quality" },
          { key: "waitingTime", label: "Consultation Waiting Time" },
          { key: "treatmentSatisfaction", label: "Treatment Satisfaction" }
        ];
      case ProviderType.CLINIC:
        return [
          { key: "doctorBehaviour", label: "Doctor Behaviour" },
          { key: "staffBehaviour", label: "Staff Behaviour" },
          { key: "waitingTime", label: "Waiting Time" },
          { key: "cleanliness", label: "Clinic Cleanliness" },
          { key: "communication", label: "Communication Quality" },
          { key: "treatmentSatisfaction", label: "Treatment Satisfaction" }
        ];
      case ProviderType.HOSPITAL:
        return [
          { key: "staffBehaviour", label: "Hospital Staff Behaviour" },
          { key: "waitingTime", label: "Admission / Waiting Time" },
          { key: "cleanliness", label: "Facility Cleanliness" },
          { key: "communication", label: "Doctor & Nurse Communication" },
          { key: "treatmentSatisfaction", label: "Treatment & Recovery Satisfaction" }
        ];
      case ProviderType.DIAGNOSTIC_LAB:
        return [
          { key: "staffBehaviour", label: "Lab Phlebotomist & Staff" },
          { key: "waitingTime", label: "Sample Collection Waiting Time" },
          { key: "cleanliness", label: "Lab Hygiene & Safety" },
          { key: "communication", label: "Report Delivery & Guidance" },
          { key: "treatmentSatisfaction", label: "Overall Service Satisfaction" }
        ];
      default:
        return [
          { key: "doctorBehaviour", label: "Doctor Behaviour" },
          { key: "staffBehaviour", label: "Staff Behaviour" },
          { key: "waitingTime", label: "Waiting Time" },
          { key: "cleanliness", label: "Cleanliness" }
        ];
    }
  };

  const relevantCats = getRelevantCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (isAlreadyReviewed) {
      setErrorMsg("A review has already been submitted for this appointment.");
      return;
    }

    const trimmedComment = comment.trim();
    if (trimmedComment.length > 1000) {
      setErrorMsg("Review text cannot exceed 1000 characters.");
      return;
    }

    const isVerifiedInteraction = Boolean(
      appointment &&
      (appointment.status === "completed" || appointment.status === "COMPLETED")
    );

    const reviewPayload: Partial<Review> = {
      providerId: provider.id,
      patientUid: currentUser?.uid || appointment?.patientUid,
      appointmentId: appointment?.id,
      patientName: patientName.trim() || "Verified Patient",
      rating: overallRating,
      comment: trimmedComment,
      reviewText: trimmedComment,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      verified: isVerifiedInteraction,
      isVerified: isVerifiedInteraction,
      status: "PUBLISHED",
      doctorBehaviour: catRatings.doctorBehaviour,
      staffBehaviour: catRatings.staffBehaviour,
      waitingTime: catRatings.waitingTime,
      cleanliness: catRatings.cleanliness,
      communication: catRatings.communication,
      treatmentSatisfaction: catRatings.treatmentSatisfaction,
      metrics: {
        doctorBehavior: catRatings.doctorBehaviour,
        waitingTime: catRatings.waitingTime,
        cleanliness: catRatings.cleanliness,
        staffBehavior: catRatings.staffBehaviour,
        communication: catRatings.communication,
        treatmentSatisfaction: catRatings.treatmentSatisfaction
      }
    };

    onSubmitReview(reviewPayload);
    setSubmitted(true);
  };

  const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="space-y-6 text-center py-6">
            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-100 shadow">
              <ShieldCheck className="h-8 w-8 stroke-[2.5]" />
            </div>
            
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                REVIEW PUBLISHED
              </span>
              <h3 className="font-sans font-extrabold text-slate-900 text-xl">Thank You for Your Feedback!</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-sans">
                Your verified review for <strong>{typeLabel}</strong> has been published and added to their clinical reputation profile in Lucknow.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white font-sans text-xs font-bold py-3.5 rounded-xl transition-colors cursor-pointer shadow"
            >
              Close Window
            </button>
          </div>
        ) : (
          /* FORM ENTRY */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-teal-800 font-extrabold uppercase tracking-widest bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                  VERIFIED PATIENT REVIEW
                </span>
                {appointment && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                    Completed Appointment
                  </span>
                )}
              </div>
              <h3 className="font-sans font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight mt-1">
                Rate & Review {typeLabel}
              </h3>
              <p className="text-xs text-slate-500">
                Help fellow patients in Lucknow make informed healthcare choices.
              </p>
            </div>

            {isAlreadyReviewed && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <span>A review has already been published for this completed consultation. One review permitted per appointment.</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* OVERALL RATING */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
              <label className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
                Overall Consultation Rating *
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`h-7 w-7 ${star <= overallRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-bold text-teal-700">
                {overallRating === 5 && "Excellent (5.0 ★)"}
                {overallRating === 4 && "Very Good (4.0 ★)"}
                {overallRating === 3 && "Average (3.0 ★)"}
                {overallRating === 2 && "Poor (2.0 ★)"}
                {overallRating === 1 && "Terrible (1.0 ★)"}
              </p>
            </div>

            {/* PATIENT DISPLAY NAME */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block text-xs">Patient Display Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Saxena K."
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            {/* CATEGORY BREAKDOWN METRICS */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <p className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">
                Category Experience Breakdown
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 font-sans">
                {relevantCats.map((cat) => {
                  const score = catRatings[cat.key] || 5;
                  return (
                    <div key={cat.key} className="flex justify-between items-center text-xs bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                      <span className="text-slate-700 font-medium text-[11px]">{cat.label}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateCatScore(cat.key, star)}
                            className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star 
                              className={`h-3.5 w-3.5 ${star <= score ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WRITTEN REVIEW TEXT */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700 block text-xs">Written Feedback (Optional)</label>
                <span className={`text-[10px] font-mono ${comment.length > 900 ? "text-amber-600 font-bold" : "text-slate-400"}`}>
                  {comment.length}/1000 chars
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={1000}
                placeholder="Share your clinical experience regarding doctor communication, diagnosis accuracy, or clinic hygiene..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 h-20 resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isAlreadyReviewed}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-sans text-xs font-bold py-3.5 rounded-xl shadow-md transition-colors cursor-pointer mt-2"
            >
              Submit Verified Review
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
