import React, { useState, useEffect, useRef, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { LeadsHeader } from "../../helperConfigData/helperData";
import { ClientTableData } from "../../data/ClientTableData";
import Pagination from "../../components/Pagination";
import DateRangePicker from "../../components/DateRangePicker";
import AddClientForm from "./Addclientform";
import Table from "../../components/table/Table";
import { useNavigate } from "react-router-dom";

const Client = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filterConfig, setFilterConfig] = useState({
    paymentStatus: "",
    location: "",
  });
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

  const [newClients, setNewClients] = useState(() => {
    const saved = localStorage.getItem("newClientsData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse new clients data", e);
      }
    }
    return [];
  });

  const [deletedClients, setDeletedClients] = useState(() => {
    const saved = localStorage.getItem("deletedClients");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem("deletedClients");
    if (saved) {
      setDeletedClients(JSON.parse(saved));
    }
  }, []);

  const tableData = useMemo(() => {
    const baseData = [...ClientTableData];
    const trulyNew = [];

    newClients.forEach((newClient) => {
      const existingIndex = baseData.findIndex(
        (c) => c.clientID === newClient.clientID,
      );
      if (existingIndex >= 0) {
        baseData[existingIndex] = newClient;
      } else {
        trulyNew.push(newClient);
      }
    });

    const mergedData = [...trulyNew, ...baseData];

    return mergedData
      .filter((item) => !deletedClients.includes(item.clientID))
      .map((item, index) => ({
        ...item,
        sno: String(index + 1).padStart(2, "0"),
      }));
  }, [newClients, deletedClients]);

  const handleAddClient = (newClientData) => {
    const newIdNum = tableData.length + 1;
    const clientID = `BL-2024-${newIdNum.toString().padStart(3, "0")}`;

    const newClient = {
      sno: newIdNum,
      clientID,
      clientName: newClientData.clientName,
      clientPhone: newClientData.clientPhone,
      clientEmail: newClientData.clientEmail,
      location: newClientData.location,
      locationSecondary: newClientData.locationSecondary,
      budget: newClientData.budget,
      paymentStatus: newClientData.paymentStatus,
    };

    const updatedNewClients = [newClient, ...newClients];
    setNewClients(updatedNewClients);
    localStorage.setItem("newClientsData", JSON.stringify(updatedNewClients));
    setCurrentPage(1);
  };

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filteredData = tableData.filter((item) => {
    let matches = true;

    if (
      filterConfig.paymentStatus &&
      item.paymentStatus?.toLowerCase() !==
        filterConfig.paymentStatus.toLowerCase()
    ) {
      matches = false;
    }

    if (
      filterConfig.location &&
      item.location?.toLowerCase() !== filterConfig.location.toLowerCase()
    ) {
      matches = false;
    }

    return matches;
  });

  // ── Sort ────────────────────────────────────────────────────────────────────
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
    safeCurrentPage * rowsPerPage,
  );

  const handleExport = () => {
    if (sortedData.length === 0) return;
    const headers = [
      "Sno",
      "Client ID",
      "Client Name",
      "Client Phone",
      "Client Email",
      "Location",
      "Location Secondary",
      "Budget",
      "Payment Status",
    ];
    const csvRows = [headers.join(",")];
    sortedData.forEach((item) => {
      const row = [
        item.sno,
        item.clientID,
        item.clientName,
        item.clientPhone,
        item.clientEmail,
        item.location,
        item.locationSecondary,
        `"${item.budget}"`,
        item.paymentStatus,
      ];
      csvRows.push(row.join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "clients_export.csv");
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
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const mainTabs = ["Inquiries", "Project Caliber"];
  const subTabs = ["New Inquiries", "Nurturing Inquiries", "Dropped Inquiries"];

  const columns = [
    { key: "sno", label: "S.No" },
    { key: "clientID", label: "Client ID" },
    { key: "clientName", label: "Client Name" },
    { key: "clientPhone", label: "Client Phone" },
    { key: "clientEmail", label: "Client Email" },
    {
      key: "Address",
      label: "Address",
      render: (_, item) => (
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-[15px]">{item.location}</span>
          <span className="text-[#1e3a8a] text-[10px] leading-tight mt-0.5">
            {item.locationSecondary}
          </span>
        </div>
      ),
    },
    { key: "budget", label: "Budget" },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (_, item) => {
        const statusStyles = {
          completed: "bg-green-100 text-green-700",
          pending: "bg-yellow-100 text-yellow-700",
          failed: "bg-red-100 text-red-600",
        };
        const style =
          statusStyles[item.paymentStatus?.toLowerCase()] ||
          "bg-gray-100 text-gray-600";
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${style}`}
          >
            {item.paymentStatus}
          </span>
        );
      },
    },
  ];

  const uniqueLocations = [...new Set(tableData.map((d) => d.location))];

  return (
    <>
      <div className="bg-[#f4f4f4] min-h-screen flex flex-col">
        {activeDropdown === "Date Range" && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-60 transition-all duration-300" />
        )}

        <div className="flex justify-between mb-2 p-1.5">
          <span>
            <h3 className="text-primary text-3xl font-semibold">Clients</h3>
            <p className="text-[#64748B] text-xs">Clients - All Clients</p>
          </span>
          <button
            className="flex items-center gap-2 bg-linear-to-r from-[#1E3A8A] to-[#001552] text-white rounded-lg w-50 justify-center"
            onClick={() => setShowForm(true)}
          >
            <FiPlusCircle />
            Add Client
          </button>
        </div>

        <div>
          <div className="flex justify-between items-start pt-2 px-2">
            {/* Tabs */}
            <div className="flex flex-col items-start w-max filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.03)] z-10 transition-all">
              <div className="flex gap-7 items-end pl-2 relative z-20">
                {mainTabs.map((tab, idx) => {
                  const isActive = activeMainTab === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveMainTab(idx)}
                      className={`relative cursor-pointer flex items-center h-[42px] z-${
                        isActive ? "20" : "10"
                      } ${idx !== 0 ? "-ml-4" : ""}`}
                    >
                      <div
                        className={`relative flex items-center px-6 h-full rounded-tl-[16px] transition-colors duration-200 z-20 ${
                          isActive
                            ? "bg-white text-[#001552] font-semibold text-[15px]"
                            : "bg-[#e5e7eb] text-[#9ca3af] font-medium"
                        }`}
                      >
                        <span className="relative z-30 tracking-wide">
                          {tab}
                        </span>
                      </div>
                      <div
                        className={`absolute top-0 -right-[16px] w-[34px] h-full transform skew-x-[22deg] rounded-tr-[12px] transition-colors duration-200 z-10 ${
                          isActive ? "bg-white" : "bg-[#e5e7eb]"
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2" ref={dropdownRef}>
              {LeadsHeader.map((item, idx) => (
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

                  {/* Date Range Dropdown */}
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

                  {/* Sort Dropdown */}
                  {activeDropdown === item.name && item.name === "Sort" && (
                    <div className="absolute right-0 mt-2 p-3 bg-white border border-gray-200 shadow-lg rounded-lg w-48 z-50">
                      <h4 className="text-sm font-semibold mb-2">Sort By</h4>
                      <div className="flex flex-col gap-1 text-sm">
                        {[
                          { key: "clientName", label: "Client Name" },
                          { key: "clientID", label: "Client ID" },
                          { key: "budget", label: "Budget" },
                          { key: "paymentStatus", label: "Payment Status" },
                        ].map(({ key, label }) => (
                          <button
                            key={key}
                            onClick={() => handleSortChange(key)}
                            className={`text-left px-2 py-1.5 rounded hover:bg-gray-100 flex justify-between ${
                              sortConfig.key === key
                                ? "bg-blue-50 text-[#1e3a8a] font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            <span>{label}</span>
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

                  {/* Filter Dropdown */}
                  {activeDropdown === item.name && item.name === "Filter" && (
                    <div className="absolute right-0 mt-2 p-4 bg-white border border-gray-200 shadow-lg rounded-lg w-56 z-50">
                      <h4 className="text-sm font-semibold mb-3">
                        Filter Options
                      </h4>
                      <div className="flex flex-col gap-3 text-sm">
                        {/* Payment Status Filter */}
                        <div>
                          <label className="block text-gray-500 mb-1">
                            Payment Status
                          </label>
                          <select
                            value={filterConfig.paymentStatus}
                            onChange={(e) =>
                              setFilterConfig({
                                ...filterConfig,
                                paymentStatus: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded p-1.5 focus:outline-none focus:border-[#1e3a8a]"
                          >
                            <option value="">All</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                          </select>
                        </div>

                        {/* Location Filter */}
                        <div>
                          <label className="block text-gray-500 mb-1">
                            Property Type
                          </label>
                          <select
                            value={filterConfig.location}
                            onChange={(e) =>
                              setFilterConfig({
                                ...filterConfig,
                                location: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded p-1.5 focus:outline-none focus:border-[#1e3a8a]"
                          >
                            <option value="">All</option>
                            {uniqueLocations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => {
                            setFilterConfig({
                              paymentStatus: "",
                              location: "",
                            });
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
              ))}
            </div>
          </div>

          <Table
            columns={columns}
            data={currentTableData}
            activeRow={activeRow}
            onRowClick={(item) => navigate(`/clients/${item.clientID}`)}
            activeRowKey="clientID"
          />
        </div>

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showForm && (
        <AddClientForm
          onClose={() => setShowForm(false)}
          onAddClient={handleAddClient}
        />
      )}
    </>
  );
};

export default Client;
