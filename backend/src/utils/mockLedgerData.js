// utils/mockLedgerData.js
const generateLedgerTestData = (count = 55) => {
  const modes = ["VENUE", "ONLINE", "CASH", "UPI"];
  const statuses = ["SETTLED", "UNSETTLED"];
  const directions = ["PLATFORM_PAYS_VENDOR", "VENDOR_PAYS_PLATFORM"];

  let totalGross = 0;
  let totalCommission = 0;
  let totalNet = 0;
  let pendingPayout = 0;
  let pendingCollection = 0;

  const transactions = Array.from({ length: count }).map((_, i) => {
    const gross = Math.floor(Math.random() * 5000) + 500;
    const commission = Math.floor(gross * 0.1);
    const net = gross - commission;

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];

    totalGross += gross;
    totalCommission += commission;
    totalNet += net;

    if (status === "UNSETTLED") {
      if (direction === "PLATFORM_PAYS_VENDOR") {
        pendingPayout += net;
      } else {
        pendingCollection += commission;
      }
    }

    return {
      date: new Date(Date.now() - i * 86400000), // past days
      booking: `BOOK-${1000 + i}`,
      mode: modes[Math.floor(Math.random() * modes.length)],
      gross: `₹${gross.toLocaleString("en-IN")}`,
      commission: `₹${commission.toLocaleString("en-IN")}`,
      net: `₹${net.toLocaleString("en-IN")}`,
      direction,
      status,
    };
  });

  return {
    orgName: "Test Organization Pvt Ltd",
    orgId: "ORG-TEST-001",
    stats: {
      totalEarnings: `₹${totalNet.toLocaleString("en-IN")}`,
      totalGross: `₹${totalGross.toLocaleString("en-IN")}`,
      pendingPayout: `₹${pendingPayout.toLocaleString("en-IN")}`,
      pendingCollection: `₹${pendingCollection.toLocaleString("en-IN")}`,
    },
    transactions,
  };
};

module.exports = { generateLedgerTestData };
