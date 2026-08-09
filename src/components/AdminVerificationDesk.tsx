import React, { useState } from "react";
import { Provider, ProviderVerification, AuditLog, VerificationStatus, UserProfile } from "../types";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Eye, 
  Clock, 
  UserCheck, 
  Search, 
  Filter, 
  RotateCcw,
  History,
  Lock,
  Building2,
  X,
  ChevronRight
} from "lucide-react";

interface AdminVerificationDeskProps {
  verifications: ProviderVerification[];
  providers: Provider[];
  auditLogs: AuditLog[];
  currentUser: UserProfile | null;
  onApproveVerification: (verificationId: string, providerId: string, notes: string) => void;
  onRejectVerification: (verificationId: string, providerId: string, reason: string) => void;
  onRequestChanges: (verificationId: string, providerId: string, notes: string) => void;
  onSuspendVerification: (providerId: string, reason: string) => void;
}

export const AdminVerificationDesk: React.FC<AdminVerificationDeskProps> = ({
  verifications,
  providers,
  auditLogs,
  currentUser,
  onApproveVerification,
  onRejectVerification,
  onRequestChanges,
  onSuspendVerification
}) => {
  const [activeTab, setActiveTab] = useState<"pending" | "verified" | "rejected" | "all_providers" | "audit_trail">("pending");
  const [selectedVerification, setSelectedVerification] = useState<ProviderVerification | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalAction, setModalAction] = useState<"approve" | "reject" | "changes" | "suspend" | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionTarget, setActionTarget] = useState<{ verificationId?: string; providerId: string; providerName: string } | null>(null);

  const getProvider = (providerId: string) => providers.find(p => p.id === providerId);

  const pendingList = verifications.filter(v => v.status === "VERIFICATION_PENDING");
  const verifiedList = verifications.filter(v => v.status === "VERIFIED");
  const rejectedList = verifications.filter(v => v.status === "VERIFICATION_REJECTED");

  const filteredVerifications = verifications.filter(v => {
    const matchesTab = 
      activeTab === "pending" ? v.status === "VERIFICATION_PENDING" :
      activeTab === "verified" ? v.status === "VERIFIED" :
      activeTab === "rejected" ? v.status === "VERIFICATION_REJECTED" : true;

    const matchesSearch = searchQuery === "" || 
      v.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.credentialData?.medicalRegistrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.credentialData?.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleExecuteModalAction = () => {
    if (!actionTarget) return;

    if (modalAction === "approve" && actionTarget.verificationId) {
      onApproveVerification(actionTarget.verificationId, actionTarget.providerId, actionReason || "Credentials verified against medical council database.");
    } else if (modalAction === "reject" && actionTarget.verificationId) {
      if (!actionReason) {
        alert("Please specify a reason for rejecting the verification.");
        return;
      }
      onRejectVerification(actionTarget.verificationId, actionTarget.providerId, actionReason);
    } else if (modalAction === "changes" && actionTarget.verificationId) {
      if (!actionReason) {
        alert("Please specify what changes or additional documents are required.");
        return;
      }
      onRequestChanges(actionTarget.verificationId, actionTarget.providerId, actionReason);
    } else if (modalAction === "suspend") {
      if (!actionReason) {
        alert("Please specify a reason for suspending provider verification.");
        return;
      }
      onSuspendVerification(actionTarget.providerId, actionReason);
    }

    setModalAction(null);
    setActionReason("");
    setActionTarget(null);
    setSelectedVerification(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Admin Verification & Trust Governance Desk</h2>
            <p className="text-xs text-slate-300">
              Audit provider licenses, verify medical registrations, approve badges, and enforce platform governance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            Role: <span className="text-teal-400 font-bold uppercase">{currentUser?.role || "ADMIN"}</span>
          </span>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === "pending" ? "bg-amber-100 text-amber-900 font-extrabold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Audit ({pendingList.length})
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === "verified" ? "bg-emerald-100 text-emerald-900 font-extrabold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified ({verifiedList.length})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === "rejected" ? "bg-rose-100 text-rose-900 font-extrabold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected ({rejectedList.length})
          </button>
          <button
            onClick={() => setActiveTab("all_providers")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === "all_providers" ? "bg-teal-100 text-teal-900 font-extrabold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            All Directory Listings ({providers.length})
          </button>
          <button
            onClick={() => setActiveTab("audit_trail")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === "audit_trail" ? "bg-slate-800 text-white font-extrabold" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-300" />
            Governance Audit Log ({auditLogs.length})
          </button>
        </div>

        {activeTab !== "audit_trail" && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search provider, reg no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        )}
      </div>

      {/* VERIFICATIONS & PROVIDERS TABLE VIEW */}
      {activeTab !== "audit_trail" && activeTab !== "all_providers" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List column */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Verification Submissions
              </span>
              <span className="text-xs text-slate-500 font-mono">{filteredVerifications.length} records</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredVerifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No verification records found for this view.
                </div>
              ) : (
                filteredVerifications.map((item) => {
                  const isSelected = selectedVerification?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedVerification(item)}
                      className={`w-full p-4 text-left transition-colors flex items-start justify-between gap-2 ${
                        isSelected ? "bg-teal-50/80 border-l-4 border-teal-600" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-slate-900 block">{item.providerName}</span>
                        <span className="text-xs text-slate-500 block font-mono">
                          Reg / Lic: {item.credentialData?.medicalRegistrationNumber || item.credentialData?.licenseNumber || "N/A"}
                        </span>
                        <div className="flex items-center gap-2 pt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            item.status === "VERIFIED" ? "bg-emerald-100 text-emerald-800" :
                            item.status === "VERIFICATION_PENDING" ? "bg-amber-100 text-amber-800" :
                            "bg-rose-100 text-rose-800"
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] text-slate-400">Submitted: {item.submittedAt}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-400 mt-1 shrink-0 ${isSelected ? "text-teal-600" : ""}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Detailed Audit View column */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {!selectedVerification ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-medium">Select a verification submission from the left list to review document proofs and perform governance actions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Provider Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{selectedVerification.providerName}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 uppercase">
                        {selectedVerification.providerType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted by Uid: <span className="font-mono text-slate-700">{selectedVerification.requestedByUid}</span> on {selectedVerification.submittedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedVerification.status === "VERIFICATION_PENDING" && (
                      <>
                        <button
                          onClick={() => {
                            setActionTarget({ verificationId: selectedVerification.id, providerId: selectedVerification.providerId, providerName: selectedVerification.providerName || "" });
                            setModalAction("approve");
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve Verification
                        </button>
                        <button
                          onClick={() => {
                            setActionTarget({ verificationId: selectedVerification.id, providerId: selectedVerification.providerId, providerName: selectedVerification.providerName || "" });
                            setModalAction("reject");
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setActionTarget({ verificationId: selectedVerification.id, providerId: selectedVerification.providerId, providerName: selectedVerification.providerName || "" });
                            setModalAction("changes");
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                        >
                          Request Changes
                        </button>
                      </>
                    )}

                    {selectedVerification.status === "VERIFIED" && (
                      <button
                        onClick={() => {
                          setActionTarget({ verificationId: selectedVerification.id, providerId: selectedVerification.providerId, providerName: selectedVerification.providerName || "" });
                          setModalAction("suspend");
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Suspend / Unverify
                      </button>
                    )}
                  </div>
                </div>

                {/* Credential Data Breakdown */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Medical Council / License Credentials</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Registration / License No:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedVerification.credentialData?.medicalRegistrationNumber || selectedVerification.credentialData?.licenseNumber || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Authority / Council:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedVerification.credentialData?.registrationAuthority || selectedVerification.credentialData?.ownershipType || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Qualification / Degree:</span>
                      <span className="font-semibold text-slate-800">
                        {selectedVerification.credentialData?.qualification || selectedVerification.credentialData?.responsibleOfficer || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verification Document Vault Proofs */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    Submitted Verification Documents ({selectedVerification.documentReferences?.length || 0})
                  </h4>

                  <div className="space-y-2">
                    {selectedVerification.documentReferences?.map((doc) => (
                      <div key={doc.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.documentType}</span>
                            <span className="text-slate-500 font-mono">{doc.fileName} • Ref: {doc.documentNumber || "Provided"}</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded font-mono">
                          Uploaded {doc.uploadedAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit History Notes */}
                {selectedVerification.reviewNotes && (
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-teal-950 block">Audit Notes ({selectedVerification.reviewedBy}):</span>
                    <p className="text-teal-900">{selectedVerification.reviewNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALL DIRECTORY LISTINGS STATUS GOVERNANCE TABLE */}
      {activeTab === "all_providers" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">All Directory Provider Listings Status Overview</h3>
            <span className="text-xs text-slate-500 font-mono">Rule: Approved Listing ≠ Verified Provider</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Provider Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Directory Status</th>
                  <th className="p-3">Verification Badge</th>
                  <th className="p-3">Council Reg No</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3 font-semibold text-slate-600 uppercase">{p.type}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        p.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" :
                        p.status === "PENDING" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {p.status || "APPROVED"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold flex items-center gap-1 w-fit ${
                        p.verified ? "bg-teal-100 text-teal-800" : "bg-slate-200 text-slate-700"
                      }`}>
                        {p.verified ? <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> : <Clock className="w-3.5 h-3.5" />}
                        {p.verified ? "VERIFIED PROVIDER" : "UNVERIFIED"}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600">{p.medicalRegistrationNumber || "N/A"}</td>
                    <td className="p-3 text-right">
                      {p.verified ? (
                        <button
                          onClick={() => {
                            setActionTarget({ providerId: p.id, providerName: p.name });
                            setModalAction("suspend");
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[10px]"
                        >
                          Revoke Verification
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Needs Audit Request</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOG TRAIL TABLE */}
      {activeTab === "audit_trail" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Administrative Governance Audit Log</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Immutable Governance Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Actor / Admin</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No administrative audit entries logged yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-3 font-bold text-slate-900">{log.actorName} ({log.actorRole})</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          log.action.includes("APPROVED") ? "bg-emerald-100 text-emerald-800" :
                          log.action.includes("REJECTED") || log.action.includes("SUSPENDED") ? "bg-rose-100 text-rose-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">{log.entityType} : {log.entityId}</td>
                      <td className="p-3 text-slate-600 font-sans">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACTION MODAL FOR APPROVE / REJECT / REQUEST CHANGES / SUSPEND */}
      {modalAction && actionTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {modalAction === "approve" && "Confirm Verification Approval"}
                {modalAction === "reject" && "Reject Provider Verification"}
                {modalAction === "changes" && "Request Additional Credentials"}
                {modalAction === "suspend" && "Revoke Verification Badge"}
              </h3>
              <button onClick={() => setModalAction(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Target Provider: <strong className="text-slate-900">{actionTarget.providerName}</strong>
            </p>

            {(modalAction === "reject" || modalAction === "changes" || modalAction === "suspend" || modalAction === "approve") && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {modalAction === "approve" ? "Audit Review Notes (Optional)" : "Reason / Feedback Notes *"}
                </label>
                <textarea
                  rows={3}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={
                    modalAction === "reject" ? "e.g. Registration number MCI-XXXXX not found in UP Medical Council registry." :
                    modalAction === "changes" ? "e.g. Please upload clear scan of State Medical Registration renewal certificate." :
                    modalAction === "suspend" ? "e.g. Medical license expired on July 2026 without renewal proof." :
                    "e.g. Medical council reg verified successfully."
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteModalAction}
                className={`px-5 py-2 text-white text-xs font-bold rounded-xl shadow-md transition-colors ${
                  modalAction === "approve" ? "bg-emerald-600 hover:bg-emerald-700" :
                  modalAction === "reject" ? "bg-rose-600 hover:bg-rose-700" :
                  modalAction === "suspend" ? "bg-amber-600 hover:bg-amber-700" :
                  "bg-slate-800 hover:bg-slate-900"
                }`}
              >
                Confirm {modalAction.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerificationDesk;
