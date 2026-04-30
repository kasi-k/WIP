import { useState, useMemo } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { ClientTableData } from "../../data/ClientTableData";
import AddClientForm from "./Addclientform";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";

const Client = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const [newClients, setNewClients] = useState(() => {
    const saved = localStorage.getItem("newClientsData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [deletedClients] = useState(() => {
    const saved = localStorage.getItem("deletedClients");
    return saved ? JSON.parse(saved) : [];
  });

  const tableData = useMemo(() => {
    const baseData = [...ClientTableData];
    const trulyNew = [];

    newClients.forEach((newClient) => {
      const idx = baseData.findIndex((c) => c.clientID === newClient.clientID);
      if (idx >= 0) {
        baseData[idx] = newClient;
      } else {
        trulyNew.push(newClient);
      }
    });

    return [...trulyNew, ...baseData]
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
    const updated = [newClient, ...newClients];
    setNewClients(updated);
    localStorage.setItem("newClientsData", JSON.stringify(updated));
  };

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
          <span className="text-select-blue text-[10px] leading-tight mt-0.5">
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

  return (
    <div className="h-full">
      <Table
        title="Clients"
        subtitle="Clients - All Clients"
        columns={columns}
        data={tableData}
        rowsPerPage={8}
        onRowClick={(item) => navigate(`/clients/${item.clientID}`)}
        activeRowKey="clientID"
        mainTabs={["Inquiries", "Project Caliber"]}
        subTabs={["New Inquiries", "Nurturing Inquiries", "Dropped Inquiries"]}
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-linear-to-r from-[#1E3A8A] to-[#001552] text-white rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            <FiPlusCircle />
            Add Client
          </button>
        }
        sortFields={[
          { key: "clientName", label: "Client Name" },
          { key: "clientID", label: "Client ID" },
          { key: "budget", label: "Budget" },
          { key: "paymentStatus", label: "Payment Status" },
        ]}
        filterFields={[
          {
            key: "paymentStatus",
            label: "Payment Status",
            options: ["Completed", "Pending", "Failed"],
          },
        ]}
        exportConfig={{
          filename: "clients_export",
          columns: [
            { label: "Sno", key: "sno" },
            { label: "Client ID", key: "clientID" },
            { label: "Client Name", key: "clientName" },
            { label: "Client Phone", key: "clientPhone" },
            { label: "Client Email", key: "clientEmail" },
            {
              label: "Location",
              render: (item) =>
                `${item.location} - ${item.locationSecondary}`,
            },
            { label: "Budget", key: "budget" },
            { label: "Payment Status", key: "paymentStatus" },
          ],
        }}
      />

      {showForm && (
        <AddClientForm
          onClose={() => setShowForm(false)}
          onAddClient={handleAddClient}
        />
      )}
    </div>
  );
};

export default Client;
