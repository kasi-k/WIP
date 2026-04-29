import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#f4f4f4] font-manrope">
      <header className="shrink-0 sticky top-0 z-50">
        <Header setIsOpen={setIsOpen} />
      </header>

      <div className="flex-1 w-full flex overflow-hidden">
        <aside className="lg:w-1/6 md:1/5 h-full overflow-y-auto scrollbar-hide [scrollbar-width:none]  [&::-webkit-scrollbar]:hidden">
          <Sidebar isOpen={isOpen} />
        </aside>

        <main className=" lg:w-5/6 md:4/5 h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
