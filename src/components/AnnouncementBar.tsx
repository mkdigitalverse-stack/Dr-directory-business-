import React, { useState } from "react";
import { Megaphone, X } from "lucide-react";

const ANNOUNCEMENTS = [
  "Welcome to Lucknow's Trusted Healthcare Directory & Discovery Portal 🏥",
  "Now Accepting Doctor, Clinic & Hospital Registrations - Boost Local SEO 🚀",
  "New Verified Healthcare Articles & Clinical Wellness Guides Published Weekly 📚",
  "Book Free Appointment Enquiries Online with NMC Verified Providers 📞"
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      id="announcement-bar"
      className="bg-teal-700 text-white py-1.5 text-[10px] sm:text-xs flex items-center justify-between transition-all relative border-b border-teal-800 overflow-hidden"
    >
      <style>{`
        @keyframes marqueeR2L {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-r2l {
          display: flex;
          white-space: nowrap;
          animation: marqueeR2L 45s linear infinite;
          width: max-content;
        }
        .animate-marquee-r2l:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="flex-1 overflow-hidden relative flex items-center h-5">
        <div className="absolute left-2 z-10 bg-teal-700 px-2 flex items-center gap-1 font-bold text-teal-200 shrink-0 select-none">
          <Megaphone className="h-3.5 w-3.5 animate-pulse shrink-0" />
          <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Alert:</span>
        </div>
        
        <div className="w-full overflow-hidden flex items-center pl-16">
          <div className="animate-marquee-r2l flex items-center gap-12 font-semibold tracking-wide">
            {/* Set 1 */}
            {ANNOUNCEMENTS.map((text, idx) => (
              <span key={idx} className="flex items-center gap-2 shrink-0">
                <span>{text}</span>
                <span className="text-teal-400 font-bold">•</span>
              </span>
            ))}
            {/* Set 2 (Duplicate for seamless scroll) */}
            {ANNOUNCEMENTS.map((text, idx) => (
              <span key={`dup-${idx}`} className="flex items-center gap-2 shrink-0">
                <span>{text}</span>
                <span className="text-teal-400 font-bold">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        id="close-announcement-btn"
        onClick={() => setVisible(false)}
        className="text-teal-200 hover:text-white transition-colors p-1 rounded-full hover:bg-teal-800/40 focus:outline-none z-10 bg-teal-700 ml-2 mr-3"
        aria-label="Close Announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

