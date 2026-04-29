import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menus } from "../helperConfigData/helperData";
import { Menu } from "lucide-react";
import { SupportMenu } from "../helperConfigData/helperData";
const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`
       flex flex-col justify-between 
        transition-all duration-300
        sticky top-20 left-0 h-[calc(100vh-75px)]
        ${open ? "w-64" : "w-20"} 
        md:w-64
        p-3 md:p-4
      `}
    >
      <div>
        <div className="mb-4 flex md:hidden">
          <button onClick={() => setOpen(!open)}>
            <Menu size={24} />
          </button>
        </div>

        {Menus.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/"} 
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg mb-2
                ${
                  isActive
                    ? "bg-[#e2eefe] text-[#1E3A8A] border-r-4 border-[#1e3a8a]"
                    : "text-gray-600 hover:bg-[#e2eefe]"
                }`
              }
            >
              <Icon size={20} />

              <span
                className={`
                  ${open ? "inline" : "hidden"}
                  md:inline
                `}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>

      <div className="space-y-4 px-3 py-2">
        {SupportMenu.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg mb-2
                ${
                  isActive
                    ? "bg-[#e2eefe] text-[#1E3A8A] border-r-4 border-[#1e3a8a]"
                    : "text-gray-600 hover:bg-[#e2eefe]"
                }`
              }
            >
              <Icon size={20} />

              <span
                className={`
                  ${open ? "inline" : "hidden"}
                  md:inline
                `}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
