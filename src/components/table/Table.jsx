import React from 'react';

const Table = ({ columns, data, activeRow, onRowClick, activeRowKey = "id" }) => {
  return (
    <table className="w-full px-4 text-sm border-separate border-spacing-y-0.5 text-center">
      <thead className="text-primary ">
        <tr className="rounded-xl border bg-white border-[#e5e5e5]">
          {columns.map((col, colIdx) => {
            const isFirst = colIdx === 0;
            const isLast = colIdx === columns.length - 1;
            return (
              <th
                key={col.key || colIdx}
                className={`py-4 font-medium ${isFirst ? "rounded-l-2xl" : ""} ${isLast ? "rounded-r-2xl" : ""}`}
              >
                {col.label}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => {
          const rowId = item[activeRowKey] || index;
          const isSelected = activeRow !== null && activeRow === rowId;
          return (
            <tr
              key={index}
              onClick={() => onRowClick && onRowClick(item)}
              className={`text-sm transition shadow-sm rounded-2xl cursor-pointer relative ${
                isSelected
                  ? "bg-white z-10 shadow-[0_0_0_1px_#1e3a8a]"
                  : "bg-white hover:bg-gray-50 border border-[#e5e5e5]"
              }`}
            >
              {columns.map((col, colIdx) => {
                const isFirst = colIdx === 0;
                const isLast = colIdx === columns.length - 1;
                
                let borderClass = "";
                if (isSelected) {
                  if (isFirst) borderClass = "border-y border-l border-[#1e3a8a]";
                  else if (isLast) borderClass = "border-y border-r border-[#1e3a8a]";
                  else borderClass = "border-y border-[#1e3a8a]";
                }

                const roundedClass = `${isFirst ? "rounded-l-2xl" : ""} ${isLast ? "rounded-r-2xl" : ""}`;
                const cellValue = item[col.key];

                return (
                  <td
                    key={col.key || colIdx}
                    className={`py-2 px-3 ${roundedClass} ${borderClass}`}
                  >
                    {col.render ? col.render(cellValue, item, index) : cellValue}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;