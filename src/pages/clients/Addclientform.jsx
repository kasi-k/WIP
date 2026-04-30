import React, { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { GrLocation } from "react-icons/gr";
import InputField from "../../components/InputField";

const INITIAL_FORM_STATE = {
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  location: "",
  locationSecondary: "",
  budget: "",
  paymentStatus: "",
};

const paymentStatuses = ["completed", "pending", "failed"];

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
      placeholder: "Full Name",
      required: true,
    },
    {
      name: "clientPhone",
      label: "Client Phone",
      type: "tel",
      placeholder: "Phone Number",
      required: true,
      validation: (val) =>
        !/^\d{10}$/.test(val.trim()) ? "Phone Number must be 10 digits" : null,
    },
    {
      name: "clientEmail",
      label: "Client Email",
      type: "email",
      placeholder: "example@gmail.com",
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
      placeholder: "e.g. ₹60-70L",
      required: true,
    },
  ],
};

function AddClientForm({ onClose, onAddClient }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCancel = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  };

  const validate = () => {
    let newErrors = {};
    const allFields = [
      ...FIELD_CONFIG.clientInfo,
      ...FIELD_CONFIG.propertyDetails,
      { name: "paymentStatus", label: "Payment Status", required: true },
    ];

    allFields.forEach((field) => {
      const val = formData[field.name];
      if (field.required && (!val || !val.toString().trim())) {
        newErrors[field.name] = `${field.label} is required`;
      } else if (field.validation) {
        const errorMsg = field.validation(val);
        if (errorMsg) newErrors[field.name] = errorMsg;
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      if (onAddClient) {
        onAddClient(formData);
      }
      if (onClose) onClose();
    }
  };

  const renderField = (field) => (
    <InputField
      key={field.name}
      name={field.name}
      label={field.label}
      type={field.type}
      value={formData[field.name]}
      onChange={handleInputChange}
      error={errors[field.name]}
      placeholder={field.placeholder}
      options={field.options}
      icon={field.icon}
    />
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-[16px] font-manrope shadow-2xl w-full max-w-[660px] mx-auto">
        <form onSubmit={handleSubmit}>

          {/* Header */}
          <div className="flex justify-between items-start pt-6 px-8 pb-4">
            <div>
              <h1 className="text-[19px] font-bold text-select-blue tracking-tight">
                Add Client
              </h1>
              <p className="text-text-subtle text-[13px] mt-0.5">
                Enter client and property details
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors mt-1"
            >
              <HiMiniXMark size={22} />
            </button>
          </div>

          <div className="px-8 pb-6">

            {/* Client Information */}
            <div className="mb-5">
              <h2 className="text-select-blue font-bold text-[13px] mb-3 flex items-center gap-2">
                <span className="w-[3px] h-[14px] bg-select-blue rounded-sm block"></span>
                Client Information
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {FIELD_CONFIG.clientInfo.slice(0, 2).map(renderField)}
              </div>
              <div className="mt-3">
                {renderField(FIELD_CONFIG.clientInfo[2])}
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-5">
              <h2 className="text-select-blue font-bold text-[13px] mb-3 flex items-center gap-2">
                <span className="w-[3px] h-[14px] bg-select-blue rounded-sm block"></span>
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {FIELD_CONFIG.propertyDetails.map(renderField)}
              </div>
            </div>

            {/* Payment Status */}
            <div className="mb-2">
              <h2 className="text-select-blue font-bold text-[13px] mb-3 flex items-center gap-2">
                <span className="w-[3px] h-[14px] bg-select-blue rounded-sm block"></span>
                Payment Status
              </h2>
              <div className="mb-3 mt-1">
                <label className="text-[11px] font-semibold text-[#1e293b] mb-1.5 block">
                  Current Status
                </label>
                <div className="flex gap-2 w-full justify-between">
                  {paymentStatuses.map((status, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        handleInputChange({
                          target: { name: "paymentStatus", value: status },
                        })
                      }
                      className={`flex-1 py-1.5 rounded-[6px] text-[10px] font-semibold capitalize border transition-all ${
                        formData.paymentStatus === status
                          ? "bg-blue-50 border-select-blue text-select-blue"
                          : "bg-white border-border text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                {errors.paymentStatus && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.paymentStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-6 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="text-text-muted text-[13px] font-medium hover:text-[#1e293b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-[8px] bg-select-blue text-white text-[13px] font-medium hover:bg-[#001552] shadow-sm transition-all flex items-center justify-center min-w-[140px]"
              >
                Add Client
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClientForm;