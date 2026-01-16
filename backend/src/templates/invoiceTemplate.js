const formatINR = (amount = 0) =>
  `₹ ${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

module.exports = (booking) => {
  const invoiceNo = booking.bookingId || booking.id.slice(0, 8).toUpperCase();
  const invoiceDate = formatDate(new Date());
  const orgName = booking.Organization?.name || "Slotcore";
  const orgAddress = booking.Organization?.address || "-";
  const orgPhone = booking.Organization?.contactPhone || "-";
  const customerName = booking.customerName || "Guest";
  const customerEmail = booking.customerEmail || "-";
  const customerMobile = booking.customerMobile || "-";

  const paymentStatus = booking.paymentStatus?.toUpperCase() || "PENDING";
  const paymentMethod =
    booking.paymentMethod === "venue" ? "Pay at Venue" : "Online";
  const amount = booking.paymentAmount || 0;

  const getStatusColor = (status) => {
    if (status === "PAID") return "#27ab99";
    if (status === "PENDING") return "#f39c12";
    return "#e74c3c";
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoiceNo}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      color: #555;
      max-width: 800px;
      margin: auto;
      padding: 30px;
      font-size: 16px;
      line-height: 24px;
    }
    .invoice-box {
      // border: 1px solid #eee;
      // box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
      // padding: 30px;
      // border-radius: 8px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      color: #333;
    }
    .header .meta {
      text-align: right;
      font-size: 14px;
    }
    .section-title {
      font-weight: bold;
      text-transform: uppercase;
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }
    .details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .details .col {
      width: 48%;
    }
    .details .col p {
      margin: 0;
    }
    table {
      width: 100%;
      line-height: inherit;
      text-align: left;
      border-collapse: collapse;
    }
    table td {
      padding: 10px;
      vertical-align: top;
      border-bottom: 1px solid #eee;
    }
    table tr.heading td {
      background: #eee;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }
    table tr.total td {
      border-top: 2px solid #eee;
      font-weight: bold;
      font-size: 18px;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      background: ${getStatusColor(paymentStatus)};
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 12px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <div>
        <h1>${orgName}</h1>
        <p>${orgAddress}</p>
        <p>${orgPhone}</p>
      </div>
      <div class="meta">
        <p><strong>Invoice #:</strong> ${invoiceNo}</p>
        <p><strong>Date:</strong> ${invoiceDate}</p>
        <div class="status-badge">${paymentStatus}</div>
      </div>
    </div>

    <div class="details">
      <div class="col">
        <div class="section-title">Bill To</div>
        <p><strong>${customerName}</strong></p>
        <p>${customerEmail}</p>
        <p>${customerMobile}</p>
      </div>
      <div class="col" style="text-align: right;">
        <div class="section-title">Payment Info</div>
        <p>Method: ${paymentMethod}</p>
        ${
          booking.Payment?.paymentId
            ? `<p>ID: ${booking.Payment.paymentId}</p>`
            : ""
        }
      </div>
    </div>

    <table>
      <tr class="heading">
        <td>Item</td>
        <td style="text-align: right;">Price</td>
      </tr>

      <tr class="item">
        <td>${
          booking.Service?.name || "Service Booking"
        } <br/> <small>${formatDate(booking.startTime)}</small></td>
        <td style="text-align: right;">${formatINR(amount)}</td>
      </tr>

      <tr class="total">
        <td></td>
        <td style="text-align: right;">Total: ${formatINR(amount)}</td>
      </tr>
    </table>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>This is a system generated invoice.</p>
    </div>
  </div>
</body>
</html>
  `;
};
