import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { PiSuitcaseSimpleBold } from "react-icons/pi";
import { MdOutlineAnalytics } from "react-icons/md";
import { FaRegFileLines } from "react-icons/fa6";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { MdOutlineContactSupport } from "react-icons/md";
import { PiSignOut } from "react-icons/pi";
import { TbCalendarDue } from "react-icons/tb";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { TbFilter } from "react-icons/tb";
import { TbFileExport } from "react-icons/tb";

export const Menus = [
    { name: "Dashboard", icon: MdOutlineDashboard, path: "/dashboard" },
    { name: "Leads", icon: HiOutlineUsers, path: "/leads" },
    {name:"Client", icon:HiOutlineUsers,path:"/clients"},
    { name: "Accounts", icon: PiSuitcaseSimpleBold, path: "/accounts" },
    { name: "Pipeline", icon:  TbDeviceDesktopAnalytics, path: "/pipeline" },
    { name: "Analytics", icon: MdOutlineAnalytics, path: "/analytics" },
    { name: "Reports", icon: FaRegFileLines, path: "/reports" },
];

export const SupportMenu = [
    { name: "Support", icon: MdOutlineContactSupport, path: "/support" },
    { name: "Sign Out", icon: PiSignOut, path: "/signout" },
];

export const LeadsHeader = [
    { name: "Date Range", icon: <TbCalendarDue size={23}/> },
    { name: "Sort", icon: <HiMiniArrowsUpDown size={23}/> },
    { name: "Filter", icon: <TbFilter size={23}/> },
    { name: "Export", icon: <TbFileExport size={23}/> },
];
