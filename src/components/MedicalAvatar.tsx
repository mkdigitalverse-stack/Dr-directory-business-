import React, { useState } from "react";
import { Stethoscope, Building2, Hospital, Microscope, ShieldCheck } from "lucide-react";
import { ProviderType } from "../types";

interface MedicalAvatarProps {
  src?: string;
  name: string;
  type?: ProviderType | string;
  className?: string;
}

export default function MedicalAvatar({ src, name, type = ProviderType.DOCTOR, className = "w-16 h-16" }: MedicalAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Extract clean initials
  const cleanName = name.replace(/^Dr\.\s+/i, "").trim();
  const initials = cleanName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "MD";

  const getTypeIcon = () => {
    switch (type) {
      case ProviderType.CLINIC:
        return <Building2 className="w-1/2 h-1/2 text-teal-600" />;
      case ProviderType.HOSPITAL:
        return <Hospital className="w-1/2 h-1/2 text-indigo-600" />;
      case ProviderType.LAB:
        return <Microscope className="w-1/2 h-1/2 text-sky-600" />;
      default:
        return <Stethoscope className="w-1/2 h-1/2 text-teal-600" />;
    }
  };

  const getTypeGradient = () => {
    switch (type) {
      case ProviderType.CLINIC:
        return "from-teal-500/10 via-teal-100/30 to-emerald-500/10 border-teal-200 text-teal-900";
      case ProviderType.HOSPITAL:
        return "from-indigo-500/10 via-indigo-100/30 to-purple-500/10 border-indigo-200 text-indigo-900";
      case ProviderType.LAB:
        return "from-sky-500/10 via-sky-100/30 to-blue-500/10 border-sky-200 text-sky-900";
      default:
        return "from-emerald-500/10 via-teal-100/30 to-teal-500/10 border-teal-200 text-teal-900";
    }
  };

  if (!src || imageError) {
    return (
      <div className={`relative ${className} rounded-2xl bg-gradient-to-br ${getTypeGradient()} border shadow-sm flex flex-col items-center justify-center shrink-0 group/avatar`}>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xs rounded-2xl"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          {getTypeIcon()}
          <span className="font-mono font-extrabold text-[11px] tracking-wider mt-0.5">
            {initials}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border border-teal-200 shadow-xs z-20">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm shrink-0 bg-slate-100`}>
      <img
        src={src}
        alt={name}
        onError={() => setImageError(true)}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
      <div className="absolute -bottom-1 -right-1 bg-white/95 p-0.5 rounded-full border border-teal-200 shadow-xs z-20">
        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
      </div>
    </div>
  );
}
