import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menus, SupportMenu } from "../helperConfigData/helperData";
import { Menu } from "lucide-react";

const navClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
    isActive
      ? "bg-active-bg text-select-blue border-r-4 border-select-blue"
      : "text-grey hover:bg-active-bg"
  }`;

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex flex-col justify-between transition-all duration-300 sticky top-20 left-0 h-[calc(100vh-75px)] p-3 md:p-4 ${
        open ? "w-64" : "w-20"
      } md:w-64`}
    >
      <div>
        <div className="mb-4 flex md:hidden">
          <button onClick={() => setOpen(!open)}>
            <Menu size={24} />
          </button>
        </div>

        {Menus.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setOpen(false)}
              className={navClass}
            >
              <Icon size={20} />
              <span className={`${open ? "inline" : "hidden"} md:inline`}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>

      <div className="space-y-4 px-3 py-2">
        {SupportMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={navClass}
            >
              <Icon size={20} />
              <span className={`${open ? "inline" : "hidden"} md:inline`}>
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
