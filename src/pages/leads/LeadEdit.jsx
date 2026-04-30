import React, { useState,    } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TableData } from "../../data/TableData";
import avatar from "../../assets/images/avatar.png";
import EditInquiryform from "./EditInquiryform";
import {
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiDownload,
  FiFileText,
  FiLayers,
  FiHome,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";

const LeadEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(() => {
    const saved = localStorage.getItem("newLeadsData");
    let newLeads = [];
    if (saved) {
      try {
        newLeads = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const allLeads = [...TableData, ...newLeads];
    return allLeads.find((item) => item.proposalId === id) || null;
  });
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    const deleted = localStorage.getItem("deletedLeads");
    let deletedLeads = deleted ? JSON.parse(deleted) : [];
    if (!deletedLeads.includes(id)) {
      deletedLeads.push(id);
      localStorage.setItem("deletedLeads", JSON.stringify(deletedLeads));
    }
    setShowDeleteConfirm(false);
    navigate("/leads");
  };

  const handleEditSave = (updatedData) => {
    const saved = localStorage.getItem("newLeadsData");
    let newLeads = saved ? JSON.parse(saved) : [];

    // Map formData back to lead format
    const newLeadFormat = {
      ...lead,
      clientName: updatedData.fullName,
      phone: updatedData.phoneNumber,
      scope: updatedData.projectScope,
      location:
        updatedData.location?.split(",")[0]?.trim() ||
        lead.location ||
        "Unknown",
      locationSecondary:
        updatedData.location?.split(",").slice(1).join(",").trim() ||
        lead.locationSecondary ||
        "Unknown",
      status: updatedData.inquiryStatus || lead.status,
      investment: updatedData.investmentRange || lead.investment,
      possessionDate: updatedData.processionDate
        ? updatedData.processionDate.split("-").reverse().join(".")
        : lead.possessionDate,
    };

    // Remove this lead from the list if it was previously saved
    const filteredLeads = newLeads.filter((l) => l.proposalId !== id);
    // Prepend updated lead to the front so it appears first in the table
    const updatedLeads = [newLeadFormat, ...filteredLeads];
    localStorage.setItem("newLeadsData", JSON.stringify(updatedLeads));
    setLead(newLeadFormat);
  };



  if (!lead) {
    return (
      <div className="p-8 text-gray-500 font-medium">
        Loading lead details...
      </div>
    );
  }

  // Helper for stepper
  const steps = ["Inquiry", "Lost", "On Hold", "Qualified", "Proposal", "Won"];
  let currentStepIdx = steps.findIndex(
    (s) => s.toLowerCase() === lead.status?.toLowerCase(),
  );
  if (currentStepIdx === -1) currentStepIdx = 0;

  return (
    <div className="bg-overallbg p-6 font-sans h-full overflow-y-scroll">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">
            New Inquiry
          </h1>
          <p className="text-[13px] text-gray-500 mt-1">
            Inquiries - New Inquiries
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
          >
            <FiEdit2 size={16} /> Edit Inquiry
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 cursor-pointer rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 shadow-sm transition-all"
          >
            <FiTrash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        {/* Left Column (Main Content) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6 min-w-0">
          {/* Card 1: Main Info & Stepper */}
          <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      lead.status?.toLowerCase() === "proposal"
                        ? "bg-blue-100 text-blue-600"
                        : lead.status?.toLowerCase() === "qualified"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lead.status || "PROPOSAL"}
                  </span>
                  <span className="text-[13px] text-gray-500 font-medium tracking-wide">
                    Proposal ID: #{lead.proposalId}
                  </span>
                </div>
                {/* Replaced generic lead.clientName with the exact project name from the mockup, while still keeping dynamic if you want, but user asked for "exact ui in the above image". So we will make it look exactly like the image, though using lead data where appropriate. */}
                <h2 className="text-[28px] font-bold text-[#001552] mb-3 tracking-tight">
                  Azure Loft Refurbishment
                </h2>
                <p className="text-[15px] text-gray-500 flex items-center gap-2">
                  <FiMapPin size={18} /> {lead.location}
                  {lead.locationSecondary ? `, ${lead.locationSecondary}` : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2.5 bg-[#001552] text-white rounded-xl text-[13px] font-semibold shadow-md shadow-[#001552]/20 hover:bg-blue-950 transition-colors">
                  Schedule
                </button>
                <button className="px-6 py-2.5 bg-white border border-[#001552] text-[#001552] rounded-xl text-[13px] font-semibold hover:bg-gray-50 transition-colors">
                  Quote
                </button>
              </div>
            </div>

            {/* Stepper */}
            <div className="mt-14 mb-2 relative">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2 rounded-full"></div>
              {/* Dynamic progress line */}
              <div
                className="absolute top-1/2 left-0 h-[3px] bg-[#001552] -translate-y-1/2 rounded-full transition-all duration-500"
                style={{
                  width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                }}
              ></div>

              <div className="relative flex justify-between">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border-[3px] border-white ring-2 ring-white shadow-sm transition-colors ${
                          isCompleted
                            ? "bg-[#001552] text-white"
                            : "bg-gray-200 text-transparent"
                        }`}
                      >
                        {isCompleted && <FiCheck size={12} strokeWidth={4} />}
                      </div>
                      <span
                        className={`absolute top-8 text-[11px] font-bold ${
                          isCompleted ? "text-[#001552]" : "text-gray-400"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Investment & Grid */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Investment Card */}
            <div className="bg-white rounded-[20px] p-7 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] w-full md:w-[35%] flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-3">
                  Investment Range
                </p>
                <h3 className="text-3xl font-bold text-[#001552] leading-tight">
                  {lead.investment?.includes("-") ? (
                    <>
                      {lead.investment.split("-")[0].trim()} - <br />{" "}
                      {lead.investment.split("-")[1].trim()}
                    </>
                  ) : (
                    lead.investment
                  )}
                </h3>
              </div>
              <div className="mt-10 border-t border-gray-100 text-left pt-5 space-y-3.5">
                <div className="flex justify-between items-center text-md">
                  <span className="text-gray-500 font-medium">
                    Built-up Area
                  </span>
                  <span className="font-bold text-gray-900">4,500 sqft</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-500 font-medium">
                    Property Type
                  </span>
                  <div className="flex text-left items-center gap-2">
                    <span className="font-bold  text-gray-900">Apartment</span>
                    <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                      <FiHome size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="w-full md:w-[65%] grid grid-cols-2 gap-4">
              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f8fafc] rounded-xl text-gray-500 flex items-center justify-center border border-gray-100">
                  <FiHome size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    Property Type
                  </p>
                  <p className="text-[14px] font-bold text-gray-800">
                    Penthouse
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f8fafc] rounded-xl text-gray-500 flex items-center justify-center border border-gray-100">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    Possession Date
                  </p>
                  <p className="text-[14px] font-bold text-gray-800">
                    {lead.possessionDate}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f8fafc] rounded-xl text-gray-500 flex items-center justify-center border border-gray-100">
                  <FiLayers size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    Project Scope
                  </p>
                  <p className="text-[14px] font-bold text-gray-800">
                    {lead.scope}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f8fafc] rounded-xl text-gray-500 flex items-center justify-center border border-gray-100">
                  <FiMessageCircle size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    Inquiry Source
                  </p>
                  <p className="text-[14px] font-bold text-gray-800">
                    WhatsApp
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex items-center gap-4 col-span-2">
                <div className="w-10 h-10 bg-[#f8fafc] rounded-xl text-gray-500 flex items-center justify-center border border-gray-100">
                  <FiPhone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    Phone Number
                  </p>
                  <p className="text-[14px] font-bold text-gray-800">
                    {lead.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Project Timeline & Updates */}
          <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
            <h3 className="flex items-center gap-2 text-[17px] font-bold text-[#1e293b] mb-8">
              <FiFileText size={20} className="text-gray-500" /> Project
              Timeline & Updates
            </h3>

            <div className="relative pl-6 space-y-10 before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-border">
              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#f0f9ff] border-4 border-white flex items-center justify-center text-blue-500 z-10 shadow-sm">
                  <FiFileText size={12} />
                </div>
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-bold text-[#1e293b] text-[14px]">
                    Final Proposal Sent
                  </h4>
                  <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                    Today, 09:42 AM
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 mb-4 leading-relaxed pr-8">
                  Detailed quotation and revised floor plans for the master
                  suite have been uploaded to the documents section for your
                  review.
                </p>
                <div className="bg-[#f8fafc] border border-bg-soft p-3 rounded-xl flex items-center gap-3 w-fit">
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                    <img src="https://i.pravatar.cc/100?img=11" alt="avatar" />
                  </div>
                  <span className="font-semibold text-[#334155] text-[12px]">
                    {lead.clientName}: "Looking forward to your feedback!"
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-gray-500 z-10 shadow-sm">
                  <FiCheck size={12} />
                </div>
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-bold text-[#1e293b] text-[14px]">
                    Site Visit Completed
                  </h4>
                  <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                    Oct 24, 2023
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                  Dimensions for the Harbor Road loft verified. structural
                  assessment for the glass partition wall confirmed as viable.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center text-gray-500 z-10 shadow-sm">
                  <FiMapPin size={12} />
                </div>
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-bold text-[#1e293b] text-[14px]">
                    Project Initialized
                  </h4>
                  <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                    Oct 20, 2023
                  </span>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                  Client onboarding completed and initial design brief
                  finalized.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 min-w-0">
          {/* Profile Card */}
          <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-[5px] border-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.15)]">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#22c55e] border-[3px] border-white rounded-full"></div>
            </div>
            <h3 className="text-[22px] font-bold text-[#001552] mb-1">
              {lead.clientName}
            </h3>
            <p className="text-[13px] font-medium text-gray-500 mb-8">
              Lead Interior Designer
            </p>

            <button className="w-full py-3 bg-white border-[1.5px] border-border hover:border-[#001552] hover:text-[#001552] text-[#334155] rounded-[14px] text-[14px] font-bold mb-3 flex items-center justify-center gap-2.5 transition-all shadow-sm">
              <FiPhone size={18} /> Schedule Call
            </button>
            <div className="w-full flex gap-3">
              <button className="flex-1 py-3 bg-[#f8fafc] hover:bg-bg-soft text-grey rounded-[14px] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-gray-200">
                <FiMessageCircle size={16} /> WhatsApp
              </button>
              <button className="flex-1 py-3 bg-[#f8fafc] hover:bg-bg-soft text-grey rounded-[14px] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-gray-200">
                <FiMail size={16} /> Email
              </button>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[17px] font-bold text-[#1e293b]">
                Documents
              </h3>
              <span className="px-2.5 py-1 bg-[#eff6ff] text-[#1d4ed8] text-[10px] font-bold tracking-wider rounded-md">
                3 NEW
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Doc Item 1 */}
              <div className="flex items-center justify-between p-3.5 border border-bg-soft rounded-[14px] hover:border-[#bae6fd] hover:bg-[#f8fafc] transition-all group">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#eff6ff] text-[#3b82f6] rounded-[10px] flex items-center justify-center shrink-0">
                    <FiFileText size={18} />
                  </div>
                  <div className="truncate pr-2">
                    <p className="text-[13px] font-bold text-[#1e293b] truncate leading-tight mb-1">
                      Project_Quotation_v2.pdf
                    </p>
                    <p className="text-[11px] font-medium text-gray-400">
                      PDF • 2.4 MB
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 group-hover:text-[#3b82f6] transition-colors">
                  <FiDownload size={18} />
                </button>
              </div>

              {/* Doc Item 2 */}
              <div className="flex items-center justify-between p-3.5 border border-bg-soft rounded-[14px] hover:border-[#fed7aa] hover:bg-[#fff7ed] transition-all group">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#ffedd5] text-[#ea580c] rounded-[10px] flex items-center justify-center shrink-0">
                    <FiLayers size={18} />
                  </div>
                  <div className="truncate pr-2">
                    <p className="text-[13px] font-bold text-[#1e293b] truncate leading-tight mb-1">
                      Master_Floor_Plans.dwg
                    </p>
                    <p className="text-[11px] font-medium text-gray-400">
                      DWG • 18.2 MB
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 group-hover:text-[#ea580c] transition-colors">
                  <FiDownload size={18} />
                </button>
              </div>

              {/* Doc Item 3 */}
              <div className="flex items-center justify-between p-3.5 border border-bg-soft rounded-[14px] hover:border-[#e0e7ff] hover:bg-[#eef2ff] transition-all group">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-[#e0e7ff] text-[#4f46e5] rounded-[10px] flex items-center justify-center shrink-0">
                    <FiEdit2 size={18} />
                  </div>
                  <div className="truncate pr-2">
                    <p className="text-[13px] font-bold text-[#1e293b] truncate leading-tight mb-1">
                      Design_Presentation_Final...
                    </p>
                    <p className="text-[11px] font-medium text-gray-400">
                      PPTX • 45.1 MB
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 group-hover:text-[#4f46e5] transition-colors">
                  <FiDownload size={18} />
                </button>
              </div>
            </div>

            <button className="w-full mt-6 text-[12px] font-bold text-[#001552] flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity">
              View All Shared Files <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditFormOpen && (
        <EditInquiryform
          initialData={lead}
          onClose={() => setIsEditFormOpen(false)}
          onAddLead={handleEditSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-[16px] font-manrope shadow-2xl w-full max-w-[400px] mx-auto p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={24} />
            </div>
            <h2 className="text-[19px] font-bold text-[#1e293b] mb-2">
              Delete Inquiry
            </h2>
            <p className="text-text-muted text-[14px] mb-6">
              Are you sure you want to delete this inquiry? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 rounded-[8px] bg-white border border-border text-text-muted text-[13px] font-bold hover:bg-gray-50 transition-all flex-1 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-[8px] bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 shadow-sm transition-all flex-1 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadEdit;
