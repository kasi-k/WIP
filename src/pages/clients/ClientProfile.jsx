import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { ClientTableData } from "../../data/ClientTableData";
import EditClientForm from "./EditClientForm";
import Client from "../../assets/images/Client_avatar.png"

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(() => {
    const saved = localStorage.getItem("newClientsData");
    let newClients = [];
    if (saved) {
      try {
        newClients = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse new clients data", e);
      }
    }
    
    const deleted = localStorage.getItem("deletedClients");
    const deletedClients = deleted ? JSON.parse(deleted) : [];
    if (deletedClients.includes(id)) {
      return null;
    }

    const foundNew = newClients.find((c) => c.clientID === id);
    if (foundNew) {
      return foundNew;
    }
    
    return ClientTableData.find((c) => c.clientID === id) || null;
  });

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    const deleted = localStorage.getItem("deletedClients");
    let deletedClients = deleted ? JSON.parse(deleted) : [];
    if (!deletedClients.includes(id)) {
      deletedClients.push(id);
      localStorage.setItem("deletedClients", JSON.stringify(deletedClients));
    }
    setShowDeleteConfirm(false);
    navigate("/clients");
  };

  const handleEditSave = (updatedData) => {
    const saved = localStorage.getItem("newClientsData");
    let newClients = saved ? JSON.parse(saved) : [];
    
    const existingIndex = newClients.findIndex(c => c.clientID === id);
    if (existingIndex >= 0) {
      newClients[existingIndex] = { ...newClients[existingIndex], ...updatedData };
      localStorage.setItem("newClientsData", JSON.stringify(newClients));
      setClient({ ...newClients[existingIndex] });
    } else {
      const updatedClient = { ...client, ...updatedData };
      newClients.push(updatedClient);
      localStorage.setItem("newClientsData", JSON.stringify(newClients));
      setClient(updatedClient);
    }
  };

  if (!client) {
    return (
      <div className="flex justify-center items-center h-full bg-overallbg text-text-muted text-sm font-medium">
        Loading...
      </div>
    );
  }

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending") return "bg-[#FFF4E5] text-[#D97706] border-[#FFEDD5]";
    if (s === "completed") return "bg-[#E6F4EA] text-[#16A34A] border-[#DCFCE7]";
    if (s === "failed" || s === "cancelled") return "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  // Mock appointments matching the screenshot
  const appointments = [
    {
      date: "12",
      month: "JAN",
      title: "Site Visit – Luxury Villa",
      time: "10:00 – 12:00",
      status: "Done",
      statusColor: "bg-[#E6F4EA] text-[#16A34A] border border-[#16A34A]",
      price: "₹5,000",
      type: "Consultation"
    },
    {
      date: "28",
      month: "JAN",
      title: "Documentation Review",
      time: "14:00 – 15:30",
      status: "Done",
      statusColor: "bg-[#E6F4EA] text-[#16A34A] border border-[#16A34A]",
      price: "₹8,500",
      type: "Legal"
    },
    {
      date: "14",
      month: "FEB",
      title: "Property Valuation",
      time: "11:00 – 12:30",
      status: "Booked",
      statusColor: "bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]",
      price: "₹12,000",
      type: "Valuation"
    },
    {
      date: "22",
      month: "FEB",
      title: "Token Payment Discussion",
      time: "15:00 – 16:00",
      status: "Cancelled",
      statusColor: "bg-[#FFE4E6] text-[#E11D48] border border-[#E11D48]",
      price: "-",
      type: "-"
    },
    {
      date: "10",
      month: "MAR",
      title: "Final Agreement Signing",
      time: "10:00 – 11:30",
      status: "Pending",
      statusColor: "bg-[#FEF3C7] text-[#D97706] border border-[#D97706]",
      price: "₹2.5Cr",
      type: "Deal Close"
    }
  ];

  return (
    <div className="bg-overallbg p-6 font-sans overflow-y-scroll h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-[#1e293b] leading-tight">Client Profile</h1>
          <p className="text-[13px] text-gray-500 mt-1">
            <span className="cursor-pointer hover:text-[#001552]" onClick={() => navigate('/clients')}>Clients</span> — {client.clientName}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-border cursor-pointer rounded-xl text-sm font-semibold text-[#1e293b] hover:bg-gray-50 shadow-sm transition-all"
          >
            <FiEdit2 size={16} /> Edit Client
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
        
        {/* Left Column (Sidebar) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 min-w-0">
          {/* Profile Card */}
          <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex flex-col items-center text-center">
            <div className="relative mb-5">
                <img src={Client} alt="" className="w-30 h-30 rounded-full border-0.5 shadow-sm" />
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-[#22c55e] border-[3px] border-white rounded-full"></div>
            </div>
            
            <h3 className="text-[22px] font-bold text-[#001552] mb-1">{client.clientName}</h3>
            <p className="text-[13px] font-medium text-gray-500 mb-3">{client.clientID}</p>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold mb-6 uppercase tracking-wider ${getStatusStyle(client.paymentStatus)}`}>
              {client.paymentStatus}
            </span>
            <button className="w-full py-3 bg-white border-[1.5px] border-border hover:border-[#001552] hover:text-[#001552] text-[#334155] rounded-[14px] text-[14px] font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm">
              <FiPlus size={18} /> Add New Appointment
            </button>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex flex-col gap-4">
            <div className="flex items-center gap-4 p-3 border border-bg-soft bg-[#f8fafc] rounded-[14px]">
              <div className="flex flex-col">
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Phone Number</p>
                <p className="font-bold text-[#1e293b] text-[14px]">+91 {client.clientPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 border border-bg-soft bg-[#f8fafc] rounded-[14px]">
              <div className="flex flex-col w-full overflow-hidden">
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Email</p>
                <p className="font-bold text-[#3B82F6] text-[14px] truncate">{client.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 border border-bg-soft bg-[#f8fafc] rounded-[14px]">
              <div className="flex flex-col">
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Property Type</p>
                <p className="font-bold text-[#1e293b] text-[14px]">{client.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 border border-bg-soft bg-[#f8fafc] rounded-[14px]">
              <div className="flex flex-col">
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Location</p>
                <p className="font-bold text-[#1e293b] text-[14px]">{client.locationSecondary}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 border border-bg-soft bg-[#f8fafc] rounded-[14px]">
              <div className="flex flex-col">
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">Budget</p>
                <p className="font-bold text-[#1e293b] text-[14px]">{client.budget}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Main Content) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6 min-w-0">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex items-center justify-between border border-transparent">
              <div>
                <h3 className="text-4xl font-bold text-[#3B82F6] mb-1">5</h3>
                <p className="text-gray-500 text-[13px] font-bold uppercase tracking-wider leading-tight">All<br/>Bookings</p>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                <div className="w-2.5 h-6 bg-[#3B82F6] rounded-sm opacity-60"></div>
                <div className="w-2.5 h-4 bg-[#3B82F6] rounded-sm opacity-40"></div>
                <div className="w-2.5 h-8 bg-[#3B82F6] rounded-sm opacity-80"></div>
                <div className="w-2.5 h-10 bg-[#3B82F6] rounded-sm"></div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex items-center justify-between border border-transparent">
              <div>
                <h3 className="text-4xl font-bold text-[#10B981] mb-1">2</h3>
                <p className="text-gray-500 text-[13px] font-bold uppercase tracking-wider leading-tight">Completed</p>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                <div className="w-2.5 h-4 bg-[#10B981] rounded-sm opacity-40"></div>
                <div className="w-2.5 h-7 bg-[#10B981] rounded-sm opacity-70"></div>
                <div className="w-2.5 h-10 bg-[#10B981] rounded-sm"></div>
                <div className="w-2.5 h-5 bg-[#10B981] rounded-sm opacity-50"></div>
              </div>
            </div>
            <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex items-center justify-between border border-transparent">
              <div>
                <h3 className="text-4xl font-bold text-[#F97316] mb-1">1</h3>
                <p className="text-gray-500 text-[13px] font-bold uppercase tracking-wider leading-tight">Cancelled</p>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                <div className="w-2.5 h-8 bg-[#F97316] rounded-sm opacity-80"></div>
                <div className="w-2.5 h-4 bg-[#F97316] rounded-sm opacity-40"></div>
                <div className="w-2.5 h-6 bg-[#F97316] rounded-sm opacity-60"></div>
                <div className="w-2.5 h-10 bg-[#F97316] rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Appointments & Invoices Area */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex flex-col flex-1">
            {/* Tabs */}
            <div className="flex items-center px-8 pt-4 border-b border-gray-100">
              <div className="pb-4 px-2 border-b-[3px] border-[#001552] text-[#001552] font-bold text-[15px] mr-6 cursor-pointer">
                Appointments
              </div>
              <div className="pb-4 px-2 text-gray-400 font-medium text-[15px] hover:text-[#001552] cursor-pointer transition-colors">
                Invoices
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6 flex">
                <button className="bg-white text-[13px] font-bold text-[#334155] px-4 py-2 rounded-xl border border-border flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                  All Time (5)
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>

              {/* List */}
              <div className="flex flex-col gap-4">
                {appointments.map((apt, idx) => (
                  <div key={idx} className="flex items-center justify-between group bg-white border border-bg-soft rounded-[16px] p-4 hover:border-blue-100 hover:bg-[#f8fafc] transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-5">
                      <div className="text-center w-14 h-14 bg-white rounded-xl flex flex-col justify-center items-center border border-border shadow-sm">
                        <div className="text-[17px] font-bold text-[#1e293b] leading-tight">{apt.date}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{apt.month}</div>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1e293b] text-[15px] mb-1 group-hover:text-[#001552] transition-colors">{apt.title}</h4>
                        <p className="text-[13px] font-medium text-gray-500">{apt.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${apt.statusColor.replace('border border-[#16A34A]','').replace('border border-[#0284C7]','').replace('border border-[#E11D48]','').replace('border border-[#D97706]','')}`}>
                        {apt.status === "Done" && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                        {apt.status}
                      </div>
                      
                      <div className="text-right w-24">
                        <div className="font-bold text-[#1e293b] text-[15px] mb-0.5">{apt.price}</div>
                        <div className="text-[12px] font-medium text-gray-400">{apt.type}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditFormOpen && (
        <EditClientForm
          initialData={client}
          onClose={() => setIsEditFormOpen(false)}
          onSave={handleEditSave}
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
              Delete Client
            </h2>
            <p className="text-text-muted text-[14px] mb-6">
              Are you sure you want to delete this client? This action cannot
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

export default ClientProfile;
