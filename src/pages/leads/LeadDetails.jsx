import React from 'react';
import { FiX, FiMail, FiPhone, FiMapPin, FiCalendar, FiDollarSign } from 'react-icons/fi';

const LeadDetails = ({ lead, onClose }) => {
  if (!lead) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e5e5e5] p-6 h-full relative flex flex-col">
      {onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX size={20} />
        </button>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#001552]">{lead.clientName}</h2>
        <p className="text-sm text-gray-500 mt-1">Proposal ID: <span className="font-medium">{lead.proposalId}</span></p>
      </div>
      
      <div className="flex gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
          lead.status?.toLowerCase() === "proposal"
            ? "bg-[#e0f0ff] text-[#3b82f6]"
            : lead.status?.toLowerCase() === "qualified"
              ? "bg-[#dcfce7] text-[#16a34a]"
              : lead.status?.toLowerCase() === "on hold" ||
                  lead.status?.toLowerCase() === "pending"
                ? "bg-[#fee2e2] text-[#ef4444]"
                : "bg-gray-100 text-gray-500"
        }`}>
          {lead.status}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-gray-100 text-gray-600">
          {lead.scope}
        </span>
      </div>

      <div className="flex flex-col gap-5 flex-1">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FiPhone size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Contact Number</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{lead.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FiMapPin size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Location</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{lead.location}</p>
            {lead.locationSecondary && (
              <p className="text-xs text-gray-500 mt-0.5">{lead.locationSecondary}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FiDollarSign size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Investment</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{lead.investment}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FiCalendar size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Possession Date</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{lead.possessionDate}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
        <button className="flex-1 py-2.5 bg-[#1E3A8A] hover:bg-[#001552] text-white rounded-xl text-sm font-semibold transition-colors">
          Edit Lead
        </button>
        <button className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
          View History
        </button>
      </div>
    </div>
  );
};

export default LeadDetails;
