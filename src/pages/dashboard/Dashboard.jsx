import React from "react";
import { MdFiberNew } from "react-icons/md";
import { MdOutlineCall } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { GrStatusGood } from "react-icons/gr";
import { FaRegFileAlt } from "react-icons/fa";
import { VscError } from "react-icons/vsc";

const Dashboard = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white h-30 w-40 rounded-3xl shadow-md relative ml-4 border-t-6 border-green-400 ">
          <p className="absolute top-[-4px] left-12 p-1 rounded-lg text-xs bg-green-400 text-white ">
            45% New
          </p>
          <p className="absolute top-8 left-5 text-sm font-semibold text-gray-400 ">
            {" "}
            New Leads
          </p>
          <p className="absolute bottom-7 right-6 font-semibold text-2xl">
            1284
          </p>
          <p className="absolute bottom-4 right-6 text-xs text-gray-400">
            Incoming leads
          </p>
        </div>
        <div className="bg-white h-30 w-40  rounded-3xl shadow-md relative ml-4 border-t-6 border-blue-400 text-white">
          <p className="absolute top-[-4px] left-10 p-1 rounded-lg text-xs bg-blue-400 text-white">
            88% Drop Off
          </p>
          <p className="absolute top-8 left-5 text-sm font-semibold text-gray-400">
            Contracted
          </p>
          <p className="absolute bottom-7 right-6 font-semibold text-2xl text-black">
            942
          </p>
          <p className="absolute bottom-4 right-6 text-xs text-gray-400">
            Initial response
          </p>
        </div>
        <div className="bg-white h-30 w-40 rounded-3xl shadow-md relative ml-4 border-t-6 border-violet-400">
          <p className="absolute top-[-4px] left-10 p-1 rounded-lg text-xs bg-violet-400 text-white">
            45% Drop Off
          </p>
          <p className="absolute top-8 left-5 text-sm font-semibold text-gray-400">
            {" "}
            Site Visit
          </p>
          <p className="absolute bottom-7 right-6 font-semibold text-2xl">
            318
          </p>
          <p className="absolute bottom-4 right-6 text-xs text-gray-400">
            Confirmed visits
          </p>
        </div>
        <div className="bg-white h-30 w-40 rounded-3xl shadow-md relative ml-4 border-t-6 border-orange-300">
          <p className="absolute top-[-4px] left-10 p-1 rounded-lg text-xs bg-orange-300 text-white">
            12% Drop Off
          </p>
          <p className="absolute top-8 left-5 text-sm font-semibold text-gray-400">
            {" "}
            Quotation
          </p>
          <p className="absolute bottom-7 right-6 font-semibold text-2xl">
            156
          </p>
          <p className="absolute bottom-4 right-6 text-xs text-gray-400">
            Propsals sent
          </p>
        </div>
        <div className="bg-white h-30 w-40 rounded-3xl shadow-md relative ml-4 border-t-6 border-purple-500">
          <p className="absolute top-8 left-5 text-sm font-semibold text-gray-400">
            Converted
          </p>
          <p className="absolute bottom-7 right-6 font-semibold text-2xl">84</p>
          <p className="absolute bottom-4 right-6 text-xs text-gray-400">
            Closed deals
          </p>
        </div>
        <div className="bg-white h-30 w-40 rounded-3xl shadow-md relative ml-4 border-t-6 border-red-300">
          <p className="absolute top-8 left-5 text-sm font-semibold text-gray-400">
            {" "}
            Pending
          </p>
          <p className="absolute bottom-7 right-6 font-semibold text-2xl">12</p>
          <p className="absolute bottom-4 right-6 text-xs text-gray-400">
            Pending Payments
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-6 mt-3 gap-4">
        <div className="bg-white p-4 col-span-3 rounded-3xl relative shadow-md h-100 w-140">
          <p className="text-xl text-gray-700 font-semibold ">
            Lead Distribution
          </p>
          <p className="text-xs text-gray-400">
            Performance by acquisition channel
          </p>
          <button className="absolute top-4 right-25 bg-gray-100 p-1.5 rounded-xl text-xs">
            Daily
          </button>
          <button className="absolute top-4 right-4 bg-gray-700 p-1.5 rounded-xl text-white text-xs">
            Monthly
          </button>
          <span className="h-10 w-2.5 rounded-full bg-green-500 absolute top-20 right-50 "></span>
          <span></span>
          <span className="h-10 w-2.5 rounded-full bg-red-500 absolute top-40 right-50 "></span>
          <span className="h-10 w-2.5 rounded-full bg-blue-500 absolute top-60 right-50 "></span>
          <span className="h-10 w-2.5 rounded-full bg-violet-500 absolute top-80 right-50 "></span>
        </div>
        <div className="bg-white p-4 col-span-3 rounded-3xl relative shadow-md h-100 w-140">
          <p className="text-xl text-gray-700 font-semibold ">
            Lead Distribution
          </p>
          <p className="text-xs text-gray-400">
            Performance by acquisition channel
          </p>
          <button className="absolute top-4 right-25 bg-gray-100 p-1.5 rounded-xl text-xs">
            Daily
          </button>
          <button className="absolute top-4 right-4 bg-gray-700 p-1.5 rounded-xl text-white text-xs">
            Monthly
          </button>
        </div>
      </div>
      <div className="grid mt-3 bg-white p-6 rounded-3xl shadow-md   ">
        <p className="mb-3 text-primary font-semibold">
          Active Lead Pipeline
        </p>
        <div className=" bg-white grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          <div className="relative w-35 h-30 rounded-3xl">
            <MdFiberNew
              size={50}
              className="bg-[#537BCC] absolute top-3 left-10 text-white rounded-full p-1.5 border-3 shadow-md "
            />
            <span className="absolute top-16 left-13 text-[#7f7f7f]">New</span>
            <span className="absolute top-22 left-10 text-[#537BCC] font-semibold">
              32 Leads
            </span>
          </div>
          <div className="relative w-35 h-30 rounded-3xl">
            <MdOutlineCall
              size={50}
              className="bg-primary absolute top-3 left-10 text-white rounded-full p-1.5 border-3 shadow-md "
            />
            <span className="absolute top-16 left-9 text-[#7f7f7f]">
              Contacted
            </span>
            <span className="absolute top-22 left-10 text-primary font-semibold">
              18 Leads
            </span>
          </div>
          <div className="relative  w-35 h-30 rounded-3xl">
            <IoLocationOutline
              size={50}
              className="bg-[#54ab4e] absolute top-3 left-10 text-white rounded-full p-1.5 border-3 shadow-md "
            />
            <span className="absolute top-16 left-9 text-[#7f7f7f]">
              Site Visit
            </span>
            <span className="absolute top-22 left-10 text-[#54ab4e] font-semibold">
              9 Leads
            </span>
          </div>
          <div className="relative  w-35 h-30 rounded-3xl">
            <FaRegFileAlt
              size={50}
              className="bg-[#3B1CEB] absolute top-3 left-10 text-white rounded-full p-1.5 border-3 shadow-md "
            />
            <span className="absolute top-16 left-9 text-[#7f7f7f]">
              Quotation
            </span>
            <span className="absolute top-22 left-10 text-[#3b1ceb] font-semibold">
              14 Leads
            </span>
          </div>
          <div className="relative  w-35 h-30 rounded-3xl">
            <GrStatusGood
              size={50}
              className="bg-[#008000] absolute top-3 left-10 text-white rounded-full p-1.5 border-3 shadow-md "
            />
            <span className="absolute top-16 left-9 text-[#7f7f7f]">
              Converted
            </span>
            <span className="absolute top-22 left-10 text-[#008000] font-semibold">
              42 Leads
            </span>
          </div>
          <div className="relative  w-35 h-30 rounded-3xl">
            <VscError
              size={50}
              className="bg-[#FAC5C0] absolute top-3 left-10 text-[#ba1a1a] rounded-full p-1.5 border-3 border-white shadow-md "
            />
            <span className="absolute top-16 left-13 text-[#7f7f7f]">Lost</span>
            <span className="absolute top-22 left-9 font-semibold text-[#ba1a1a]">
              12% Leads
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 bg-white p-6 rounded-3xl mt-3 gap-4">
        <div className="flex justify-between col-span-6">
          <p className="font-semibold  text-[#191c1e]">Invoice Management</p>
          <ul className="flex gap-3 bg-gray-200 text-xs p-2.5 rounded-2xl items-center">
            <li className="transform bg-linear-to-r from-[#1e3aba] to-[#001552] p-1  rounded text-white">
              Pending
            </li>
            <li>Completed</li>
            <li>Overdue</li>
          </ul>
        </div>
        <div className="col-span-2 bg-gray-200 p-6 mt-6 rounded-3xl border-l-4 border-[#34d399] relative gap-2 h-30">
          <p className="absolute text-[#44464e] text-xs top-4 left-4">
            PAID INVOICES
          </p>
          <p className="text-2xl text-[#191c1e] font-bold top-9 left-4 absolute ">
            $84,200.00
          </p>
          <p className="text-[#34d399] text-xs absolute top-20 left-4">
            12 transactions this week
          </p>
        </div>
        <div className="col-span-2 bg-gray-200 p-6 mt-6 rounded-3xl border-l-4 border-[#34d399] relative gap-2 h-30">
          <p className="absolute text-[#44464e] text-xs top-4 left-4">
            PAID INVOICES
          </p>
          <p className="text-2xl text-[#191c1e] font-bold top-9 left-4 absolute ">
            $84,200.00
          </p>
          <p className="text-[#34d399] text-xs absolute top-20 left-4">
            12 transactions this week
          </p>
        </div>
        <div className="col-span-2 bg-gray-200 p-6 mt-6 rounded-3xl border-l-4 border-[#34d399] relative gap-2 h-30">
          <p className="absolute text-[#44464e] text-xs top-4 left-4">
            PAID INVOICES
          </p>
          <p className="text-2xl text-[#191c1e] font-bold top-9 left-4 absolute ">
            $84,200.00
          </p>
          <p className="text-[#34d399] text-xs absolute top-20 left-4">
            12 transactions this week
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
