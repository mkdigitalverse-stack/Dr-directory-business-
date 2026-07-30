import React, { useState } from "react";
import { X, Star, ShieldCheck, Smile } from "lucide-react";
import { Provider, ProviderType, ReviewMetric } from "../types";

interface ReviewModalProps {
  provider: Provider;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    patientName: string;
    comment: string;
    rating: number;
    metrics: ReviewMetric;
  }) => void;
}

export default function ReviewModal({ provider, onClose, onSubmitReview }: ReviewModalProps) {
  const [patientName, setPatientName] = useState("");
  const [comment, setComment] = useState("");

  // Metrics initial ratings
  const [metrics, setMetrics] = useState<ReviewMetric>({
    doctorBehavior: 5,
    waitingTime: 4,
    cleanliness: 5,
    staffBehavior: 4,
    communication: 5,
    treatmentSatisfaction: 5
  });

  const [submitted, setSubmitted] = useState(false);

  // Helper to change rating of a specific metric
  const updateMetricScore = (key: keyof ReviewMetric, val: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Dynamically compute average overall rating from metric details
  const averageRating = parseFloat(
    (
      (metrics.doctorBehavior +
        metrics.waitingTime +
        metrics.cleanliness +
        metrics.staffBehavior +
        metrics.communication +
        metrics.treatmentSatisfaction) /
      6
    ).toFixed(1)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please enter a short descriptive comment.");
      return;
    }

    onSubmitReview({
      patientName: patientName || "Anonymous Patient",
      comment,
      rating: averageRating,
      metrics
    });
    
    setSubmitted(true);
  };

  const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-755 p-1 rounded-full hover:bg-slate-50 transition-colors"
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
              <h3 className="font-sans font-extrabold text-slate-900 text-xl">Review Successfully Registered</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-sans">
                Thank you! Your verified feedback has been indexed to {typeLabel}'s public clinical profile.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white font-sans text-sm font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        ) : (
          /* FORM ENTRY */
          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            
            <div className="space-y-1">
              <h3 className="font-sans font-extrabold text-slate-900 text-lg">
                Write a Verified Patient Review
              </h3>
              <p className="text-xs text-slate-500">
                Evaluating clinical consultation with <strong className="text-slate-800">{typeLabel}</strong>
              </p>
            </div>

            {/* Patients Name entry */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Patient Full Name (Leave empty for Anonymous)</label>
              <input
                type="text"
                placeholder="e.g. Saxena Kumar"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Metrics Stars Selectors lists */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Specific Service Ratings</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-sans">
                {[
                  { key: "doctorBehavior", label: "Doctor Behaviour" },
                  { key: "communication", label: "Communication Quality" },
                  { key: "treatmentSatisfaction", label: "Treatment Satisfaction" },
                  { key: "cleanliness", label: "Clinic Cleanliness" },
                  { key: "staffBehavior", label: "Staff Behaviour" },
                  { key: "waitingTime", label: "Consultation Waiting Time" }
                ].map((met) => {
                  const score = metrics[met.key as keyof ReviewMetric];
                  return (
                    <div key={met.key} className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">{met.label}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateMetricScore(met.key as keyof ReviewMetric, star)}
                            className="p-0.5 text-amber-400 hover:scale-115 transition-transform"
                          >
                            <Star 
                              className={`h-4 w-4 ${star <= score ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Written comments text area */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Detailed Feedback Experience</label>
                <span className="text-teal-600 font-extrabold font-mono text-xs">Composite Score: {averageRating} ★</span>
              </div>
              <textarea
                required
                rows={3}
                placeholder="Share specific details about diagnosis, medicine descriptions, clinical behavior or waiting times..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 h-20 resize-none"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] p-3 rounded-xl flex items-start gap-2">
              <Smile className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Reviews undergo automated security cross-referencing against verified consultations logs before authorization. No spam allowed.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-sans text-sm font-bold py-3.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Publish Verified Review
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
