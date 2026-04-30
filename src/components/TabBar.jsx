/**
 * Universal tab bar — two visual variants.
 *
 * Props:
 *   tabs      — string[]
 *   active    — number (controlled)
 *   onChange  — (index) => void
 *   variant   — "folder" (skeuomorphic main tabs) | "underline" (sub-tabs)
 */
const TabBar = ({ tabs = [], active = 0, onChange, variant = "folder" }) => {
  if (variant === "folder") {
    return (
      <div className="flex gap-7 items-end pl-3.5 relative z-20">
        {tabs.map((tab, idx) => {
          const isActive = active === idx;
          return (
            <div
              key={idx}
              onClick={() => onChange?.(idx)}
              className={`relative cursor-pointer flex items-center h-[42px] ${isActive ? "z-20" : "z-10"} ${idx > 0 ? "-ml-4" : ""}`}
            >
              <div className={`relative flex items-center px-6 h-full rounded-tl-[16px] transition-colors duration-200 z-20 ${
                isActive
                  ? "bg-white text-[#001552] font-semibold text-[15px]"
                  : "bg-[#e5e7eb] text-secondary"
              }`}>
                <span className="relative z-30 tracking-wide">{tab}</span>
              </div>
              <div className={`absolute top-0 -right-[16px] w-[34px] h-full transform skew-x-22 rounded-tr-[12px] transition-colors duration-200 z-10 ${
                isActive ? "bg-white" : "bg-[#e5e7eb]"
              }`} />
            </div>
          );
        })}
      </div>
    );
  }

  // variant="underline"
  return (
    <div className="relative z-10 flex bg-white w-max items-center pr-8 ml-2 rounded-bl-[16px] -mt-px">
      <div className="flex gap-8 px-6 pt-3 pb-0 relative z-30">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => onChange?.(i)}
            className={`pb-3 pt-1 text-[15px] transition-all relative whitespace-nowrap ${
              active === i
                ? "text-[#001552] font-semibold"
                : "text-secondary hover:text-[#001552]"
            }`}
          >
            {tab}
            {active === i && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#001552] rounded-t-lg" />
            )}
          </button>
        ))}
      </div>
      <div className="absolute top-0 -right-[22px] w-[50px] h-full bg-white transform skew-x-22 rounded-tr-[16px] rounded-br-[16px] z-10" />
    </div>
  );
};

export default TabBar;
