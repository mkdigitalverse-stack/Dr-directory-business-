import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, CheckCircle, ShieldCheck, Mail, Phone, User, FileText, MapPin, AlertCircle, MessageSquare } from "lucide-react";
import { Provider, Appointment, ProviderType, UserProfile, UserRole } from "../types";

interface BookingModalProps {
  provider: Provider;
  currentUser?: UserProfile | null;
  appointments?: Appointment[];
  onClose: () => void;
  onOpenAuth?: (mode: "login" | "signup", role?: UserRole) => void;
  onConfirmBooking: (bookingDetails: {
    serviceId?: string;
    serviceName?: string;
    locationId?: string;
    locationAddress?: string;
    patientName: string;
    patientFirstName?: string;
    patientLastName?: string;
    patientEmail: string;
    patientPhone: string;
    patientSymptoms?: string;
    date: string;
    time: string;
  }) => boolean | void;
}

export default function BookingModal({
  provider,
  currentUser,
  appointments = [],
  onClose,
  onOpenAuth,
  onConfirmBooking
}: BookingModalProps) {
  // Pre-fill user details if logged in
  const userFirstName = currentUser?.displayName ? currentUser.displayName.split(" ")[0] : "";
  const userLastName = currentUser?.displayName && currentUser.displayName.split(" ").length > 1 
    ? currentUser.displayName.split(" ").slice(1).join(" ") 
    : "";

  const [patientFirstName, setPatientFirstName] = useState(userFirstName);
  const [patientLastName, setPatientLastName] = useState(userLastName);
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || "");
  const [patientPhone, setPatientPhone] = useState(currentUser?.phoneNumber || "");
  const [patientSymptoms, setPatientSymptoms] = useState("");

  // Services
  const availableServices = provider.structuredServices?.length 
    ? provider.structuredServices 
    : (provider.services?.length ? provider.services.map((s, idx) => ({ id: `srv-${idx}`, name: s, fee: provider.consultationFee })) : [{ id: "srv-default", name: "OPD Consultation", fee: provider.consultationFee }]);

  const [selectedServiceId, setSelectedServiceId] = useState(availableServices[0]?.id || "srv-default");
  const selectedService = availableServices.find(s => s.id === selectedServiceId) || availableServices[0];

  // Locations
  const availableLocations = provider.locations?.length
    ? provider.locations
    : [{ id: "loc-default", address: provider.address, locality: provider.localityId.replace("-", " ") }];

  const [selectedLocationId, setSelectedLocationId] = useState(availableLocations[0]?.id || "loc-default");
  const selectedLocation = availableLocations.find(l => l.id === selectedLocationId) || availableLocations[0];

  // Date and Time Slot
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 1); // Tomorrow
  const [selectedDate, setSelectedDate] = useState(defaultDate.toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [doubleBookingError, setDoubleBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedData, setConfirmedData] = useState<any>(null);

  // Standard Available OPD slots
  const allTimeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:30 PM", "04:30 PM", "06:00 PM", "07:30 PM"
  ];

  // Restore pending booking state from localStorage if user just logged in
  useEffect(() => {
    const savedPending = localStorage.getItem("lko_pending_booking");
    if (savedPending) {
      try {
        const parsed = JSON.parse(savedPending);
        if (parsed.providerId === provider.id) {
          if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
          if (parsed.selectedSlot) setSelectedSlot(parsed.selectedSlot);
          if (parsed.patientFirstName) setPatientFirstName(parsed.patientFirstName);
          if (parsed.patientLastName) setPatientLastName(parsed.patientLastName);
          if (parsed.patientEmail) setPatientEmail(parsed.patientEmail);
          if (parsed.patientPhone) setPatientPhone(parsed.patientPhone);
          if (parsed.patientSymptoms) setPatientSymptoms(parsed.patientSymptoms);
          localStorage.removeItem("lko_pending_booking");
        }
      } catch (e) {
        console.warn("Failed to restore pending booking state:", e);
      }
    }
  }, [provider.id]);

  // Double-booking check logic for time slots
  const isSlotBooked = (slotTime: string) => {
    return appointments.some(app => 
      app.providerId === provider.id &&
      app.date === selectedDate &&
      app.time === slotTime &&
      app.status !== "cancelled" &&
      app.status !== "CANCELLED"
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDoubleBookingError("");

    if (!selectedSlot) {
      setDoubleBookingError("Please select an available timing slot.");
      return;
    }

    // Step double booking check
    if (isSlotBooked(selectedSlot)) {
      setDoubleBookingError("Sorry, this time slot was just booked by another patient. Please choose a different slot.");
      return;
    }

    const fullPatientName = `${patientFirstName.trim()} ${patientLastName.trim()}`.trim() || currentUser?.displayName || "Patient";

    // Handle Unauthenticated User Flow
    if (!currentUser) {
      // Save pending booking details to localStorage
      const pendingData = {
        providerId: provider.id,
        selectedServiceId,
        selectedLocationId,
        selectedDate,
        selectedSlot,
        patientFirstName,
        patientLastName,
        patientEmail,
        patientPhone,
        patientSymptoms
      };
      localStorage.setItem("lko_pending_booking", JSON.stringify(pendingData));

      if (onOpenAuth) {
        onOpenAuth("login", "patient");
      }
      return;
    }

    const bookingDetails = {
      serviceId: selectedService?.id,
      serviceName: selectedService?.name,
      locationId: selectedLocation?.id,
      locationAddress: selectedLocation?.address,
      patientName: fullPatientName,
      patientFirstName: patientFirstName.trim(),
      patientLastName: patientLastName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      patientSymptoms: patientSymptoms.trim(),
      date: selectedDate,
      time: selectedSlot
    };

    const success = onConfirmBooking(bookingDetails);
    if (success === false) {
      setDoubleBookingError("Double Booking Guard: This provider time slot is no longer available. Please select another time.");
      return;
    }

    setConfirmedData(bookingDetails);
    setBookingSuccess(true);
  };

  const typeLabel = provider.type === ProviderType.DOCTOR ? `Dr. ${provider.name}` : provider.name;
  const isBookingDisabled = provider.status === "SUSPENDED" || provider.status === "REJECTED";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-left">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {bookingSuccess && confirmedData ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-100 shadow">
              <CheckCircle className="h-8 w-8 stroke-[2.5]" />
            </div>
            
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                BOOKING REQUEST CONFIRMED
              </span>
              <h3 className="font-sans font-extrabold text-slate-900 text-xl tracking-tight">
                Appointment Dispatched!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your consultation request has been sent directly to <strong>{typeLabel}</strong>'s OPD desk in Lucknow.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-2.5 font-sans">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400">Healthcare Provider</span>
                <strong className="text-slate-900">{typeLabel}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400">Requested Service</span>
                <strong className="text-slate-900">{confirmedData.serviceName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400">Date & Time Slot</span>
                <strong className="text-slate-900 font-mono text-[11px]">{confirmedData.date} at {confirmedData.time}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-400">Consultation Location</span>
                <strong className="text-slate-900 truncate max-w-[200px]">{confirmedData.locationAddress}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient Name</span>
                <strong className="text-slate-900">{confirmedData.patientName} ({confirmedData.patientPhone})</strong>
              </div>
            </div>

            <div className="p-3.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl text-left text-xs flex gap-2.5 items-start">
              <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-teal-950">No Online Payment Required</strong>
                <span className="text-[11px]">Pay the consultation fee of <strong>₹{selectedService?.fee || provider.consultationFee}</strong> directly at the clinic desk during your visit.</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-black text-white font-sans text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Done, Close Window
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-STEP BOOKING FORM */
          <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
            
            <div className="space-y-1 text-left">
              <span className="font-mono text-[10px] text-teal-800 font-extrabold uppercase tracking-widest bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-md">
                APPOINTMENT BOOKING
              </span>
              <h3 className="font-sans font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight mt-1">
                Book Consultation with {typeLabel}
              </h3>
              <p className="text-xs text-slate-500">
                Lucknow OPD schedule & double-booking protected appointment slot.
              </p>
            </div>

            {isBookingDisabled && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                <span>This provider listing is currently not accepting new bookings. Please select another verified provider in Lucknow.</span>
              </div>
            )}

            {doubleBookingError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs flex items-center gap-2 font-bold animate-in fade-in duration-200">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <span>{doubleBookingError}</span>
              </div>
            )}

            {/* STEP 1: SERVICE SELECTION */}
            {availableServices.length > 1 && (
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block text-xs">
                  1. Select Clinical Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableServices.map(srv => (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedServiceId === srv.id
                          ? "bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="font-bold text-xs">{srv.name}</div>
                      <div className="text-[11px] text-teal-700 font-mono mt-0.5">₹{srv.fee || provider.consultationFee}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION SELECTION */}
            {availableLocations.length > 1 && (
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block text-xs">
                  2. Select Consultation Location
                </label>
                <div className="space-y-2">
                  {availableLocations.map(loc => (
                    <button
                      type="button"
                      key={loc.id}
                      onClick={() => setSelectedLocationId(loc.id)}
                      className={`w-full p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-2 ${
                        selectedLocationId === loc.id
                          ? "bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <div className="font-bold">{loc.locality || provider.localityId}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{loc.address}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 & 4: DATE AND TIME SLOT SELECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
                  Select Date *
                </label>
                <input
                  type="date"
                  required
                  disabled={isBookingDisabled}
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                    setDoubleBookingError("");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Clock className="h-4 w-4 text-teal-600 shrink-0" />
                  Select Time Slot *
                </label>
                <select
                  required
                  disabled={isBookingDisabled}
                  value={selectedSlot}
                  onChange={(e) => {
                    setSelectedSlot(e.target.value);
                    setDoubleBookingError("");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="">-- Choose Timing Slot --</option>
                  {allTimeSlots.map(slot => {
                    const booked = isSlotBooked(slot);
                    return (
                      <option key={slot} value={slot} disabled={booked}>
                        {slot} {booked ? "(Booked - Unavailable)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Slot Quick Selection Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Available OPD Slots on {selectedDate}:</span>
              <div className="flex flex-wrap gap-1.5">
                {allTimeSlots.map(slot => {
                  const booked = isSlotBooked(slot);
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={booked || isBookingDisabled}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setDoubleBookingError("");
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        booked 
                          ? "bg-slate-100 text-slate-400 border border-slate-200 line-through cursor-not-allowed" 
                          : selectedSlot === slot
                          ? "bg-teal-600 text-white border border-teal-600 shadow-sm"
                          : "bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: PATIENT DETAILS */}
            <div className="space-y-3 pt-3 border-t border-slate-200/80">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Patient Details
                </span>
                {currentUser && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Logged in as {currentUser.displayName || currentUser.email}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isBookingDisabled}
                    placeholder="e.g. Kamlesh"
                    value={patientFirstName}
                    onChange={(e) => setPatientFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isBookingDisabled}
                    placeholder="e.g. Verma"
                    value={patientLastName}
                    onChange={(e) => setPatientLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    disabled={isBookingDisabled}
                    placeholder="e.g. 9839012345"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled={isBookingDisabled}
                    placeholder="e.g. kamlesh@mail.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Reason for Visit / Note (Optional)</label>
                <textarea
                  rows={2}
                  disabled={isBookingDisabled}
                  placeholder="e.g. Routine consultation, follow-up visit..."
                  value={patientSymptoms}
                  onChange={(e) => setPatientSymptoms(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500 resize-none h-16"
                />
              </div>
            </div>

            {!currentUser && (
              <div className="bg-sky-50 border border-sky-200 text-sky-900 p-3 rounded-2xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-sky-600 shrink-0" />
                <span>You will be prompted to sign in or register to complete and confirm your booking securely.</span>
              </div>
            )}

            {/* Direct Contact Alternative Buttons */}
            {provider.phone && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Prefer to call directly?</span>
                <a
                  href={`tel:${provider.phone}`}
                  className="text-teal-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5 text-teal-600" />
                  Call {provider.phone}
                </a>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isBookingDisabled}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-sans text-sm font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>{currentUser ? "Confirm & Schedule Appointment" : "Sign In & Confirm Booking"}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
