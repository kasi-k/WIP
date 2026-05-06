import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TableData } from "../../data/TableData";
import { ClientTableData } from "../../data/ClientTableData";
import avatar from "../../assets/images/avatar.png";
import EditInquiryform from "./EditInquiryform";
import ConvertToClientForm from "./ConvertToClientForm";
import NegotiationModal from "../projects/NegotiationModal";
import LogActivityModal from "../projects/LogActivityModal";
import { PAYMENT_MILESTONES } from "../../data/MilestoneConfig";
import {
  PIPELINE_STEPS,
  LOST_REASONS,
  getBadgeClass,
  getStepIndex,
  isPipelineStep,
  getActivity,
  appendActivity,
} from "../../data/LeadStatusConfig";
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
  FiArrowLeft,
  FiUserCheck,
  FiSend,
  FiPause,
  FiPlay,
  FiXCircle,
  FiTrendingUp,
  FiAward,
  FiPaperclip,
  FiX,
  FiEdit3,
} from "react-icons/fi";

const LostReasonModal = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const canSubmit = reason.trim().length > 0;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-[16px] font-manrope shadow-2xl w-full max-w-[460px] mx-auto p-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <FiXCircle size={22} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[#1e293b]">
              Mark Inquiry as Lost
            </h2>
            <p className="text-[12px] text-text-muted mt-0.5">
              Capture the reason — this feeds win/loss reporting.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[12px] font-semibold text-text mb-2">
            Reason <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LOST_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${
                  reason === r
                    ? "bg-active-bg border-select-blue text-select-blue"
                    : "bg-white border-border text-text-muted hover:bg-bg-soft"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[12px] font-semibold text-text mb-2">
            Notes (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Anything useful for future re-engagement…"
            className="w-full rounded-lg border border-border px-3 py-2 text-[13px] text-text placeholder:text-text-subtle focus:outline-none focus:border-select-blue resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-border text-[13px] font-semibold text-text-muted hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason, note)}
            disabled={!canSubmit}
            className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark Lost
          </button>
        </div>
      </div>
    </div>
  );
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024; // standard email cap

const EmailProposalModal = ({ lead, isResend, onClose, onSend }) => {
  const [to, setTo] = useState(lead?.email || "");
  const [subject, setSubject] = useState(
    `${isResend ? "Revised proposal" : "Proposal"} for your project — ${lead?.proposalId || ""}`,
  );
  const [body, setBody] = useState(
    `Hi ${lead?.clientName || ""},\n\nPlease find the attached ${isResend ? "revised " : ""}proposal for your project. We've covered scope, timeline and investment.\n\nLet us know your thoughts at your convenience.\n\nBest regards,\nDigital Atelier`,
  );
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const canSend =
    to.trim() && subject.trim() && body.trim() && totalBytes <= MAX_ATTACHMENT_BYTES;

  const handleFiles = (incoming) => {
    setError("");
    const list = Array.from(incoming || []);
    const next = [...files];
    list.forEach((f) => {
      if (!next.find((x) => x.name === f.name && x.size === f.size)) next.push(f);
    });
    const newTotal = next.reduce((s, f) => s + f.size, 0);
    if (newTotal > MAX_ATTACHMENT_BYTES) {
      setError(`Total attachment size exceeds 25 MB (currently ${formatBytes(newTotal)})`);
    }
    setFiles(next);
  };

  const removeFile = (idx) => {
    setError("");
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async () => {
    setSending(true);
    // Hook real email API here. For mock, we record attachment metadata only.
    await new Promise((r) => setTimeout(r, 400));
    const attachments = files.map((f) => ({ name: f.name, size: f.size, type: f.type }));
    onSend({ to, subject, body, attachments });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-[16px] font-manrope shadow-2xl w-full max-w-[560px] mx-auto p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FiSend size={22} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[#1e293b]">
              {isResend ? "Resend Proposal" : "Send Proposal"}
            </h2>
            <p className="text-[12px] text-text-muted mt-0.5">
              {isResend
                ? "Send a revised proposal. Stage stays unchanged."
                : "Email the proposal to the client. The lead will move to the Proposal stage."}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-[12px] font-semibold text-text mb-1.5">
              To
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-[13px] text-text focus:outline-none focus:border-select-blue"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-text mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-[13px] text-text focus:outline-none focus:border-select-blue"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-text mb-1.5">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-border px-3 py-2 text-[13px] text-text focus:outline-none focus:border-select-blue resize-none"
            />
          </div>

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12px] font-semibold text-text">
                Attachments
              </label>
              <span className="text-[11px] text-text-subtle">
                {files.length > 0
                  ? `${files.length} file${files.length > 1 ? "s" : ""} • ${formatBytes(totalBytes)}`
                  : "Max 25 MB total"}
              </span>
            </div>

            <label
              htmlFor="proposal-attachments"
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-border rounded-lg text-[13px] font-medium text-text-muted hover:border-select-blue hover:text-select-blue hover:bg-bg-soft transition-all cursor-pointer"
            >
              <FiPaperclip size={16} />
              Click to upload (PDF, DOCX, images, ZIP)
            </label>
            <input
              id="proposal-attachments"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.zip,.dwg"
            />

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, idx) => (
                  <div
                    key={`${f.name}-${idx}`}
                    className="flex items-center justify-between p-2.5 border border-border rounded-lg bg-bg-soft"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FiFileText size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-[#1e293b] truncate">
                          {f.name}
                        </p>
                        <p className="text-[10px] text-text-subtle">
                          {formatBytes(f.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-gray-400 hover:text-red-500 shrink-0 ml-2"
                      aria-label="Remove attachment"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-red-500 text-[11px] mt-2">{error}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-5 py-2.5 rounded-lg border border-border text-[13px] font-semibold text-text-muted hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend || sending}
            className="px-5 py-2.5 rounded-lg bg-select-blue text-white text-[13px] font-semibold hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiSend size={14} /> {sending ? "Sending…" : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Maps an activity log entry to its visual treatment in the timeline card.
const activityMeta = (entry) => {
  if (entry.type === "email") {
    const count = entry.attachments?.length || 0;
    const totalBytes =
      entry.attachments?.reduce((s, a) => s + (a.size || 0), 0) || 0;
    const attachLine =
      count > 0
        ? ` • ${count} attachment${count > 1 ? "s" : ""} (${formatBytes(totalBytes)})`
        : "";
    return {
      title: `Proposal emailed to ${entry.to}`,
      body: `${entry.subject ? `Subject: ${entry.subject}` : ""}${attachLine}`,
      icon: <FiSend size={12} />,
      bg: "bg-[#f0f9ff]",
      iconColor: "text-blue-500",
    };
  }
  if (entry.type === "call") {
    return {
      title: `${entry.direction === "inbound" ? "Inbound" : "Outbound"} call${entry.duration ? ` • ${entry.duration} min` : ""}`,
      body: entry.notes || "",
      icon: <FiPhone size={12} />,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    };
  }
  if (entry.type === "note") {
    return {
      title: "Note added",
      body: entry.text,
      icon: <FiEdit3 size={12} />,
      bg: "bg-gray-100",
      iconColor: "text-gray-600",
    };
  }
  if (entry.type === "negotiation") {
    return {
      title: "Moved to Negotiation",
      body: [
        entry.note ? `Blocker: ${entry.note}` : "",
        entry.expectedClose ? `Expected close: ${entry.expectedClose}` : "",
      ]
        .filter(Boolean)
        .join(" • "),
      icon: <FiTrendingUp size={12} />,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    };
  }
  if (entry.type === "milestone") {
    return {
      title: `Milestone ${entry.action}: ${entry.milestoneName}`,
      body: "",
      icon: <FiAward size={12} />,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    };
  }
  // status transition
  const to = entry.to?.toLowerCase();
  const map = {
    qualified: { icon: <FiCheck size={12} />, bg: "bg-green-50", iconColor: "text-green-600" },
    proposal: { icon: <FiFileText size={12} />, bg: "bg-blue-50", iconColor: "text-blue-600" },
    negotiation: { icon: <FiTrendingUp size={12} />, bg: "bg-amber-50", iconColor: "text-amber-600" },
    won: { icon: <FiAward size={12} />, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
    converted: { icon: <FiUserCheck size={12} />, bg: "bg-teal-50", iconColor: "text-teal-600" },
    "on hold": { icon: <FiPause size={12} />, bg: "bg-gray-100", iconColor: "text-gray-500" },
    lost: { icon: <FiXCircle size={12} />, bg: "bg-red-50", iconColor: "text-red-600" },
  };
  const styling = map[to] || { icon: <FiCheck size={12} />, bg: "bg-gray-100", iconColor: "text-gray-500" };
  const body =
    entry.to === "Lost" && entry.lostReason
      ? `Reason: ${entry.lostReason}${entry.lostNote ? ` — ${entry.lostNote}` : ""}`
      : `Status moved from ${entry.from || "—"} to ${entry.to}`;
  return {
    title: `Marked as ${entry.to}`,
    body,
    ...styling,
  };
};

const formatActivityTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today, ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
};

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
   
    const allLeads = [...newLeads, ...TableData];
    return allLeads.find((item) => item.proposalId === id) || null;
  });
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConvertForm, setShowConvertForm] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logTab, setLogTab] = useState("call");
  const [activity, setActivity] = useState(() => (id ? getActivity(id) : []));

  // Persist a status transition: write to localStorage, append activity entry,
  // re-render, and notify the leads list so its counts/tabs stay in sync.
  const transitionStatus = (nextStatus, extra = {}) => {
    if (!lead) return;
    const saved = localStorage.getItem("newLeadsData");
    const newLeads = saved ? JSON.parse(saved) : [];
    const updated = { ...lead, status: nextStatus, ...extra };
    const filtered = newLeads.filter((l) => l.proposalId !== lead.proposalId);
    localStorage.setItem(
      "newLeadsData",
      JSON.stringify([updated, ...filtered]),
    );
    setLead(updated);
    setActivity(
      appendActivity(lead.proposalId, {
        type: "status",
        from: lead.status,
        to: nextStatus,
        ...extra,
      }),
    );
    window.dispatchEvent(new Event("leadDataChanged"));
  };

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
      email: updatedData.email,
      scope: updatedData.projectScope,
      location: updatedData.location?.trim() || lead.location || "",
      locationSecondary: lead.locationSecondary || "",
      propertyType: updatedData.propertyType || lead.propertyType || "",
      status: updatedData.inquiryStatus || lead.status,
      investment: updatedData.investmentRange || lead.investment,
      buildUpArea: updatedData.buildUpArea || lead.buildUpArea,
      inquirySource: updatedData.inquirySource || lead.inquirySource,
      possessionDate: updatedData.processionDate
        ? updatedData.processionDate.split("-").reverse().join(".")
        : lead.possessionDate,
    };

    const filteredLeads = newLeads.filter((l) => l.proposalId !== id);
    const updatedLeads = [newLeadFormat, ...filteredLeads];
    localStorage.setItem("newLeadsData", JSON.stringify(updatedLeads));
    setLead(newLeadFormat);
  };
  const handleConvert = async (formData, numericValue) => {
    await new Promise((r) => setTimeout(r, 700));

    const savedClients = localStorage.getItem("newClientsData");
    const newClients = savedClients ? JSON.parse(savedClients) : [];

    const maxStaticId = ClientTableData.reduce((max, c) => {
      const n = parseInt(c.clientID.split("-").pop(), 10);
      return n > max ? n : max;
    }, 0);
    const nextNum = maxStaticId + newClients.length + 1;
    const clientID = `BL-2024-${String(nextNum).padStart(3, "0")}`;

    const today = new Date();
    const joinDate = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

    const budget =
      numericValue >= 10000000
        ? `₹${(numericValue / 10000000).toFixed(2)} Cr`
        : numericValue >= 100000
          ? `₹${(numericValue / 100000).toFixed(1)}L`
          : `₹${numericValue.toLocaleString("en-IN")}`;

    const siteAddress = [
      formData.addressLine1,
      formData.addressLine2,
      [formData.city, formData.state, formData.pincode]
        .filter(Boolean)
        .join(" "),
    ]
      .filter((s) => s && s.trim())
      .join(", ");

    const newClient = {
      sno: nextNum,
      clientID,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      location: formData.location,
      locationSecondary: formData.city,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      siteAddress,
      budget,
      paymentStatus: "pending",
      joinDate,
      sourceLeadId: lead.proposalId,
      projectValue: numericValue,
    };
    localStorage.setItem(
      "newClientsData",
      JSON.stringify([newClient, ...newClients]),
    );

    const milestones = PAYMENT_MILESTONES.map((m) => {
      const base = Math.round((numericValue * m.pct) / 100);
      const gstAmt = Math.round((base * m.gst) / 100);
      return {
        ...m,
        base,
        gstAmt,
        total: base + gstAmt,
        status: "pending",
        dueDate: "",
        paidDate: "",
      };
    });
    localStorage.setItem(
      `clientMilestones_${clientID}`,
      JSON.stringify(milestones),
    );

    const savedLeads = localStorage.getItem("newLeadsData");
    let newLeads = savedLeads ? JSON.parse(savedLeads) : [];
    const convertedLead = {
      ...lead,
      status: "Converted",
      convertedClientID: clientID,
    };
    const filtered = newLeads.filter((l) => l.proposalId !== lead.proposalId);
    localStorage.setItem(
      "newLeadsData",
      JSON.stringify([convertedLead, ...filtered]),
    );
    setLead(convertedLead);
    setActivity(
      appendActivity(lead.proposalId, {
        type: "status",
        from: lead.status,
        to: "Converted",
        clientID,
      }),
    );
    window.dispatchEvent(new Event("leadDataChanged"));

    return clientID;
  };

  if (!lead) {
    return (
      <div className="p-8 text-gray-500 font-medium">
        Loading lead details...
      </div>
    );
  }

  // Stepper: linear path only. "Lost" and "On Hold" are off-ramps rendered
  // as a callout below, not as steps.
  const steps = PIPELINE_STEPS;
  const onLinearPath = isPipelineStep(lead.status);
  // While off-path (Lost / On Hold) we keep the prior step highlighted up to
  // wherever the lead got — by default treat as Inquiry.
  const currentStepIdx = onLinearPath ? Math.max(getStepIndex(lead.status), 0) : 0;
  const isLost = lead.status?.toLowerCase() === "lost";
  const isOnHold = lead.status?.toLowerCase() === "on hold";

  return (
    <div className="bg-overallbg p-6 font-sans h-full overflow-y-scroll">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-border hover:bg-gray-50 hover:border-[#1E3A8A]/30 text-gray-500 hover:text-[#1E3A8A] transition-all shadow-sm cursor-pointer"
            title="Go back"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">
              New Inquiry
            </h1>
            <p className="text-[13px] text-gray-500 mt-1">
              Inquiries - New Inquiries
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
          {/* Primary progression button — depends on current status */}
          {lead.status?.toLowerCase() === "inquiry" && (
            <button
              onClick={() => transitionStatus("Qualified")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#001552] text-white cursor-pointer rounded-xl text-sm font-semibold hover:bg-blue-950 shadow-sm transition-all"
            >
              <FiCheck size={16} /> Mark Qualified
            </button>
          )}
          {lead.status?.toLowerCase() === "qualified" && (
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#001552] text-white cursor-pointer rounded-xl text-sm font-semibold hover:bg-blue-950 shadow-sm transition-all"
            >
              <FiSend size={16} /> Send Proposal
            </button>
          )}
          {lead.status?.toLowerCase() === "proposal" && (
            <>
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
              >
                <FiMail size={16} /> Resend Proposal
              </button>
              <button
                onClick={() => setShowNegotiationModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white cursor-pointer rounded-xl text-sm font-semibold hover:bg-amber-600 shadow-sm transition-all"
              >
                <FiTrendingUp size={16} /> Move to Negotiation
              </button>
            </>
          )}
          {lead.status?.toLowerCase() === "negotiation" && (
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
            >
              <FiMail size={16} /> Resend Proposal
            </button>
          )}
          {(lead.status?.toLowerCase() === "proposal" ||
            lead.status?.toLowerCase() === "negotiation") && (
            <button
              onClick={() => transitionStatus("Won")}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white cursor-pointer rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-all"
            >
              <FiAward size={16} /> Mark Won
            </button>
          )}
          {lead.status?.toLowerCase() === "won" && (
            <button
              onClick={() => setShowConvertForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#001552] text-white cursor-pointer rounded-xl text-sm font-semibold hover:bg-blue-950 shadow-sm transition-all"
            >
              <FiUserCheck size={16} /> Convert to Client
            </button>
          )}
          {lead.status?.toLowerCase() === "converted" && (
            <button
              onClick={() => navigate(`/clients/${lead.convertedClientID}`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 cursor-pointer rounded-xl text-sm font-semibold text-emerald-700 hover:bg-emerald-100 shadow-sm transition-all"
            >
              <FiUserCheck size={16} /> View Client
            </button>
          )}

          {/* Hold toggle — available while the deal is still open */}
          {!isLost &&
            lead.status?.toLowerCase() !== "won" &&
            lead.status?.toLowerCase() !== "converted" &&
            (isOnHold ? (
              <button
                onClick={() => transitionStatus("Qualified")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
              >
                <FiPlay size={16} /> Resume
              </button>
            ) : (
              <button
                onClick={() => transitionStatus("On Hold")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
              >
                <FiPause size={16} /> Put on Hold
              </button>
            ))}

          {/* Mark Lost — available until the deal is closed (won/converted) */}
          {!isLost &&
            lead.status?.toLowerCase() !== "won" &&
            lead.status?.toLowerCase() !== "converted" && (
              <button
                onClick={() => setShowLostModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 cursor-pointer rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 shadow-sm transition-all"
              >
                <FiXCircle size={16} /> Mark Lost
              </button>
            )}

          <button
            onClick={() => {
              setLogTab("call");
              setShowLogModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
          >
            <FiPhone size={16} /> Log Call
          </button>
          <button
            onClick={() => {
              setLogTab("note");
              setShowLogModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
          >
            <FiEdit3 size={16} /> Add Note
          </button>
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
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getBadgeClass(lead.status)}`}
                  >
                    {lead.status || "Inquiry"}
                  </span>
                  <span className="text-[13px] text-gray-500 font-medium tracking-wide">
                    Proposal ID: #{lead.proposalId}
                  </span>
                </div>
                {/* Replaced generic lead.clientName with the exact project name from the mockup, while still keeping dynamic if you want, but user asked for "exact ui in the above image". So we will make it look exactly like the image, though using lead data where appropriate. */}
                <h2 className="text-[28px] font-bold text-[#001552] mb-3 tracking-tight">
                  {lead.clientName}
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

            {/* Stepper — dimmed when the lead is off-path (Lost / On Hold) */}
            <div className={`mt-14 mb-2 relative ${onLinearPath ? "" : "opacity-50"}`}>
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
                  const isCompleted = onLinearPath && idx <= currentStepIdx;
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

            {/* Off-ramp callout */}
            {isLost && (
              <div className="mt-12 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <FiXCircle size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-red-700">
                    Marked as Lost
                  </p>
                  <p className="text-[12px] text-red-600 mt-0.5">
                    Reason: {lead.lostReason || "Not specified"}
                    {lead.lostNote ? ` — ${lead.lostNote}` : ""}
                  </p>
                </div>
              </div>
            )}
            {isOnHold && (
              <div className="mt-12 flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
                  <FiPause size={18} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-700">
                    Lead is On Hold
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    Resume when the client is ready to move forward.
                  </p>
                </div>
              </div>
            )}
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
                  <span className="font-bold text-gray-900">
                    {lead.buildUpArea}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-500 font-medium">
                    Property Type
                  </span>
                  <div className="flex text-left items-center gap-2">
                    <span className="font-bold  text-gray-900">
                      {lead.propertyType}
                    </span>
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
                    {lead.propertyType}
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
                    {lead.inquirySource}
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

          {/* Card 3: Activity Timeline (driven by status changes) */}
          <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
            <h3 className="flex items-center gap-2 text-[17px] font-bold text-[#1e293b] mb-8">
              <FiFileText size={20} className="text-gray-500" /> Activity
              Timeline
            </h3>

            {activity.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                  <FiFileText size={20} />
                </div>
                <p className="text-[13px] text-gray-500">
                  No activity yet. Status changes and emails will appear here.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-10 before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-border">
                {activity.map((entry, idx) => {
                  const meta = activityMeta(entry);
                  return (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full ${meta.bg} border-4 border-white flex items-center justify-center ${meta.iconColor} z-10 shadow-sm`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="font-bold text-[#1e293b] text-[14px]">
                          {meta.title}
                        </h4>
                        <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                          {formatActivityTime(entry.at)}
                        </span>
                      </div>
                      {meta.body && (
                        <p className="text-[13px] text-gray-500 leading-relaxed pr-8">
                          {meta.body}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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

      {/* Convert to Client Modal */}
      {showConvertForm && (
        <ConvertToClientForm
          lead={lead}
          onClose={() => setShowConvertForm(false)}
          onConvert={handleConvert}
        />
      )}

      {/* Edit Form Modal */}
      {isEditFormOpen && (
        <EditInquiryform
          initialData={lead}
          onClose={() => setIsEditFormOpen(false)}
          onAddLead={handleEditSave}
        />
      )}

      {/* Log Call / Add Note Modal */}
      {showLogModal && (
        <LogActivityModal
          defaultTab={logTab}
          onClose={() => setShowLogModal(false)}
          onSubmit={(entry) => {
            setActivity(appendActivity(lead.proposalId, entry));
            window.dispatchEvent(new Event("leadDataChanged"));
            setShowLogModal(false);
          }}
        />
      )}

      {/* Negotiation Modal */}
      {showNegotiationModal && (
        <NegotiationModal
          onClose={() => setShowNegotiationModal(false)}
          onConfirm={({ note, expectedClose }) => {
            const stored = JSON.parse(
              localStorage.getItem("newLeadsData") || "[]",
            );
            const updated = {
              ...lead,
              status: "Negotiation",
              negotiationNote: note,
              expectedClose,
            };
            const filtered = stored.filter(
              (l) => l.proposalId !== lead.proposalId,
            );
            localStorage.setItem(
              "newLeadsData",
              JSON.stringify([updated, ...filtered]),
            );
            setLead(updated);
            setActivity(
              appendActivity(lead.proposalId, {
                type: "negotiation",
                from: lead.status,
                note,
                expectedClose,
              }),
            );
            window.dispatchEvent(new Event("leadDataChanged"));
            setShowNegotiationModal(false);
          }}
        />
      )}

      {/* Mark as Lost Modal */}
      {showLostModal && (
        <LostReasonModal
          onClose={() => setShowLostModal(false)}
          onConfirm={(reason, note) => {
            transitionStatus("Lost", { lostReason: reason, lostNote: note });
            setShowLostModal(false);
          }}
        />
      )}

      {/* Email Proposal Modal */}
      {showEmailModal && (
        <EmailProposalModal
          lead={lead}
          isResend={
            isPipelineStep(lead.status) &&
            getStepIndex(lead.status) >= getStepIndex("Proposal")
          }
          onClose={() => setShowEmailModal(false)}
          onSend={({ to, subject, body, attachments }) => {
            // First send moves the deal to Proposal stage; subsequent sends
            // stay in whatever stage they were in (e.g. resending while
            // already in Proposal/Negotiation just logs an activity).
            const next =
              isPipelineStep(lead.status) &&
              getStepIndex(lead.status) < getStepIndex("Proposal")
                ? "Proposal"
                : lead.status;
            if (next !== lead.status) {
              transitionStatus(next);
            }
            setActivity(
              appendActivity(lead.proposalId, {
                type: "email",
                to,
                subject,
                body,
                attachments,
              }),
            );
            setShowEmailModal(false);
          }}
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
