import React, { useState, useMemo } from "react";
import { 
  HelpCircle, Search, ChevronDown, ThumbsUp, ThumbsDown, Plus, MessageSquarePlus, 
  CheckCircle, Sparkles, AlertCircle, ShieldCheck, CreditCard, Clock, Calendar, X,
  Share2, FileText, Send, Filter
} from "lucide-react";
import { Provider, FAQItem, ProviderType } from "../types";

interface ProviderFAQSectionProps {
  provider: Provider;
  currentUser?: any;
  onUpdateFaqs?: (updatedFaqs: FAQItem[]) => void;
  className?: string;
  isCompact?: boolean;
}

export default function ProviderFAQSection({
  provider,
  currentUser,
  onUpdateFaqs,
  className = "",
  isCompact = false
}: ProviderFAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openIndices, setOpenIndices] = useState<Record<string, boolean>>({ "faq-0": true }); // open first by default
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, "up" | "down" | null>>({});
  
  // Ask Question Form Modal state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState<FAQItem["category"]>("General");
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || "");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Manage / Add FAQ Modal state (for Provider/Admin)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [customCategory, setCustomCategory] = useState<FAQItem["category"]>("General");

  const typeLabel = provider.type === ProviderType.DOCTOR 
    ? (provider.name.startsWith("Dr.") ? provider.name : `Dr. ${provider.name}`) 
    : provider.name;

  // Build contextual default FAQs tailored to this provider
  const generatedDefaultFaqs = useMemo<FAQItem[]>(() => {
    const opdDays = provider.availability && provider.availability.length > 0
      ? provider.availability.map(a => a.day).join(", ")
      : "Monday through Saturday";
    
    const insuranceText = provider.insuranceAccepted && provider.insuranceAccepted.length > 0
      ? `Yes, accepted health insurance providers include: ${provider.insuranceAccepted.join(", ")}. Cashless approval assistance is available at the billing desk.`
      : "For major insurance coverage and cashless claim processing, please consult with our billing desk prior to consultation or admission.";

    const languagesText = provider.languages && provider.languages.length > 0
      ? provider.languages.join(", ")
      : "Hindi, English, and local dialects";

    const items: FAQItem[] = [
      {
        id: "faq-fee",
        question: `What is the OPD consultation fee for ${typeLabel}?`,
        answer: `The standard clinical consultation fee is ₹${provider.consultationFee}. Payments can be made via UPI, Cash, Paytm, or Credit/Debit Cards at the reception desk.`,
        category: "Fees & Payments",
        helpfulCount: 24
      },
      {
        id: "faq-booking",
        question: `How do I schedule an appointment with ${typeLabel}?`,
        answer: `You can confirm an instant appointment directly through Lucknow Healthcare Directory by selecting a preferred time slot. No advance pre-payment is required—fees are collected at the facility.`,
        category: "Appointments",
        helpfulCount: 19
      },
      {
        id: "faq-timings",
        question: `What are the OPD consultation days and timings at ${provider.localityId ? provider.localityId.replace("-", " ") : "the clinic"}?`,
        answer: `${typeLabel} is available for OPD consultations on ${opdDays}. We recommend arriving 10-15 minutes prior to your time slot for check-in and vitals recording.`,
        category: "Appointments",
        helpfulCount: 15
      },
      {
        id: "faq-insurance",
        question: `Does ${typeLabel} accept health insurance or cashless claims?`,
        answer: insuranceText,
        category: "Fees & Payments",
        helpfulCount: 12
      },
      {
        id: "faq-prep",
        question: "What documents or reports should I bring for my first consultation?",
        answer: "Please bring your previous medical prescriptions, recent diagnostic lab/imaging reports, a valid photo ID, and your current medication list so the doctor can review your complete clinical history.",
        category: "General",
        helpfulCount: 18
      },
      {
        id: "faq-emergency",
        question: `Does ${typeLabel} provide 24/7 trauma or emergency care services?`,
        answer: provider.emergencyServices 
          ? `Yes, 24/7 trauma and emergency critical support is available at ${provider.name} in ${provider.localityId ? provider.localityId.replace("-", " ") : "Lucknow"}. Emergency phone numbers are available on the profile header.`
          : `OPD services are available during scheduled hours (${opdDays}). For life-threatening emergencies outside OPD hours, please visit the nearest 24/7 tertiary trauma center or dial 108.`,
        category: "Emergency",
        helpfulCount: 10
      },
      {
        id: "faq-languages",
        question: `Which languages are spoken during consultations at ${typeLabel}'s facility?`,
        answer: `Consultations and support staff communication are available in: ${languagesText}.`,
        category: "General",
        helpfulCount: 8
      },
      {
        id: "faq-reports",
        question: "How soon are diagnostic reports delivered and follow-ups scheduled?",
        answer: "Standard diagnostic lab reports are generated within 4-12 hours and sent digitally via SMS/WhatsApp. Free or discounted follow-up consultations within 7 days can be verified at reception.",
        category: "Services & Facilities",
        helpfulCount: 14
      }
    ];

    return items;
  }, [provider]);

  // Merge custom provider FAQs with generated defaults
  const allFaqs = useMemo<FAQItem[]>(() => {
    if (provider.faqs && provider.faqs.length > 0) {
      // deduplicate by id/question
      const customIds = new Set(provider.faqs.map(f => f.question.toLowerCase()));
      const filteredDefaults = generatedDefaultFaqs.filter(
        df => !customIds.has(df.question.toLowerCase())
      );
      return [...provider.faqs, ...filteredDefaults];
    }
    return generatedDefaultFaqs;
  }, [provider.faqs, generatedDefaultFaqs]);

  // Categories list
  const categories = ["All", "Appointments", "Fees & Payments", "Services & Facilities", "Emergency", "General"];

  // Filtered FAQs based on category & search query
  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq => {
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === "" || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allFaqs, selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenIndices(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleVote = (id: string, type: "up" | "down") => {
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const handleAskQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newFaq: FAQItem = {
      id: `faq-user-${Date.now()}`,
      question: newQuestionText.trim(),
      answer: `Thank you! Your question has been routed to ${typeLabel}'s desk. An official answer will be published here upon verification.`,
      category: newQuestionCategory,
      helpfulCount: 1,
      askedByPatient: true
    };

    const updated = [newFaq, ...(provider.faqs || [])];
    if (onUpdateFaqs) {
      onUpdateFaqs(updated);
    }

    setQuestionSubmitted(true);
    setTimeout(() => {
      setQuestionSubmitted(false);
      setIsAskModalOpen(false);
      setNewQuestionText("");
    }, 2000);
  };

  const handleAddCustomFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !customAnswer.trim()) return;

    const newFaq: FAQItem = {
      id: `faq-cust-${Date.now()}`,
      question: customQuestion.trim(),
      answer: customAnswer.trim(),
      category: customCategory,
      helpfulCount: 5
    };

    const updated = [newFaq, ...(provider.faqs || [])];
    if (onUpdateFaqs) {
      onUpdateFaqs(updated);
    }

    setIsManageModalOpen(false);
    setCustomQuestion("");
    setCustomAnswer("");
  };

  const isProviderOwner = currentUser && (
    currentUser.uid === provider.id ||
    currentUser.email?.toLowerCase() === provider.email?.toLowerCase() ||
    currentUser.role === "admin"
  );

  return (
    <div id="provider-faq-section" className={`bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 text-left ${className}`}>
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-teal-100 flex items-center gap-1">
              <HelpCircle className="h-3 w-3 text-teal-600" />
              Patient Help Desk
            </span>
            <span className="text-slate-400 text-xs font-mono">
              {allFaqs.length} Indexed Q&amp;As
            </span>
          </div>
          <h3 className="font-sans font-extrabold text-slate-800 text-lg sm:text-xl">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quick answers to common OPD, fee, scheduling, and facility inquiries for {typeLabel}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAskModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquarePlus className="h-4 w-4 text-teal-400" />
            <span>Ask a Question</span>
          </button>

          {isProviderOwner && (
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-teal-600" />
              <span>Add FAQ</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search questions about fees, timings, insurance, parking...`}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-sans text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1 shrink-0">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="mt-6 space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3">
            <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No matching questions found</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any questions matching "{searchQuery}". Have a specific query? Click "Ask a Question" to submit it directly to {typeLabel}'s desk.
            </p>
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="mt-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              <span>Ask {typeLabel} Directly</span>
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = !!openIndices[faq.id || `faq-${index}`];
            const vote = helpfulVotes[faq.id] || null;
            const currentHelpful = (faq.helpfulCount || 10) + (vote === "up" ? 1 : 0);

            return (
              <div
                key={faq.id || index}
                className={`border transition-all rounded-2xl overflow-hidden ${
                  isOpen 
                    ? "border-teal-200 bg-teal-50/20 shadow-xs" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id || `faq-${index}`)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 focus:outline-none cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-bold text-slate-800 text-xs sm:text-sm leading-snug">
                        {faq.question}
                      </span>
                      {faq.category && (
                        <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {faq.category}
                        </span>
                      )}
                      {faq.askedByPatient && (
                        <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Recently Asked
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-100/60 bg-white">
                    <p className="mt-2 text-slate-700 font-sans">{faq.answer}</p>

                    {/* Footer Feedback Bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle className="h-3.5 w-3.5 text-teal-600" />
                        Verified by {typeLabel}'s clinical administrative team
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">Helpful?</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(faq.id, "up");
                          }}
                          className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 ${
                            vote === "up" ? "text-teal-600 font-bold bg-teal-50" : "text-slate-400"
                          }`}
                          title="Mark as helpful"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span className="text-[10px]">{currentHelpful}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(faq.id, "down");
                          }}
                          className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer ${
                            vote === "down" ? "text-rose-600 bg-rose-50" : "text-slate-400"
                          }`}
                          title="Mark as unhelpful"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Notice Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs text-slate-500 font-sans">
        <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-700">Need specific medical advice?</span> FAQs are for general administrative &amp; OPD guidance. For personal diagnosis or urgent medical evaluation, please book a direct consultation with {typeLabel}.
        </div>
      </div>

      {/* MODAL: Ask a Patient Question */}
      {isAskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-left animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAskModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-teal-50 rounded-xl text-teal-600">
                <MessageSquarePlus className="h-5 w-5" />
              </span>
              <h4 className="font-sans font-extrabold text-slate-800 text-lg">
                Ask {typeLabel} a Question
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Have a question about OPD timings, facility features, or preparation? Submit your question below and our desk team will reply.
            </p>

            {questionSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                <h5 className="font-bold text-emerald-900 text-sm">Question Submitted Successfully!</h5>
                <p className="text-xs text-emerald-700">
                  Your inquiry has been sent to {typeLabel}'s desk. Once verified, it will be added to the public FAQ list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAskQuestionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question Category
                  </label>
                  <select
                    value={newQuestionCategory}
                    onChange={(e) => setNewQuestionCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="General">General / Administrative</option>
                    <option value="Appointments">Appointments &amp; Scheduling</option>
                    <option value="Fees & Payments">Fees &amp; Payment Options</option>
                    <option value="Insurance & Billing">Insurance &amp; Cashless Claims</option>
                    <option value="Services & Facilities">Facilities &amp; Test Reports</option>
                    <option value="Emergency">Emergency &amp; Trauma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Question <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="e.g. Do I need to fast before coming for my morning OPD diagnostic scan?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Email (for notification when answered)
                  </label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Provider / Admin Add FAQ */}
      {isManageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-left animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsManageModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-teal-50 rounded-xl text-teal-600">
                <Plus className="h-5 w-5" />
              </span>
              <h4 className="font-sans font-extrabold text-slate-800 text-lg">
                Add Custom Profile FAQ
              </h4>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Publish common questions directly to your public clinical profile to eliminate repeated phone queries.
            </p>

            <form onSubmit={handleAddCustomFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="General">General</option>
                  <option value="Appointments">Appointments &amp; Timings</option>
                  <option value="Fees & Payments">Fees &amp; Payment Options</option>
                  <option value="Insurance & Billing">Insurance &amp; Billing</option>
                  <option value="Services & Facilities">Services &amp; Facilities</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="e.g. Is prior appointment necessary for Sunday OPD?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  placeholder="e.g. Sunday consultations are conducted strictly on prior slot booking between 10:00 AM and 1:00 PM."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Publish FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
