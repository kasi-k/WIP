import React, { useState, useRef, useEffect } from "react";
import avatar from "../assets/avatar-profile-user.svg";
import { TbSearch, TbBuildings } from "react-icons/tb";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RxDividerVertical } from "react-icons/rx";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center bg-white mx-4 my-2 rounded-lg shadow-xs">
      <div className="flex gap-3 sm:gap-4 items-center">
        <TbBuildings
          size={30}
          className="bg-[#1c2d4f] text-white rounded-lg p-1"
        />

        <div className="hidden sm:block">
          <h4 className="text-lg font-semibold text-primary">Executive CRM</h4>
          <p className="text-[10px] text-[#93a2b8]">DIGITAL ATELIER</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div
          ref={searchRef}
          className={`
            flex items-center bg-[#f1f5f9] rounded-full overflow-hidden
            transition-all duration-300 ease-in-out
            ${showSearch ? "w-40 sm:w-60" : "pl-2 w-7.5 items-center justify-center"}
          `}
        >
          <TbSearch
            size={30}
            className="cursor-pointer p-[6px] shrink-0 text-[#3a3c40]"
            onClick={() => setShowSearch(!showSearch)}
          />

          <input
            type="text"
            placeholder="Search..."
            autoFocus={showSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowSearch(false);
              }
            }}
            className={`
              bg-transparent rounded-full outline-none ml-2 text-sm w-full
              transition-all duration-300
              ${showSearch ? "opacity-100" : "opacity-0 w-0"}
            `}
          />
        </div>

        <div className="relative">
          <IoMdNotificationsOutline
            size={30}
            className="bg-[#f1f5f9] rounded-full p-1 text-[#3a3c40] cursor-pointer"
          />
        </div>
        <div className="border-l border-[#e2e8f0] h-7.5 "></div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-[#191c1e]">Alex Sterling</p>
          <p className="text-xs text-[#64748b]">Managing Partner</p>
        </div>
        <img
          src={avatar}
          alt="avatar"
          className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Header;
