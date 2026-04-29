import React, { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { GrLocation } from "react-icons/gr";
import InputField from "../../components/forms/InputField";

const INITIAL_FORM_STATE = {
  fullName: "",
  phoneNumber: "",
  inquirySource: "",
  projectScope: "",
  investmentRange: "",
  buildUpArea: "",
  processionDate: "",
  propertyType: "",
  location: "",
  inquiryStatus: "",
  architecturalNotes: "",
};

const inquiryStatuses = [
  "Inquiry",
  "qualified",
  "proposal",
  "won",
  "lost",
  "on hold",
];

const inquirySources = [
  "Inquiry",
  "qualified",
  "proposal",
  "won",
  "lost",
  "on hold",
];

const FIELD_CONFIG = {
  clientInfo: [
    {
      name: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "Name",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number",
      required: true,
      validation: (val) =>
        !/^\d{10}$/.test(val.trim()) ? "Phone Number must be 10 digits" : null,
    },
    {
      name: "inquirySource",
      label: "Inquiry Source",
      type: "select",
      options: inquirySources,
      required: true,
    },
  ],
  projectDetails: [
    {
      name: "projectScope",
      label: "Project Scope",
      type: "select",
      options: ["Full Home Interior", "Interior", "On hold", "Pending"],
      required: true,
    },
    {
      name: "investmentRange",
      label: "Investment Range",
      type: "text",
      placeholder: "e.g-5000-10000",
      required: true,
    },
    {
      name: "buildUpArea",
      label: "Build-Up Area(Sq.Ft)",
      type: "text",
      placeholder: "2400",
      required: true,
    },
    {
      name: "processionDate",
      label: "Procession Date",
      type: "date",
      required: true,
    },
    {
      name: "propertyType",
      label: "Property Type",
      type: "text",
      placeholder: "Penthouse",
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Kochi, street, city",
      icon: GrLocation,
      required: true,
    },
  ],
};

function EditInquiryform({ initialData, onClose, onAddLead }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (initialData) {
      let processionDate = "";
      if (initialData.possessionDate) {
        const parts = initialData.possessionDate.split(".");
        if (parts.length === 3) {
          processionDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
          processionDate = initialData.possessionDate;
        }
      }

      setFormData({
        fullName: initialData.clientName || "",
        phoneNumber: initialData.phone || "",
        inquirySource: initialData.inquirySource || "",
        projectScope: initialData.scope || "",
        investmentRange: initialData.investment || "",
        buildUpArea: initialData.buildUpArea || "",
        processionDate,
        propertyType: initialData.propertyType || "",
        location: initialData.location || "",
        inquiryStatus: initialData.status || "",
        architecturalNotes: initialData.architecturalNotes || "",
      });
    }
  }, [initialData]);

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
    // Only validate the core fields that are always available
    const requiredFields = [
      ...FIELD_CONFIG.clientInfo.filter(f => f.name !== "inquirySource"),
      { name: "location", label: "Location", required: true },
      { name: "inquiryStatus", label: "Inquiry Status", required: true },
    ];

    requiredFields.forEach((field) => {
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
      if (onAddLead) {
        onAddLead(formData);
      }
      if (onClose) onClose();
    }
  };

  const renderField = (field) => {
    return (
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
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-[16px] font-manrope shadow-2xl w-full max-w-[660px] mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-start pt-6 px-8 pb-4">
            <div>
              <h1 className="text-[19px] font-bold text-[#1e3a8a] tracking-tight">
                Edit Inquiry
              </h1>
              <p className="text-[#94a3b8] text-[13px] mt-0.5">
                Enter client and project details
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
              <h2 className="text-[#1e3a8a] font-bold text-[13px] mb-3 flex items-center gap-2">
                <span className="w-[3px] h-[14px] bg-[#1e3a8a] rounded-sm block"></span>
                Client Information
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {FIELD_CONFIG.clientInfo.slice(0, 2).map(renderField)}
              </div>
              <div className="mt-3">
                {renderField(FIELD_CONFIG.clientInfo[2])}
              </div>
            </div>

            {/* Project Details */}
            <div className="mb-5">
              <h2 className="text-[#1e3a8a] font-bold text-[13px] mb-3 flex items-center gap-2">
                <span className="w-[3px] h-[14px] bg-[#1e3a8a] rounded-sm block"></span>
                Project Details
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {FIELD_CONFIG.projectDetails.map(renderField)}
              </div>
            </div>

            {/* Inquiry Status & Notes */}
            <div className="mb-2">
              <h2 className="text-[#1e3a8a] font-bold text-[13px] mb-3 flex items-center gap-2">
                <span className="w-[3px] h-[14px] bg-[#1e3a8a] rounded-sm block"></span>
                Inquiry Status & Notes
              </h2>
              <div className="mb-3 mt-1">
                <label className="text-[11px] font-semibold text-[#1e293b] mb-1.5 block">
                  Current Status
                </label>
                <div className="flex gap-2 w-full justify-between">
                  {inquiryStatuses.map((status, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        handleInputChange({
                          target: { name: "inquiryStatus", value: status },
                        })
                      }
                      className={`flex-1 py-1.5 rounded-[6px] text-[10px] font-semibold capitalize border transition-all ${
                        formData.inquiryStatus === status
                          ? "bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]"
                          : "bg-white border-[#e2e8f0] text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                {errors.inquiryStatus && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.inquiryStatus}
                  </p>
                )}
              </div>

              <div className="mt-3">
                <InputField
                  type="textarea"
                  name="architecturalNotes"
                  label="Architectural Notes"
                  value={formData.architecturalNotes}
                  onChange={handleInputChange}
                  error={errors.architecturalNotes}
                  placeholder="Mention specific design preferences, mood, or constraints..."
                  rows={2}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-6 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="text-[#64748b] text-[13px] font-medium hover:text-[#1e293b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-[8px] bg-[#1e3a8a] text-white text-[13px] font-medium hover:bg-[#001552] shadow-sm transition-all flex items-center justify-center min-w-[140px]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditInquiryform;
