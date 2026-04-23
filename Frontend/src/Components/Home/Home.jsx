import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Container from "../Container/Container.jsx";
import { GridLoader } from "react-spinners";
import toast from "react-hot-toast";

// ─── Static Data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: "⚡",
    title: "Real-Time Aggregation",
    description:
      "Automatically pulls tenders from GeM, CPPP, and state portals the moment they go live.",
  },
  {
    icon: "🤖",
    title: "AI Eligibility Scoring",
    description:
      "Our engine scores each tender against your company profile — turnover, certifications, and past performance.",
  },
  {
    icon: "🔔",
    title: "Smart Alerts",
    description:
      "Get notified instantly via email or dashboard when a high-match tender drops in your category.",
  },
  {
    icon: "📊",
    title: "Bid Analytics",
    description:
      "Track win rates, competitor patterns, and deadline timelines with visual dashboards.",
  },
  {
    icon: "🔍",
    title: "Full-Text Search",
    description:
      "Search across thousands of tenders by keyword, category, value range, or deadline.",
  },
  {
    icon: "🔒",
    title: "Secure & Compliant",
    description:
      "Enterprise-grade security with role-based access for your entire procurement team.",
  },
];

const stats = [
  { value: "50,000+", label: "Tenders Indexed" },
  { value: "1,200+", label: "Companies Onboarded" },
  { value: "98%", label: "Match Accuracy" },
  { value: "₹2,400 Cr+", label: "Bid Value Tracked" },
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description:
      "Enter your company details — turnover, certifications, categories, and past projects.",
  },
  {
    step: "02",
    title: "Set Your Preferences",
    description:
      "Choose sectors, value ranges, and geographies. We filter the noise for you.",
  },
  {
    step: "03",
    title: "Get Matched Tenders",
    description:
      "Receive a curated feed of tenders scored by eligibility and strategic fit.",
  },
  {
    step: "04",
    title: "Track & Win",
    description:
      "Manage your pipeline, set reminders, and analyse your bid performance over time.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Procurement Head, TechBuild Ltd.",
    quote:
      "We went from missing deadlines to winning 3 government contracts in the first quarter. The AI scoring is a game-changer.",
  },
  {
    name: "Rajesh Kumar",
    role: "Director, Infra Solutions Pvt. Ltd.",
    quote:
      "The real-time alerts saved us countless hours of manual portal checking. Highly recommended for any serious bidder.",
  },
  {
    name: "Anita Verma",
    role: "CEO, GreenTech Enterprises",
    quote:
      "Finally a platform that understands SME constraints. The eligibility filter alone is worth the subscription.",
  },
];

// ─── Engineer Dashboard (unchanged logic, updated styles) ────────────────────

function EngineerDashboard({ userInfo }) {
  const [allBookingRequest, setAllBookingRequst] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [acceptedIds, setAcceptedIds] = useState(new Set());
  const limit = 5;
  const isPending = inputValue !== searchQuery;

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (page !== 1) setPage(1);
  };

  useEffect(() => {
    if (!userInfo?._id) return;
    const getBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/v1/engineerHome/bookingRequests/${userInfo._id}?page=${page}&limit=${limit}&search=${searchQuery}`,
        );
        const result = response.data.data;
        setAllBookingRequst(result.data);
        setDataSource(result.source);
        setTotalPages(result.totalPages);
        setTotalRecords(result.totalRecords);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to fetch booking requests");
      } finally {
        setLoading(false);
      }
    };
    getBookings();
    const interval = setInterval(getBookings, 600000);
    return () => clearInterval(interval);
  }, [userInfo?._id, page, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(inputValue), 700);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const rejectOrAcceptBookingRequest = async (bookingId, status) => {
    try {
      const response = await axios.patch(
        `/api/v1/engineerHome/rejectOrAcceptBooking-requests/${bookingId}`,
        { status },
      );
      const engineerAssign = response.data.data.engineerAssign;
      if (engineerAssign === "Rejected_By_Engineer") {
        setAllBookingRequst((prev) => prev.filter((r) => r._id !== bookingId));
        toast.success("Booking request rejected");
      } else if (engineerAssign === "Accepted") {
        setAllBookingRequst((prev) =>
          prev.map((r) =>
            r._id === bookingId ? { ...r, engineerAssign: "Accepted" } : r,
          ),
        );
        setAcceptedIds((prev) => new Set(prev).add(bookingId));
        toast.success("Booking request accepted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <Container>
      <div className="w-full py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#f5f5f0]">
              Welcome, {userInfo?.fullName} 👋
            </h1>
            <p className="text-[#a3a3a3] text-sm mt-1">Your assigned booking requests</p>
          </div>
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by branch name or code…"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f0] placeholder-[#a3a3a3] rounded-lg px-4 py-2 focus:outline-none focus:border-[#e8e8e0] transition-all duration-300"
              value={inputValue}
              onChange={handleChange}
            />
            {isPending && (
              <span className="absolute right-3 top-2.5 w-4 h-4 border-2 border-[#f5f5f0] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#a3a3a3]">
              {totalRecords} record{totalRecords !== 1 ? "s" : ""}
            </span>
            {dataSource && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                dataSource.toLowerCase() === "redis"
                  ? "bg-green-900/40 text-green-400 border border-green-800"
                  : "bg-blue-900/40 text-blue-400 border border-blue-800"
              }`}>
                ⚡ {dataSource}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {loading && allBookingRequest.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <GridLoader color="#e8e8e0" size={15} />
          </div>
        ) : allBookingRequest.length > 0 ? (
          <div className={`space-y-4 transition-opacity duration-200 ${isPending || loading ? "opacity-50" : "opacity-100"}`}>
            {allBookingRequest.map((request) => {
              const isAccepted = acceptedIds.has(request._id) || request.engineerAssign === "Accepted";
              return (
                <div key={request._id} className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#111111] border-b border-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#f5f5f0] font-bold text-lg">
                        {request.customerId?.fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-bold text-[#f5f5f0] leading-tight">{request.customerId?.fullName || "N/A"}</p>
                        <p className="text-xs text-[#a3a3a3]">{request.customerId?.email || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.engineerAssign === "Accepted"
                          ? "bg-green-900/40 text-green-400 border border-green-800"
                          : request.engineerAssign === "Rejected_By_Engineer"
                          ? "bg-red-900/40 text-red-400 border border-red-800"
                          : "bg-blue-900/40 text-blue-400 border border-blue-800"
                      }`}>
                        🔧 {request.engineerAssign}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2a2a2a] text-[#f5f5f0]">
                        {request.totalCostOfBooking?.toLocaleString("en-IN", { style: "currency", currency: "INR" }) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">👤 Customer</h3>
                      <div>
                        <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Mobile</p>
                        <p className="font-semibold text-[#f5f5f0]">{request.customerId?.mobileNo || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Local Contact</p>
                        <p className="font-semibold text-[#f5f5f0]">{request.localContact || "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">🏢 Branch</h3>
                      <div>
                        <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Branch Name</p>
                        <p className="font-semibold text-[#f5f5f0]">{request.branchName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Branch Code</p>
                        <p className="font-semibold text-[#f5f5f0]">{request.branchCode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Address</p>
                        <p className="font-semibold text-[#f5f5f0]">{request.address}</p>
                      </div>
                      {request.branchId?.branchLocationGoogleLink && (
                        <a href={request.branchId.branchLocationGoogleLink} target="_blank" rel="noopener noreferrer" className="text-[#e8e8e0] text-sm hover:text-white font-semibold underline underline-offset-2">
                          📍 View on Maps
                        </a>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3]">📅 Schedule</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Start Date</p>
                          <p className="font-semibold text-[#f5f5f0]">{new Date(request.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">End Date</p>
                          <p className="font-semibold text-[#f5f5f0]">{new Date(request.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Start Time</p>
                          <p className="font-semibold text-[#f5f5f0]">{request.startTime || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">End Time</p>
                          <p className="font-semibold text-[#f5f5f0]">{request.endTime || "N/A"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Requested On</p>
                        <p className="font-semibold text-[#f5f5f0]">{request.createdAt ? new Date(request.createdAt).toLocaleString() : "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="bg-[#111111] px-6 py-4 border-t border-[#2a2a2a] flex flex-wrap gap-3 items-center justify-end">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-900/40 text-red-400 border border-red-800 hover:bg-red-900/60 transition"
                      onClick={() => rejectOrAcceptBookingRequest(request._id, "rejected")}
                    >
                      ✖ Reject
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        isAccepted
                          ? "bg-green-900/40 text-green-400 border border-green-800 cursor-not-allowed"
                          : "bg-[#f5f5f0] text-[#0a0a0a] hover:bg-white"
                      }`}
                      onClick={() => rejectOrAcceptBookingRequest(request._id, "accepted")}
                      disabled={isAccepted}
                    >
                      {isAccepted ? "✅ Accepted" : "✔ Accept"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] gap-3">
            <span className="text-5xl">📋</span>
            <p className="text-[#a3a3a3] text-lg font-semibold">No booking requests found</p>
            {inputValue && <p className="text-[#a3a3a3]/50 text-sm">Try a different search term</p>}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <p className="text-sm text-[#a3a3a3]">
            Total: <span className="font-bold text-[#f5f5f0]">{totalRecords}</span> records
          </p>
          <div className="flex gap-1">
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f0] disabled:opacity-40 hover:bg-[#2a2a2a] transition"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              « Prev
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#a3a3a3] pointer-events-none">
              {page} / {totalPages}
            </button>
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f0] disabled:opacity-40 hover:bg-[#2a2a2a] transition"
              disabled={page >= totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

// ─── Landing Page ────────────────────────────────────────────────────────────

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0a0a0a] text-[#f5f5f0]">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f5f5f0 1px, transparent 1px), linear-gradient(90deg, #f5f5f0 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#2a2a2a] text-xs font-semibold tracking-widest uppercase text-[#a3a3a3]">
            AI-Powered Tender Intelligence
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Win More{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5f5f0] to-[#a3a3a3]">
              Government Tenders
            </span>
            <br />
            With Smart AI
          </h1>
          <p className="text-lg sm:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-10 leading-relaxed">
            Aggregate tenders from GeM, CPPP & state portals. Score eligibility
            instantly. Never miss a deadline again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 rounded-xl bg-[#f5f5f0] text-[#0a0a0a] font-bold text-base hover:bg-white transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
            >
              Start For Free →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-xl bg-transparent border border-[#2a2a2a] text-[#f5f5f0] font-bold text-base hover:border-[#a3a3a3] transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-[#2a2a2a] bg-[#111111]">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#2a2a2a]">
            {stats.map((s) => (
              <div key={s.label} className="py-10 px-6 text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f0] mb-1">
                  {s.value}
                </p>
                <p className="text-sm text-[#a3a3a3] font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f0] mb-4">
              Everything You Need to Bid Smarter
            </h2>
            <p className="text-[#a3a3a3] max-w-xl mx-auto">
              One platform to discover, evaluate, and track every tender
              opportunity relevant to your business.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-[#f5f5f0] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#a3a3a3] text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 bg-[#111111] border-y border-[#2a2a2a]">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f0] mb-4">
              How It Works
            </h2>
            <p className="text-[#a3a3a3] max-w-xl mx-auto">
              Get up and running in minutes. No complex setup required.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[#2a2a2a] z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#a3a3a3] font-mono font-bold text-sm mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-base font-bold text-[#f5f5f0] mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-4">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f0] mb-4">
              Trusted by Procurement Teams
            </h2>
            <p className="text-[#a3a3a3] max-w-xl mx-auto">
              Companies across India use our platform to stay ahead in
              government procurement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-4"
              >
                <p className="text-[#a3a3a3] text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
                  <p className="font-bold text-[#f5f5f0] text-sm">{t.name}</p>
                  <p className="text-[#a3a3a3] text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-[#111111] border-t border-[#2a2a2a]">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f0] mb-4">
              Ready to Win Your Next Tender?
            </h2>
            <p className="text-[#a3a3a3] mb-10">
              Join 1,200+ companies already using Smart Tender Intelligence to
              discover and win government contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 rounded-xl bg-[#f5f5f0] text-[#0a0a0a] font-bold text-base hover:bg-white transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
              >
                Get Started Free →
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 rounded-xl border border-[#2a2a2a] text-[#f5f5f0] font-bold text-base hover:border-[#a3a3a3] transition-all duration-200"
              >
                Sign In
              </button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

function Home() {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo?.role === "engineer") {
    return <EngineerDashboard userInfo={userInfo} />;
  }

  return <LandingPage />;
}

export default React.memo(Home);
