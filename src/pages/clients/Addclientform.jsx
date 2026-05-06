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
  "Luxury Villa",
  "Apartment",
  "Penthouse",
  "Independent House",
  "Duplex",
  "Studio Apartment",
  "Farm House",
  "Beach House",
];

const FIELD_CONFIG = {
  clientInfo: [
    {
      name: "clientName",
      label: "Client Name",
      type: "text",
      placeholder: "Full name",
      required: true,
    },
    {
      name: "clientPhone",
      label: "Phone Number",
      type: "tel",
      placeholder: "10-digit number",
      required: true,
      validation: (val) =>
        !/^\d{10}$/.test(val.replace(/\s/g, "")) ? "Must be a 10-digit number" : null,
    },
    {
      name: "clientEmail",
      label: "Email Address",
      type: "email",
      placeholder: "example@domain.com",
      required: true,
      validation: (val) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
          ? "Enter a valid email address"
          : null,
    },
  ],
  propertyDetails: [
    {
      name: "location",
      label: "Property Type",
      type: "select",
      options: propertyTypes,
      required: true,
    },
    {
      name: "locationSecondary",
      label: "City / Location",
      type: "text",
      placeholder: "e.g. Beverly Hills, CA",
      icon: GrLocation,
      required: true,
    },
    {
      name: "budget",
      label: "Budget",
      type: "text",
      placeholder: "e.g. ₹60 – 70L",
      required: true,
    },
  ],
};

const SectionHeader = ({ children }) => (
  <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-select-blue mb-4">
    <span className="w-0.5 h-3.5 bg-select-blue rounded-full shrink-0" />
    {children}
  </h2>
);

function AddClientForm({ onClose, onAddClient }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
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
      await onAddClient?.(formData);
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
        onClick={() => {
          setFormData(INITIAL_FORM_STATE);
          setErrors({});
        }}
        disabled={isSubmitting}
        className="text-sm font-medium text-text-muted hover:text-text transition-colors disabled:opacity-50"
      >
        Clear
      </button>
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
        form="add-client-form"
        disabled={isSubmitting}
        className="min-w-[140px] flex items-center justify-center gap-2 px-7 py-2.5 rounded-lg bg-select-blue text-white text-sm font-medium hover:bg-primary shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Processing…
          </>
        ) : "Add Client"}
      </button>
    </div>
  );

  return (
    <Modal
      title="Add Client"
      subtitle="Enter client and property details"
      onClose={isSubmitting ? undefined : onClose}
      footer={footer}
    >
      <form id="add-client-form" onSubmit={handleSubmit} noValidate>
        {/* Client Information */}
        <div className="mb-6">
          <SectionHeader>Client Information</SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            {FIELD_CONFIG.clientInfo.slice(0, 2).map(field)}
          </div>
          <div className="mt-4">{field(FIELD_CONFIG.clientInfo[2])}</div>
        </div>

        {/* Property Details */}
        <div className="mb-6">
          <SectionHeader>Property Details</SectionHeader>
          <div className="grid grid-cols-2 gap-4">
            {FIELD_CONFIG.propertyDetails.map(field)}
          </div>
        </div>

        {/* Payment Status */}
        <div>
          <SectionHeader>Payment Status</SectionHeader>
          <div>
            <p className="text-[13px] font-medium text-text mb-2">
              Current Status
            </p>
            <div className="flex gap-2">
              {paymentStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    handleChange({
                      target: { name: "paymentStatus", value: status },
                    })
                  }
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
              <p className="text-red-500 text-[11px] mt-1">
                {errors.paymentStatus}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default AddClientForm;
