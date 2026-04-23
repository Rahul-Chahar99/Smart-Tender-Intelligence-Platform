import React, { useEffect, useState, useCallback } from "react";
import axios from "./axios.js";
import Container from "./Container/Container.jsx";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const inputClass =
  "bg-[#111111] border border-[#2a2a2a] text-[#f5f5f0] placeholder-[#a3a3a3] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#e8e8e0] transition w-full";

function Tenderlist() {
  const [tenders, setTenders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const userInfo = useSelector((state) => state.auth.userInfo);
  const userId = userInfo?._id;

  const fetchTenders = useCallback(async () => {
    if (!userId) return; // Wait until Redux provides the userId before fetching

    setIsLoading(true);
    try {
      const response = await axios.get(`/api/v1/company/tenders/${userId}`, {
        params: { page, limit, search, category, source }
      });
      const { tenders, total, totalPages } = response.data.data;
      setTenders(tenders);
      setTotal(total);
      setTotalPages(totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tenders");
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, search, category, source]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchTenders();
  }, [fetchTenders]);

  const formatValue = (value) =>
    value
      ? `₹${Number(value).toLocaleString("en-IN")}`
      : "N/A";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10">
      <Container>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#f5f5f0] tracking-tight">My Tenders</h1>
          <p className="text-[#a3a3a3] text-sm mt-1">
            {total} tender{total !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by title or description..."
            className={`${inputClass} max-w-sm`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filter by category..."
            className={`${inputClass} max-w-xs`}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          />
          <select
            className={`${inputClass} max-w-[160px]`}
            value={source}
            onChange={(e) => { setSource(e.target.value); setPage(1); }}
          >
            <option value="">All Sources</option>
            <option value="GeM">GeM</option>
            <option value="CPPP">CPPP</option>
            <option value="MockAPI">MockAPI</option>
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <ScaleLoader color="#e8e8e0" size={15} />
          </div>
        ) : tenders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a]">
            <span className="text-4xl mb-3">📋</span>
            <p className="text-[#a3a3a3] font-semibold">No tenders found</p>
            {searchInput && (
              <p className="text-[#a3a3a3]/50 text-sm mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tenders.map((tender) => (
              <div
                key={tender._id}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-all duration-200"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-[#f5f5f0] leading-snug">
                      {tender.title}
                    </h2>
                    <p className="text-xs text-[#a3a3a3] mt-1 line-clamp-2">
                      {tender.description || "No description available"}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {tender.matchScore !== undefined && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-400 border border-green-800/50">
                        Score: {tender.matchScore}
                      </span>
                    )}
                    {tender.source && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2a2a2a] text-[#a3a3a3] border border-[#3a3a3a]">
                        {tender.source}
                      </span>
                    )}
                    {tender.category && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#111111] text-[#a3a3a3] border border-[#2a2a2a]">
                        {tender.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Value</p>
                    <p className="text-sm font-semibold text-[#f5f5f0]">{formatValue(tender.value)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Submission</p>
                    <p className="text-sm font-semibold text-[#f5f5f0]">
                      {formatDate(tender.deadlines?.submissionDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Opening</p>
                    <p className="text-sm font-semibold text-[#f5f5f0]">
                      {formatDate(tender.deadlines?.openingDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-1">Tender ID</p>
                    <p className="text-sm font-semibold text-[#f5f5f0] truncate">{tender.tenderId}</p>
                  </div>
                </div>

                {/* Requirements */}
                {tender.requirements?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                    <p className="text-xs text-[#a3a3a3] uppercase tracking-wide mb-2">Requirements</p>
                    <div className="flex flex-wrap gap-2">
                      {tender.requirements[0]?.certifications?.map((cert) => (
                        <span
                          key={cert}
                          className="px-2 py-0.5 rounded text-xs bg-[#111111] text-[#a3a3a3] border border-[#2a2a2a]"
                        >
                          {cert}
                        </span>
                      ))}
                      {tender.requirements[0]?.turnover && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[#111111] text-[#a3a3a3] border border-[#2a2a2a]">
                          Min Turnover: {formatValue(tender.requirements[0].turnover)}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-[#a3a3a3]">
              Page <span className="text-[#f5f5f0] font-bold">{page}</span> of{" "}
              <span className="text-[#f5f5f0] font-bold">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f0] disabled:opacity-40 hover:bg-[#2a2a2a] transition"
              >
                « Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f0] disabled:opacity-40 hover:bg-[#2a2a2a] transition"
              >
                Next »
              </button>
            </div>
          </div>
        )}

      </Container>
    </div>
  );
}

export default Tenderlist;
