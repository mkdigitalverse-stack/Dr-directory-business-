import React, { useState } from "react";
import { X, Calendar, Clock, CheckCircle, ShieldCheck, Mail, Phone, User, FileText } from "lucide-react";
import { Provider, Appointment, ProviderType } from "../types";

interface BookingModalProps {
  provider: Provider;
  onClose: () => void;
  onConfirmBooking: (bookingDetails: {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientSymptoms: string;
    date: string;
    time: string;
  }) => void;
}

export default function BookingModal({ provider, onClose, onConfirmBooking }: BookingModalProps) {
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientSymptoms, setPatientSymptoms] = useState("");
  
  // Slot selection states
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1); // default tomorrow
  const [selectedDate, setSelectedDate] = useState(defaultDate.toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState("");
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedData, setConfirmedData] = useState<any>(null);

  // Available slots lists
  const availableSlots = [
    "10:00 AM", "11:30 AM", "01:00 PM", "04:30 PM", "06:00 PM", "07:30 PM"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert("Please select a convenient timing slot.");
      return;
    }

    const details = {
      patientName,
      patientEmail,
      patientPhone,
      patientSymptoms,
      date: selectedDate,
      time: selectedSlot
    };

    setConfirmedData(details);
    onConfirmBooking(details);
    setBookingSuccess(true);
  };

  const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-750 p-1 rounded-full hover:bg-slate-50 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {bookingSuccess && confirmedData ? (
          /* SUCCESS STATE PANEL */
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-100 shadow">
              <CheckCircle className="h-8 w-8 stroke-[2.5] animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-sans font-extrabold text-slate-900 text-xl">Consultation Query Sent!</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-sans">
                Awesome! Your appointment reservation has been dispatched to Dr. {provider.name}'s OPD desk.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 text-left space-y-2.5 font-sans">
              <div className="flex justify-between">
                <span className="text-slate-400">Practitioner</span>
                <strong className="text-slate-800">{typeLabel}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Consultation Date</span>
                <strong className="text-slate-800">{confirmedData.date}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timings Slot</span>
                <strong className="text-slate-800 font-mono text-[11px]">{confirmedData.time}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient</span>
                <strong className="text-slate-800">{confirmedData.patientName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">OPD Consultation Fee</span>
                <strong className="text-teal-600 font-bold">₹{provider.consultationFee}</strong>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-100 text-teal-800 rounded-xl text-left text-[11px] flex gap-2 items-start font-sans">
              <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
              <span>We have sent an SMS confirmation voucher with landmarks to <strong>{confirmedData.patientPhone}</strong>. Carry it directly to the clinical counter.</span>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-black text-white font-sans text-sm font-bold py-3 rounded-xl transition-all cursor-pointer"
            >
              Done, Close Window
            </button>
          </div>
        ) : (
          /* FORM ENTRY PANEL */
          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            
            <div className="space-y-1 text-left">
              <h3 className="font-sans font-extrabold text-slate-900 text-lg">
                Schedule Appointment Slot
              </h3>
              <p className="text-xs text-slate-500">
                Registering for OPD session with <strong className="text-slate-800">{typeLabel}</strong>
              </p>
            </div>

            {/* 1. Date and slot selection row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-teal-500 shrink-0" />
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-teal-500 shrink-0" />
                  Select Timing Slot
                </label>
                <div className="relative">
                  <select
                    required
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="">Choose Timing Slot</option>
                    {availableSlots.map(sl => (
                      <option key={sl} value={sl}>{sl}</option>
                    ))}
                  </select>
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2. Patient details credentials form */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <p className="font-bold text-slate-800 uppercase tracking-widest text-[10px]">Patient Registration Details</p>
              
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    Email ID
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="e.g. 9876543210 (10 digits)"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  Primary Symptoms / Comments (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Chronic joint pains, regular high BP spike assessments..."
                  value={patientSymptoms}
                  onChange={(e) => setPatientSymptoms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-xs rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 h-16 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-sans text-sm font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Verify &amp; Dispatched OPD Call
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
