import { useState } from "react";
import {
  FiUserPlus,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownRight,
  FiPackage,
  FiCalendar,
  FiAlertTriangle,
} from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

// ─── Mock data ───────────────────────────────────────────────────────────────
const STATS = [
  {
    label: "New Leads",
    value: "1,284",
    sub: "Incoming leads",
    badge: { text: "45% New", tone: "emerald" },
    accent: "bg-emerald-400",
  },
  {
    label: "Contacted",
    value: "942",
    sub: "Initial response",
    badge: { text: "88% Drop Off", tone: "sky" },
    accent: "bg-sky-400",
  },
  {
    label: "Site Visit",
    value: "318",
    sub: "Confirmed visits",
    badge: { text: "45% Drop Off", tone: "violet" },
    accent: "bg-violet-400",
  },
  {
    label: "Quotation",
    value: "156",
    sub: "Proposals sent",
    badge: { text: "12% Drop Off", tone: "amber" },
    accent: "bg-amber-300",
  },
  {
    label: "Converted",
    value: "84",
    sub: "Closed deals",
    badge: null,
    accent: "bg-purple-500",
  },
  {
    label: "Pending",
    value: "12",
    sub: "Pending payments",
    badge: null,
    accent: "bg-rose-300",
  },
];

const TONE_BG = {
  emerald: "bg-emerald-400 text-white",
  sky: "bg-sky-400 text-white",
  violet: "bg-violet-400 text-white",
  amber: "bg-amber-300 text-white",
};

const DISTRIBUTION = [
  { label: "Referral", pct: 30, color: "#10b981" },
  { label: "Walk-in", pct: 15, color: "#ef4444" },
  { label: "Website", pct: 35, color: "#3b82f6" },
  { label: "Social", pct: 20, color: "#8b5cf6" },
];

const ACTIVITY = [
  {
    time: "09:30 AM",
    title: "Site Visit · Azure Penthouse",
    sub: "Walkthrough completed with Mr. Anand",
    tone: "emerald",
  },
  {
    time: "11:15 AM",
    title: "Supplier Meeting · Amaca",
    sub: "Reviewed marble shipment timelines",
    tone: "sky",
  },
  {
    time: "01:45 PM",
    title: "Project Review · The Gilded Loft",
    sub: "Design sign-off pending from client",
    tone: "violet",
  },
  {
    time: "04:30 PM",
    title: "Contract Signed · Peak Villa",
    sub: "Initial booking token released",
    tone: "amber",
  },
];

const TONE_DOT = {
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-400",
};

const PIPELINE = [
  { label: "New", value: "32 Leads", icon: FiUserPlus, color: "#537BCC", bg: "#e8efff" },
  { label: "Contacted", value: "18 Leads", icon: FiPhone, color: "#1a2b4d", bg: "#e2e7f2" },
  { label: "Site Visit", value: "9 Leads", icon: FiMapPin, color: "#54ab4e", bg: "#e6f4e3" },
  { label: "Quotation", value: "14 Leads", icon: FiFileText, color: "#3B1CEB", bg: "#e7e2fe" },
  { label: "Converted", value: "42 Leads", icon: FiCheckCircle, color: "#008000", bg: "#e0f5e0" },
  { label: "Lost", value: "12% Leads", icon: FiAlertTriangle, color: "#ba1a1a", bg: "#fae0dc" },
];

const INVOICE_TABS = ["Pending", "Completed", "Overdue"];

const INVOICES = [
  {
    title: "PAID INVOICES",
    amount: "$84,200.00",
    sub: "12 transactions this week",
    accent: "border-emerald-400",
    subColor: "text-emerald-500",
    trend: "up",
  },
  {
    title: "RECENT RECEIPTS",
    amount: "$18,450.00",
    sub: "Processing receipts",
    accent: "border-violet-500",
    subColor: "text-violet-500",
    trend: "up",
  },
  {
    title: "PENDING AMOUNT",
    amount: "$5,210.00",
    sub: "Awaiting client payments",
    accent: "border-rose-400",
    subColor: "text-rose-500",
    trend: "down",
  },
];

const MATERIALS = [
  { code: "STK-013", name: "Carrara Marble", note: "In stock · Vendor A", status: "in", accent: "border-emerald-400" },
  { code: "STK-014", name: "Gold Satin Paint", note: "Out of stock", status: "out", accent: "border-rose-400" },
  { code: "STK-015", name: "European Oak", note: "In stock · Vendor B", status: "in", accent: "border-amber-400" },
];

const PROJECTS = [
  { code: "PRJ-101", name: "The Obsidian Villa", target: "Aug 30", status: "On Track" },
  { code: "PRJ-102", name: "Gold Satin Paint Project", target: "Aug 30", status: "On Track" },
  { code: "PRJ-103", name: "Azure Sky Loft", target: "Aug 30", status: "On Track" },
  { code: "PRJ-104", name: "Project Phoenix Refurbishment", target: "Aug 30", status: "On Track" },
];

// ─── Donut chart (SVG) ───────────────────────────────────────────────────────
const Donut = ({ data, size = 200, stroke = 24 }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const segments = data.reduce(
    (acc, seg) => {
      const len = (seg.pct / 100) * c;
      acc.items.push({ ...seg, len, offset: acc.cursor });
      acc.cursor += len;
      return acc;
    },
    { items: [], cursor: 0 },
  ).items;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {segments.map((seg) => (
        <circle
          key={seg.label}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={seg.color}
          strokeWidth={stroke}
          strokeDasharray={`${seg.len} ${c - seg.len}`}
          strokeDashoffset={-seg.offset}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  );
};

// ─── Sections ────────────────────────────────────────────────────────────────
const StatCard = ({ stat }) => (
  <div className="relative bg-white rounded-2xl shadow-sm pt-5 pb-4 px-4 min-h-[110px] flex flex-col justify-between overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-1.5 ${stat.accent}`} />
    {stat.badge && (
      <span
        className={`absolute -top-1 left-15 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm ${TONE_BG[stat.badge.tone]}`}
      >
        {stat.badge.text}
      </span>
    )}
    <div className="mt-3">
      <p className="text-[12px] font-semibold text-text-subtle">{stat.label}</p>
    </div>
    <div className="text-right">
      <p className="text-2xl font-bold text-text">{stat.value}</p>
      <p className="text-[10px] text-text-subtle mt-0.5">{stat.sub}</p>
    </div>
  </div>
);

const LeadDistribution = () => {
  const [view, setView] = useState("Monthly");
  const total = DISTRIBUTION.reduce((s, d) => s + d.pct, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 h-full">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[16px] font-semibold text-text">Lead Distribution</h3>
          <p className="text-[11px] text-text-subtle">
            Performance by acquisition channel
          </p>
        </div>
        <div className="flex bg-bg-soft rounded-xl p-1 gap-1">
          {["Daily", "Monthly"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-[11px] rounded-lg transition-colors ${
                view === v
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-4">
        <div className="relative shrink-0">
          <Donut data={DISTRIBUTION} size={200} stroke={24} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] text-text-subtle font-medium">Total</p>
            <p className="text-2xl font-bold text-text">1,284</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {DISTRIBUTION.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span
                className="w-1 h-8 rounded-full"
                style={{ background: d.color }}
              />
              <div className="flex-1">
                <p className="text-[12px] font-medium text-text">{d.label}</p>
                <div className="h-1.5 bg-bg-soft rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(d.pct / total) * 100}%`, background: d.color }}
                  />
                </div>
              </div>
              <span className="text-[12px] font-bold text-text w-9 text-right">
                {d.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DailyActivity = () => (
  <div className="bg-white rounded-2xl shadow-sm p-5 h-full">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[16px] font-semibold text-text">Daily Activity</h3>
      <button className="text-text-subtle hover:text-text">
        <HiOutlineDotsHorizontal size={18} />
      </button>
    </div>
    <div className="relative pl-5">
      <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-bordergray" />
      <ul className="space-y-4">
        {ACTIVITY.map((a, i) => (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${TONE_DOT[a.tone]}`}
            />
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[12px] font-semibold text-text">{a.title}</p>
              <span className="text-[10px] text-text-subtle whitespace-nowrap">
                {a.time}
              </span>
            </div>
            <p className="text-[11px] text-text-muted mt-0.5">{a.sub}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const PipelineStage = ({ stage }) => {
  const Icon = stage.icon;
  return (
    <div className="flex flex-col items-center text-center px-2">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-4 border-white mb-2"
        style={{ background: stage.color }}
      >
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-[11px] text-text-subtle font-medium">{stage.label}</p>
      <p className="text-[13px] font-bold mt-0.5" style={{ color: stage.color }}>
        {stage.value}
      </p>
    </div>
  );
};

const ActivePipeline = () => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <h3 className="text-[16px] font-semibold text-primary mb-4">
      Active Lead Pipeline
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {PIPELINE.map((s) => (
        <PipelineStage key={s.label} stage={s} />
      ))}
    </div>
  </div>
);

const InvoiceManagement = () => {
  const [tab, setTab] = useState("Pending");
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-semibold text-text">
          Invoice Management
        </h3>
        <div className="flex bg-bg-soft rounded-2xl p-1 gap-1">
          {INVOICE_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-[11px] font-semibold rounded-xl transition-colors ${
                tab === t
                  ? "bg-linear-to-r from-select-blue to-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INVOICES.map((inv) => (
          <div
            key={inv.title}
            className={`bg-bg-soft rounded-2xl border-l-4 ${inv.accent} p-5 flex flex-col gap-1`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-wider text-text-muted">
                {inv.title}
              </p>
              {inv.trend === "up" ? (
                <FiArrowUpRight size={14} className="text-emerald-500" />
              ) : (
                <FiArrowDownRight size={14} className="text-rose-500" />
              )}
            </div>
            <p className="text-2xl font-bold text-text">{inv.amount}</p>
            <p className={`text-[11px] ${inv.subColor}`}>{inv.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MaterialInventory = () => (
  <div className="bg-white rounded-2xl shadow-sm p-5 h-full">
    <h3 className="text-[16px] font-semibold text-text mb-4">
      Material Inventory
    </h3>
    <div className="space-y-3">
      {MATERIALS.map((m) => (
        <div
          key={m.code}
          className={`flex items-center gap-3 bg-bg-soft rounded-xl border-l-4 ${m.accent} px-3.5 py-3`}
        >
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-text-subtle shrink-0">
            <FiPackage size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-mono tracking-wider text-text-subtle">
              {m.code}
            </p>
            <p className="text-[13px] font-bold text-text truncate">
              {m.name}
            </p>
            <p className="text-[10px] text-text-muted">{m.note}</p>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              m.status === "in"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {m.status === "in" ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ProjectStatus = () => (
  <div className="bg-white rounded-2xl shadow-sm p-5 h-full">
    <h3 className="text-[16px] font-semibold text-text mb-4">
      Project Status &amp; Timeline
    </h3>
    <div className="space-y-3">
      {PROJECTS.map((p) => (
        <div
          key={p.code}
          className="flex items-center gap-3 bg-bg-soft rounded-xl px-3.5 py-3"
        >
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-text-subtle shrink-0">
            <FiFileText size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-mono tracking-wider text-text-subtle">
              {p.code}
            </p>
            <p className="text-[13px] font-bold text-text truncate">
              {p.name}
            </p>
            <p className="text-[10px] text-text-muted flex items-center gap-1 mt-0.5">
              <FiCalendar size={10} /> Target {p.target}
            </p>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <FiCheckCircle size={10} /> {p.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main ────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  return (
    <div className="h-full overflow-y-auto bg-overallbg p-1.5 font-manrope">
      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {STATS.map((s) => (
          <StatCard key={s.label} stat={s} />
        ))}
      </div>

      {/* Lead Distribution + Daily Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <LeadDistribution />
        <DailyActivity />
      </div>

      {/* Active Lead Pipeline */}
      <div className="mb-4">
        <ActivePipeline />
      </div>

      {/* Invoice Management */}
      <div className="mb-4">
        <InvoiceManagement />
      </div>

      {/* Material Inventory + Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MaterialInventory />
        <ProjectStatus />
      </div>
    </div>
  );
};

export default Dashboard;
