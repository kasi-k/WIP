import React, { useState, useEffect, useRef, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { LeadsHeader } from "../../helperConfigData/helperData";
import { TableData } from "../../data/TableData";
import Pagination from "../../components/Pagination";
import DateRangePicker from "../../components/DateRangePicker";
import NewInquiriesform from "./NewInquiriesform";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";

const Leads = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filterConfig, setFilterConfig] = useState({ status: "", scope: "" });
  const [activeRow, setActiveRow] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [newLeads, setNewLeads] = useState(() => {
    const saved = localStorage.getItem("newLeadsData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse new leads data", e);
      }
    }
    return [];
  });

  const [deletedLeads, setDeletedLeads] = useState(() => {
    const saved = localStorage.getItem("deletedLeads");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem("deletedLeads");
    if (saved) {
      setDeletedLeads(JSON.parse(saved));
    }
  }, []);

  const tableData = useMemo(() => {
    const baseData = [...TableData];
    const trulyNew = [];

    newLeads.forEach((newLead) => {
      const existingIndex = baseData.findIndex(
        (l) => l.proposalId === newLead.proposalId
      );
      if (existingIndex >= 0) {
        baseData[existingIndex] = newLead;
      } else {
        trulyNew.push(newLead);
      }
    });

   
    const mergedData = [...trulyNew.reverse(), ...baseData];

    return mergedData
      .filter((item) => !deletedLeads.includes(item.proposalId))
      .map((item, index) => ({
        ...item,
        sno: String(index + 1).padStart(2, "0"),
      }));
  }, [newLeads, deletedLeads]);

  const handleAddLead = (newLeadData) => {
    const newIdNum = tableData.length + 1;
    const proposalId = `BL-2024-${newIdNum.toString().padStart(3, "0")}`;

    const newLead = {
      sno: newIdNum,
      proposalId,
      clientName: newLeadData.fullName,
      phone: newLeadData.phoneNumber,
      scope: newLeadData.projectScope,
      location: newLeadData.location?.split(",")[0]?.trim() || "Unknown",
      locationSecondary:
        newLeadData.location?.split(",").slice(1).join(",").trim() || "Unknown",
      status: newLeadData.inquiryStatus || "Proposal",
      investment: newLeadData.investmentRange,
      possessionDate: newLeadData.processionDate
        ? newLeadData.processionDate.split("-").reverse().join(".")
        : "01.01.2025",
    };

    // Prepend so index 0 is always the newest lead
    const updatedNewLeads = [newLead, ...newLeads];
    setNewLeads(updatedNewLeads);
    localStorage.setItem("newLeadsData", JSON.stringify(updatedNewLeads));
    setCurrentPage(1);
  };

  const filteredData = tableData.filter((item) => {
    let matches = true;

    if (
      filterConfig.status &&
      item.status?.toLowerCase() !== filterConfig.status.toLowerCase()
    ) {
      matches = false;
    }
    if (
      filterConfig.scope &&
      item.scope?.toLowerCase() !== filterConfig.scope.toLowerCase()
    ) {
      matches = false;
    }
    if (dateRange.start || dateRange.end) {
      const dateParts = item.possessionDate.split(".");
      if (dateParts.length === 3) {
        const entryDate = new Date(
          `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
        );
        if (dateRange.start && entryDate < new Date(dateRange.start))
          matches = false;
        if (dateRange.end && entryDate > new Date(dateRange.end))
          matches = false;
      }
    }
    return matches;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const currentTableData = sortedData.slice(
    (safeCurrentPage - 1) * rowsPerPage,
    safeCurrentPage * rowsPerPage
  );

  const handleExport = () => {
    if (sortedData.length === 0) return;
    const headers = [
      "Sno",
      "Proposal ID",
      "Client Name",
      "Phone",
      "Scope",
      "Location",
      "Status",
      "Investment",
      "Possession Date",
    ];
    const csvRows = [headers.join(",")];

    sortedData.forEach((item) => {
      const row = [
        item.sno,
        item.proposalId,
        item.clientName,
        item.phone,
        item.scope,
        `"${item.location} - ${item.locationSecondary}"`,
        item.status,
        `"${item.investment}"`,
        item.possessionDate,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHeaderClick = (name) => {
    if (name === "Export") {
      handleExport();
      setActiveDropdown(null);
    } else {
      setActiveDropdown(activeDropdown === name ? null : name);
    }
  };

  const handleSortChange = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const mainTabs = ["Inquiries", "Project Caliber"];
  const subTabs = ["New Inquiries", "Nurturing Inquiries", "Dropped Inquiries"];

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
          <span className="text-[#1e3a8a] text-[10px] leading-tight mt-0.5">
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
    { key: "possessionDate", label: "Posession Date" },
  ];

  return (
    <>
      <div className="bg-[#f4f4f4] min-h-screen flex flex-col">
        {activeDropdown === "Date Range" && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] transition-all duration-300" />
        )}
        <div className="flex justify-between mb-2 p-1.5">
          <span>
            <h3 className="text-primary text-3xl font-semibold">New Inquiry</h3>
            <p className="text-[#64748B] text-xs">Inquiries - New Inquiries</p>
          </span>
          <button
            className="flex items-center gap-2 bg-linear-to-r from-[#1E3A8A] to-[#001552] text-white rounded-lg w-50 justify-center"
            onClick={() => setShowForm(true)}
          >
            <span>
              <FiPlusCircle />
            </span>
            Add Inquiry
          </button>
        </div>
        <div>
          <div className="flex justify-between items-start pt-2 px-2">
            <div className="flex flex-col items-start w-max filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.03)] z-10 transition-all">
              <div className="flex gap-7 items-end pl-2 relative z-20">
                {mainTabs.map((tab, idx) => {
                  const isActive = activeMainTab === idx;
                  const isFirst = idx === 0;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveMainTab(idx)}
                      className={`relative cursor-pointer flex items-center h-[42px] z-${
                        isActive ? "20" : "10"
                      } ${!isFirst ? "-ml-4" : ""}`}
                    >
                      <div
                        className={`relative flex items-center px-6 h-full rounded-tl-[16px] transition-colors duration-200 z-20 ${
                          isActive
                            ? "bg-white text-[#001552] font-semibold text-[15px]"
                            : "bg-[#e5e7eb] text-[#9ca3af] font-medium group-hover:bg-[#d1d5db]"
                        }`}
                      >
                        <span className="relative z-30 tracking-wide">
                          {tab}
                        </span>
                      </div>
                      <div
                        className={`absolute top-0 -right-[16px] w-[34px] h-full transform skew-x-[22deg] rounded-tr-[12px] transition-colors duration-200 z-10 ${
                          isActive
                            ? "bg-white"
                            : "bg-[#e5e7eb] group-hover:bg-[#d1d5db]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="relative z-10 flex bg-white w-max items-center pr-8 ml-2 rounded-bl-[16px] -mt-[1px]">
                <div className="flex gap-8 px-6 pt-3 pb-0 relative z-30">
                  {subTabs.map((tab, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`pb-3 pt-1 text-[15px] transition-all relative whitespace-nowrap ${
                        activeTab === i
                          ? "text-[#001552] font-semibold"
                          : "text-[#9ca3af] hover:text-[#001552]"
                      }`}
                    >
                      {tab}
                      {activeTab === i && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#001552] rounded-t-lg" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="absolute top-0 -right-[22px] w-[50px] h-full bg-white transform skew-x-[22deg] rounded-tr-[16px] rounded-br-[16px] z-10" />
              </div>
            </div>

            <div className="flex gap-4 pt-2" ref={dropdownRef}>
              {LeadsHeader.map((item, idx) => {
                return (
                  <div key={idx} className="relative">
                    <button
                      onClick={() => handleHeaderClick(item.name)}
                      className={`p-2 text-[#7b7b7b] bg-white rounded-md shadow-sm border transition-colors ${
                        activeDropdown === item.name
                          ? "border-[#1e3a8a] bg-blue-50"
                          : "border-[#dfdfdf] hover:bg-gray-50"
                      }`}
                      title={item.name}
                    >
                      <span>{item.icon}</span>
                    </button>

                    {activeDropdown === item.name &&
                      item.name === "Date Range" && (
                        <DateRangePicker
                          initialStart={dateRange.start}
                          initialEnd={dateRange.end}
                          onApply={(range) => {
                            setDateRange(range);
                            setActiveDropdown(null);
                          }}
                          onClose={() => setActiveDropdown(null)}
                        />
                      )}

                    {activeDropdown === item.name && item.name === "Sort" && (
                      <div className="absolute right-0 mt-2 p-3 bg-white border border-gray-200 shadow-lg rounded-lg w-48 z-50">
                        <h4 className="text-sm font-semibold mb-2">Sort By</h4>
                        <div className="flex flex-col gap-1 text-sm">
                          {[
                            "proposalId",
                            "clientName",
                            "investment",
                            "possessionDate",
                          ].map((key) => (
                            <button
                              key={key}
                              onClick={() => handleSortChange(key)}
                              className={`text-left px-2 py-1.5 rounded hover:bg-gray-100 flex justify-between ${
                                sortConfig.key === key
                                  ? "bg-blue-50 text-[#1e3a8a] font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              <span className="capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              {sortConfig.key === key && (
                                <span>
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              setSortConfig({ key: "", direction: "asc" });
                              setActiveDropdown(null);
                            }}
                            className="mt-2 text-xs text-red-500 hover:underline text-left px-2 w-max"
                          >
                            Clear sort
                          </button>
                        </div>
                      </div>
                    )}

                    {activeDropdown === item.name && item.name === "Filter" && (
                      <div className="absolute right-0 mt-2 p-4 bg-white border border-gray-200 shadow-lg rounded-lg w-56 z-50">
                        <h4 className="text-sm font-semibold mb-3">
                          Filter Options
                        </h4>
                        <div className="flex flex-col gap-3 text-sm">
                          <div>
                            <label className="block text-gray-500 mb-1">
                              Status
                            </label>
                            <select
                              value={filterConfig.status}
                              onChange={(e) =>
                                setFilterConfig({
                                  ...filterConfig,
                                  status: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded p-1.5 focus:outline-none focus:border-[#1e3a8a]"
                            >
                              <option value="">All Statuses</option>
                              <option value="Proposal">Proposal</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Pending">Pending</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-gray-500 mb-1">
                              Scope
                            </label>
                            <select
                              value={filterConfig.scope}
                              onChange={(e) =>
                                setFilterConfig({
                                  ...filterConfig,
                                  scope: e.target.value,
                                })
                              }
                              className="w-full border border-gray-300 rounded p-1.5 focus:outline-none focus:border-[#1e3a8a]"
                            >
                              <option value="">All Scopes</option>
                              <option value="Interior">Interior</option>
                              <option value="Architecture">Architecture</option>
                              <option value="on hold">on hold</option>
                              <option value="pending">pending</option>
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              setFilterConfig({ status: "", scope: "" });
                              setActiveDropdown(null);
                            }}
                            className="mt-2 text-xs text-red-500 hover:underline text-left w-max"
                          >
                            Clear filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <Table
            columns={columns}
            data={currentTableData}
            activeRow={activeRow}
            onRowClick={(item) => navigate(`/leads/${item.proposalId}`)}
            activeRowKey="proposalId"
          />
        </div>
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {showForm && (
        <NewInquiriesform
          onClose={() => setShowForm(false)}
          onAddLead={handleAddLead}
        />
      )}
    </>
  );
};

export default Leads;