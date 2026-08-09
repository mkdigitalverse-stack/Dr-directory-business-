import React, { useState } from "react";
import { Provider, ProviderType, VerificationStatus, ProviderCredentialData, VerificationDocumentRef, ProviderVerification } from "../types";
import { 
  ShieldCheck, 
  FileText, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Lock, 
  Building2, 
  UserCheck, 
  HelpCircle 
} from "lucide-react";

interface VerificationUploadModalProps {
  provider: Provider;
  currentVerification?: ProviderVerification;
  onClose: () => void;
  onSubmitVerification: (verificationData: Partial<ProviderVerification>) => void;
}

export const VerificationUploadModal: React.FC<VerificationUploadModalProps> = ({
  provider,
  currentVerification,
  onClose,
  onSubmitVerification
}) => {
  const isDoctor = provider.type === ProviderType.DOCTOR;
  const isFacility = provider.type === ProviderType.CLINIC || provider.type === ProviderType.HOSPITAL || provider.type === ProviderType.LAB;

  const [fullName, setFullName] = useState(currentVerification?.credentialData?.fullName || provider.name || "");
  const [medicalRegistrationNumber, setMedicalRegistrationNumber] = useState(currentVerification?.credentialData?.medicalRegistrationNumber || provider.medicalRegistrationNumber || "");
  const [registrationAuthority, setRegistrationAuthority] = useState(currentVerification?.credentialData?.registrationAuthority || "Uttar Pradesh Medical Council");
  const [registrationYear, setRegistrationYear] = useState(currentVerification?.credentialData?.registrationYear || "2015");
  const [qualification, setQualification] = useState(currentVerification?.credentialData?.qualification || provider.qualification || "");
  const [specialization, setSpecialization] = useState(currentVerification?.credentialData?.specialization || provider.specialties?.[0] || "");

  const [legalBusinessName, setLegalBusinessName] = useState(currentVerification?.credentialData?.legalBusinessName || provider.name || "");
  const [licenseNumber, setLicenseNumber] = useState(currentVerification?.credentialData?.licenseNumber || provider.medicalRegistrationNumber || "");
  const [responsibleOfficer, setResponsibleOfficer] = useState(currentVerification?.credentialData?.responsibleOfficer || "");
  const [ownershipType, setOwnershipType] = useState(currentVerification?.credentialData?.ownershipType || "Private Partnership / Practice");

  const [documents, setDocuments] = useState<VerificationDocumentRef[]>(
    currentVerification?.documentReferences || [
      {
        id: "doc-init-1",
        documentType: isDoctor ? "Medical Registration Certificate" : "Clinical Establishment License",
        documentNumber: isDoctor ? (medicalRegistrationNumber || "UPMC-PENDING") : (licenseNumber || "REG-PENDING"),
        fileName: isDoctor ? "Registration_Certificate.pdf" : "Clinical_Establishment_License.pdf",
        uploadedAt: new Date().toISOString().split("T")[0]
      }
    ]
  );

  const [newDocType, setNewDocType] = useState(isDoctor ? "Government ID Proof" : "Chief Medical Officer NOC");
  const [newDocNum, setNewDocNum] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddDocument = () => {
    if (!newDocType) return;
    const doc: VerificationDocumentRef = {
      id: `doc-${Date.now()}`,
      documentType: newDocType,
      documentNumber: newDocNum || undefined,
      fileName: `${newDocType.replace(/[^a-zA-Z0-9]/g, "_")}_Upload.pdf`,
      uploadedAt: new Date().toISOString().split("T")[0]
    };
    setDocuments(prev => [...prev, doc]);
    setNewDocNum("");
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const credentialData: ProviderCredentialData = isDoctor
      ? {
          fullName,
          medicalRegistrationNumber,
          registrationAuthority,
          registrationYear,
          qualification,
          specialization
        }
      : {
          legalBusinessName,
          licenseNumber,
          responsibleOfficer,
          ownershipType,
          addressDetails: provider.address
        };

    const payload: Partial<ProviderVerification> = {
      providerId: provider.id,
      providerName: provider.name,
      providerType: provider.type,
      status: "VERIFICATION_PENDING",
      credentialData,
      documentReferences: documents,
      submittedAt: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      onSubmitVerification(payload);
      setIsSubmitting(false);
      setSuccessMsg("Verification credentials and document audit request submitted successfully!");
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  const currentStatus: VerificationStatus = provider.verificationStatus || currentVerification?.status || (provider.verified ? "VERIFIED" : "UNVERIFIED");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Provider Credential Verification</h2>
              <p className="text-xs text-slate-300">Official medical council and licensing governance audit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Indicator Banner */}
          <div className="p-4 rounded-xl border flex items-center justify-between bg-slate-50 border-slate-200">
            <div className="flex items-center gap-3">
              {currentStatus === "VERIFIED" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {currentStatus === "VERIFICATION_PENDING" && <Clock className="w-5 h-5 text-amber-600" />}
              {currentStatus === "VERIFICATION_REJECTED" && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {currentStatus === "UNVERIFIED" && <ShieldCheck className="w-5 h-5 text-slate-500" />}
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Current Verification Status</span>
                <span className="text-sm font-bold text-slate-900">
                  {currentStatus === "VERIFIED" && "VERIFIED PROVIDER (Active Badge Awarded)"}
                  {currentStatus === "VERIFICATION_PENDING" && "VERIFICATION PENDING (Under Administrative Audit)"}
                  {currentStatus === "VERIFICATION_REJECTED" && "VERIFICATION REJECTED"}
                  {currentStatus === "UNVERIFIED" && "UNVERIFIED (Action Required for Verification Badge)"}
                </span>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              currentStatus === "VERIFIED" ? "bg-emerald-100 text-emerald-800" :
              currentStatus === "VERIFICATION_PENDING" ? "bg-amber-100 text-amber-800" :
              currentStatus === "VERIFICATION_REJECTED" ? "bg-rose-100 text-rose-800" :
              "bg-slate-200 text-slate-700"
            }`}>
              {currentStatus}
            </span>
          </div>

          {currentVerification?.rejectionReason && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
              <span className="font-bold block text-rose-950">Previous Governance Review Feedback:</span>
              <p>{currentVerification.rejectionReason}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Practitioner or Facility Credentials */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                {isDoctor ? <UserCheck className="w-4 h-4 text-teal-600" /> : <Building2 className="w-4 h-4 text-teal-600" />}
                1. {isDoctor ? "Medical Council Practitioner Credentials" : "Clinical Establishment Licensing Data"}
              </h3>

              {isDoctor ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor Full Name (As per Council)</label>
                    <input 
                      type="text" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Registration Number *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. UPMC-89547 or MCI-45892" 
                      value={medicalRegistrationNumber}
                      onChange={(e) => setMedicalRegistrationNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Authority</label>
                    <input 
                      type="text" 
                      required 
                      value={registrationAuthority}
                      onChange={(e) => setRegistrationAuthority(e.target.value)}
                      placeholder="e.g. Uttar Pradesh Medical Council / MCI" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Year</label>
                    <input 
                      type="text" 
                      required 
                      value={registrationYear}
                      onChange={(e) => setRegistrationYear(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Qualification & Specialization</label>
                    <input 
                      type="text" 
                      required 
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. MBBS, MD (Medicine), DM (Cardiology)" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Legal Business Name</label>
                    <input 
                      type="text" 
                      required 
                      value={legalBusinessName}
                      onChange={(e) => setLegalBusinessName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Establishment License Number *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. REG-CLN-88219" 
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Medical Officer / Responsible Officer</label>
                    <input 
                      type="text" 
                      required 
                      value={responsibleOfficer}
                      onChange={(e) => setResponsibleOfficer(e.target.value)}
                      placeholder="Dr. Medical Superintendent Name" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ownership Type</label>
                    <input 
                      type="text" 
                      required 
                      value={ownershipType}
                      onChange={(e) => setOwnershipType(e.target.value)}
                      placeholder="e.g. Private Partnership / Trust / Ltd" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Document Verification Audit Vault */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                2. Verification Document Proofs (Private Vault)
              </h3>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 mb-4 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Uploaded verification documents are stored securely with strict PII access controls and are inspected exclusively by authorized administrative verification officers.
                </span>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2 mb-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">{doc.documentType}</span>
                        <span className="text-slate-500 font-mono">{doc.fileName} {doc.documentNumber && `• (${doc.documentNumber})`}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Document Form */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">Attach Additional Verification Document</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option>Medical Registration Certificate</option>
                    <option>Clinical Establishment License</option>
                    <option>Government ID Proof (Aadhaar/Passport)</option>
                    <option>Medical Degree / PG Specialty Certificate</option>
                    <option>Chief Medical Officer NOC</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Document Ref Number (Optional)"
                    value={newDocNum}
                    onChange={(e) => setNewDocNum(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Add Document Reference
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || documents.length === 0}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? "Submitting Request..." : "Submit for Verification Audit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationUploadModal;
