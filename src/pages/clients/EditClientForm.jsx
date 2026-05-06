import React, { useState } from "react";
import { GrLocation } from "react-icons/gr";
import { Loader2 } from "lucide-react";
import InputField from "../../components/InputField";
import Modal from "../../components/Modal";

const INITIAL_FORM_STATE = {
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  location: "",
  locationSecondary: "",
  budget: "",
  paymentStatus: "",
};

const paymentStatuses = ["Completed", "Pending", "Unfulfilled"];

const propertyTypes = [
  "Luxury Villa", "Apartment", "Penthouse", "Independent House",
  "Duplex", "Studio Apartment", "Farm House", "Beach House",
];

const FIELD_CONFIG = {
  clientInfo: [
    { name: "clientName", label: "Client Name", type: "text", placeholder: "Full name", required: true },
    {
      name: "clientPhone", label: "Phone Number", type: "tel", placeholder: "10-digit number",
      required: true,
      validation: (val) => !/^\d{10}$/.test(val.replace(/\s/g, "")) ? "Must be a 10-digit number" : null,
    },
    {
      name: "clientEmail", label: "Email Address", type: "email", placeholder: "example@domain.com",
      required: true,
      validation: (val) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? "Enter a valid email address" : null,
    },
  ],
  propertyDetails: [
    { name: "location", label: "Property Type", type: "select", options: propertyTypes, required: true },
    { name: "locationSecondary", label: "City / Location", type: "text", placeholder: "e.g. Beverly Hills, CA", icon: GrLocation, required: true },
    { name: "budget", label: "Budget", type: "text", placeholder: "e.g. ₹60 – 70L", required: true },
  ],
};

const SectionHeader = ({ children }) => (
  <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-select-blue mb-4">
    <span className="w-0.5 h-3.5 bg-select-blue rounded-full shrink-0" />
    {children}
  </h2>
);

function EditClientForm({ initialData, onClose, onSave, hasMilestones = false }) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        clientName: initialData.clientName || "",
        clientPhone: initialData.clientPhone || "",
        clientEmail: initialData.clientEmail || "",
        location: initialData.location || "",
        locationSecondary: initialData.locationSecondary || "",
        budget: initialData.budget || "",
        paymentStatus: initialData.paymentStatus || "",
      };
    }
    return INITIAL_FORM_STATE;
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const allFields = [
      ...FIELD_CONFIG.clientInfo,
      ...FIELD_CONFIG.propertyDetails,
      { name: "paymentStatus", label: "Payment Status", required: true },
    ];
    allFields.forEach((f) => {
      const val = formData[f.name];
      if (f.required && (!val || !val.toString().trim())) {
        newErrors[f.name] = `${f.label} is required`;
      } else if (f.validation) {
        const msg = f.validation(val);
        if (msg) newErrors[f.name] = msg;
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave?.(formData);
      onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (cfg) => (
    <InputField
      key={cfg.name}
      name={cfg.name}
      label={cfg.label}
      type={cfg.type}
      value={formData[cfg.name]}
      onChange={handleChange}
      error={errors[cfg.name]}
      placeholder={cfg.placeholder}
      options={cfg.options}
      icon={cfg.icon}
    />
  );

  const footer = (
    <div className="flex justify-end items-center gap-4">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-text-muted hover:bg-bg-soft transition-all disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="edit-client-form"
        disabled={isSubmitting}
        className="min-w-[140px] flex items-center justify-center gap-2 px-7 py-2.5 rounded-lg bg-select-blue text-white text-sm font-medium hover:bg-primary shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Saving…
          </>
        ) : "Save Changes"}
      </button>
    </div>
  );

  return (
    <Modal
      title="Edit Client"
      subtitle="Update client and property details"
      onClose={isSubmitting ? undefined : onClose}
      footer={footer}
    >
      <form id="edit-client-form" onSubmit={handleSubmit} noValidate>

        <div className="mb-6">
          <SectionHeader>Client Information</SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            {FIELD_CONFIG.clientInfo.slice(0, 2).map(field)}
          </div>
          <div className="mt-4">{field(FIELD_CONFIG.clientInfo[2])}</div>
        </div>

        <div className="border-t border-border mb-6" />

        <div className="mb-6">
          <SectionHeader>Property Details</SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            {FIELD_CONFIG.propertyDetails.map(field)}
          </div>
        </div>

        <div className="border-t border-border mb-6" />

        <div>
          <SectionHeader>Payment Status</SectionHeader>
          {hasMilestones ? (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-soft border border-border">
              <div>
                <p className="text-[12px] font-semibold text-text-muted">Auto-managed by payment milestones</p>
                <p className="text-[11px] text-text-subtle mt-0.5">Status updates automatically as milestones are marked paid.</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                formData.paymentStatus?.toLowerCase() === "completed" ? "bg-green-50 text-green-700 border-green-200" :
                formData.paymentStatus?.toLowerCase() === "pending"   ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                formData.paymentStatus?.toLowerCase() === "failed"    ? "bg-red-50 text-red-600 border-red-200" :
                "bg-gray-50 text-gray-500 border-gray-200"
              }`}>
                {formData.paymentStatus || "Pending"}
              </span>
            </div>
          ) : (
            <div>
              <p className="text-[13px] font-medium text-text mb-2">Current Status</p>
              <div className="flex gap-2">
                {paymentStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleChange({ target: { name: "paymentStatus", value: status } })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                      formData.paymentStatus === status
                        ? "bg-active-bg border-select-blue text-select-blue"
                        : "bg-white border-border text-text-muted hover:bg-bg-soft"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              {errors.paymentStatus && (
                <p className="text-red-500 text-[11px] mt-1">{errors.paymentStatus}</p>
              )}
            </div>
          )}
        </div>

      </form>
    </Modal>
  );
}

export default EditClientForm;
