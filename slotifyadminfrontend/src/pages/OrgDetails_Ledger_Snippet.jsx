// ... (imports)
// Add these function helpers
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// ... inside OrgDetails function
const [activeTab, setActiveTab] = useState("overview"); // overview, ledger
const [ledgerData, setLedgerData] = useState({
  transactions: [],
  stats: {},
  totalPages: 1,
});
const [ledgerPage, setLedgerPage] = useState(1);
const [ledgerLoading, setLedgerLoading] = useState(false);

// ... fetchStats existing logic

const fetchLedger = async (pageNum = 1) => {
  setLedgerLoading(true);
  try {
    // Assuming api baseURL is /api/platform. We need to hit /api/payment/ledger?orgId=id
    // But api constant might be hardcoded to platform routes.
    // Let's check api definition.
    // const api = axios.create({ baseURL: "http://localhost:5000/api/platform" });
    // So we need a new axios call for payment route or use full URL.
    const res = await axios.get(
      `http://localhost:5000/api/payment/ledger?orgId=${id}&page=${pageNum}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("platform_token")}`,
        },
      }
    );
    setLedgerData(res.data.data);
    setLedgerPage(pageNum);
  } catch (err) {
    console.error("Failed to fetch ledger", err);
  } finally {
    setLedgerLoading(false);
  }
};

useEffect(() => {
  if (activeTab === "ledger") {
    fetchLedger(ledgerPage);
  }
}, [activeTab, ledgerPage, id]);

// ... Rendering Tabs
<div className="flex border-b border-gray-200 mb-6">
  <button
    onClick={() => setActiveTab("overview")}
    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
      activeTab === "overview"
        ? "border-indigo-600 text-indigo-600"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`}
  >
    Overview
  </button>
  <button
    onClick={() => setActiveTab("ledger")}
    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
      activeTab === "ledger"
        ? "border-indigo-600 text-indigo-600"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`}
  >
    Financial Ledger
  </button>
</div>;

// ... Conditional Rendering based on activeTab
{
  activeTab === "overview" ? (
    // ... existing stats content
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">...</div>
      <div className="mb-8">...</div>
      <div className="bg-white ...">...</div>
    </>
  ) : (
    // ... Ledger Content
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Ledger Table logic reused from Financials.jsx */}
      {/* ... */}
    </div>
  );
}
