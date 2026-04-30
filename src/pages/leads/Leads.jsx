import { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { TableData } from "../../data/TableData";
import NewInquiriesform from "./NewInquiriesform";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
// import ProjectCaliberView from "./ProjectCaliberView"; ← your other file

// ─── Tab config ────────────────────────────────────────────────────────────────
// When real APIs are ready replace each value with the endpoint URL:
//   "0-0": "/api/leads/new-inquiries"
//   "0-1": "/api/leads/nurturing"
//   "0-2": "/api/leads/dropped"
//   "1-0": "/api/project-caliber/active"  ...etc
const MAIN_TABS = ["Inquiries", "Project Caliber"];

const SUB_TABS = { 
  0: ["New Inquiries", "Nurturing Inquiries", "Dropped Inquiries"],
  1: ["Tab A", "Tab B", "Tab C"], // replace with real Project Caliber sub-tabs
};

// ─── Mock fetch (delete this when real API is wired up) ───────────────────────
const MOCK_STATUSES = {
  "0-0": ["Proposal"],
  "0-1": ["Qualified"],
  "0-2": ["On Hold", "Pending"],
};

async function fetchTabData(mainTab, subTab) {
  // ── Real API call goes here ──────────────────────────────────────────────────
  // const res = await fetch(`/api/leads?main=${mainTab}&sub=${subTab}`);
  // if (!res.ok) throw new Error(res.statusText);
  // return res.json();
  // ────────────────────────────────────────────────────────────────────────────

  // Mock: filter static data by tab
  const statuses = MOCK_STATUSES[`${mainTab}-${subTab}`] ?? [];
  return TableData
    .filter((item) =>
      statuses.some((s) => item.status?.toLowerCase() === s.toLowerCase()),
    )
    .map((item, i) => ({ ...item, sno: String(i + 1).padStart(2, "0") }));
}
// ─────────────────────────────────────────────────────────────────────────────

const Leads = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchTabData(activeMainTab, activeSubTab);
        if (!controller.signal.aborted) setData(result);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [activeMainTab, activeSubTab]);

  // When a new lead is added, POST to API then re-fetch the current tab
  const handleAddLead = async (formData) => {
    const newLead = {
      proposalId: `BL-2024-${Date.now()}`,
      clientName: formData.fullName,
      phone: formData.phoneNumber,
      scope: formData.projectScope,
      location: formData.location?.split(",")[0]?.trim() || "Unknown",
      locationSecondary: formData.location?.split(",").slice(1).join(",").trim() || "Unknown",
      status: formData.inquiryStatus || "Proposal",
      investment: formData.investmentRange,
      possessionDate: formData.processionDate
        ? formData.processionDate.split("-").reverse().join(".")
        : "01.01.2025",
    };

    // Real API: await fetch("/api/leads", { method: "POST", body: JSON.stringify(newLead) });
    // Mock: write to localStorage, then reload tab data
    const saved = JSON.parse(localStorage.getItem("newLeadsData") || "[]");
    localStorage.setItem("newLeadsData", JSON.stringify([newLead, ...saved]));

    const result = await fetchTabData(activeMainTab, activeSubTab);
    setData(result);
  };

  const columns = [
    { key: "sno", label: "Sno" },
    { key: "proposalId", label: "Proposal ID" },
    { key: "clientName", label: "Client Name" },
    { key: "phone", label: "Phone" },
    { key: "scope", label: "Scope" },
    {
      key: "location",
      label: "Location",
      render: (_, item) => (
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-[15px]">{item.location}</span>
          <span className="text-select-blue text-[10px] leading-tight mt-0.5">
            {item.locationSecondary}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (_, item) => (
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase ${
            item.status?.toLowerCase() === "proposal"
              ? "bg-[#e0f0ff] text-[#3b82f6]"
              : item.status?.toLowerCase() === "qualified"
                ? "bg-[#dcfce7] text-[#16a34a]"
                : item.status?.toLowerCase() === "on hold" ||
                    item.status?.toLowerCase() === "pending"
                  ? "bg-[#fee2e2] text-[#ef4444]"
                  : "bg-gray-100 text-gray-500"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    { key: "investment", label: "Investment" },
    { key: "possessionDate", label: "Possession Date" },
  ];

  const isInquiries = activeMainTab === 0;

  const subtitle = isInquiries
    ? `${MAIN_TABS[0]} - ${SUB_TABS[0][activeSubTab]}`
    : `${MAIN_TABS[activeMainTab]}`;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Table
        title="Leads"
        subtitle={subtitle}
        mainTabs={MAIN_TABS}
        onMainTabChange={(idx) => { setActiveMainTab(idx); setActiveSubTab(0); }}
        actions={
          isInquiries && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-linear-to-r from-[#1E3A8A] to-[#001552] text-white rounded-lg px-10 py-2.5 text-sm font-medium"
            >
              <FiPlusCircle />
              Add Inquiry
            </button>
          )
        }
        columns={isInquiries ? columns : []}
        data={isInquiries ? data : []}
        emptyMessage={
          isInquiries
            ? loading ? "Loading..." : "No records found."
            : "Project Caliber view — replace this with your component"
        }
        rowsPerPage={8}
        onRowClick={isInquiries ? (item) => navigate(`/leads/${item.proposalId}`) : undefined}
        activeRowKey="proposalId"
        subTabs={isInquiries ? SUB_TABS[0] : undefined}
        onSubTabChange={setActiveSubTab}
        sortFields={isInquiries ? [
          { key: "proposalId", label: "Proposal ID" },
          { key: "clientName", label: "Client Name" },
          { key: "investment", label: "Investment" },
          { key: "possessionDate", label: "Possession Date" },
        ] : undefined}
        filterFields={isInquiries ? [
          { key: "status", label: "Status", options: ["Proposal", "Qualified", "Pending", "On Hold"] },
          { key: "scope", label: "Scope", options: ["Interior", "Architecture"] },
        ] : undefined}
        dateRangeField={isInquiries ? {
          key: "possessionDate",
          parse: (value) => {
            const parts = value?.split(".");
            if (parts?.length === 3)
              return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            return null;
          },
        } : undefined}
        exportConfig={isInquiries ? {
          filename: "leads_export",
          columns: [
            { label: "Sno", key: "sno" },
            { label: "Proposal ID", key: "proposalId" },
            { label: "Client Name", key: "clientName" },
            { label: "Phone", key: "phone" },
            { label: "Scope", key: "scope" },
            { label: "Location", render: (item) => `${item.location} - ${item.locationSecondary}` },
            { label: "Status", key: "status" },
            { label: "Investment", key: "investment" },
            { label: "Possession Date", key: "possessionDate" },
          ],
        } : undefined}
      />

      {showForm && (
        <NewInquiriesform
          onClose={() => setShowForm(false)}
          onAddLead={handleAddLead}
        />
      )}
    </div>
  );
};

export default Leads;
