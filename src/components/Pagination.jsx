import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [isMobile, setIsMobile] = useState(false);



  useEffect(() => { const checkScreen = () => {
      setIsMobile(window.innerWidth < 640);};
    checkScreen(); window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen); }, []);

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;


    setTimeout(() => { if (onPageChange) onPageChange(page); 
    }, 180); };

  // Desktop logic
  const getDesktopPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) { return [1, 2, 3, 4, "...", totalPages - 1, totalPages];
    } else if (currentPage < totalPages - 2) {
      return [ 1,2, currentPage - 1,currentPage,"...",totalPages - 1, totalPages, ];
    } else {
      return [ 1,2,"...",totalPages - 3,totalPages - 2,totalPages - 1,totalPages,]; }};

  // Mobile logic
  const getMobilePages = () => {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage === 1) return [1, 2, "...", totalPages];
    if (currentPage === totalPages)
      return [1, "...", totalPages - 1, totalPages];
    return [1, "...", currentPage, "...", totalPages];};

  const pages = isMobile ? getMobilePages() : getDesktopPages();
  return (
    <div className="flex justify-end">
      <div className=" px-3 py-2 flex items-center gap-2">
        {/*  Previous */}
        <button onClick={() => changePage(currentPage - 1)}disabled={currentPage === 1}
        className={` w-9 h-9 flex items-center justify-center rounded-lg
        ${currentPage === 1 ? " cursor-not-allowed":" hover:bg-gray-200" }`} >
         ‹ </button>
        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pages.map((page, index) => page === "..." ? 
          (<span key={index} className="px-2">  ...</span>  ) : (
        <button key={index} onClick={() => changePage(page)}
        className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-mediumtransition-all duration-200
        ${ currentPage === page ? "bg-[#2c2c2c] text-white scale-105  ": " text-gray-700 hover:bg-gray-200" }`}>
         {page} </button>  ), )}
        </div>

        {/*  Next */}
        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
          className={` w-9 h-9 flex items-center justify-center rounded-lg
        ${currentPage === totalPages ? " cursor-not-allowed": " hover:bg-gray-200" } `}>›
        </button>
      </div>
    </div>
  );
}