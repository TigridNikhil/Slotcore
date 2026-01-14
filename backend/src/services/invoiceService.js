const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const getChromeExecutablePath = () => {
  const platform = process.platform;
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (platform === "win32") {
    // Windows default Chrome paths
    const suffix = "\\Google\\Chrome\\Application\\chrome.exe";
    const prefixes = [
      process.env.LOCALAPPDATA,
      process.env.PROGRAMFILES,
      process.env["PROGRAMFILES(X86)"],
    ];
    for (const prefix of prefixes) {
      if (!prefix) continue;
      const fullPath = path.join(prefix, suffix);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
  } else if (platform === "linux") {
    // Linux default Chrome paths
    const paths = [
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }
  } else if (platform === "darwin") {
    // macOS default Chrome path
    const macPath =
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    if (fs.existsSync(macPath)) {
      return macPath;
    }
  }
  return null;
};

exports.createInvoice = async (data, res) => {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      background: #f3f4f6;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #374151;
    }

    .invoice-wrapper {
      max-width: 900px;
      margin: 40px auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .brand {
      font-size: 32px;
      font-weight: 800;
      color: #4f46e5;
    }

    .invoice-meta {
      text-align: right;
      font-size: 14px;
      color: #6b7280;
    }

    .invoice-meta strong {
      color: #111827;
    }

    .info-grid {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }

    .info-card {
      flex: 1;
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      font-size: 14px;
    }

    .info-card h4 {
      margin: 0 0 6px 0;
      font-size: 13px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 14px;
    }

    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    td.amount,
    th.amount {
      text-align: right;
    }

    .total-row td {
      border-top: 2px solid #111827;
      font-weight: bold;
      font-size: 16px;
    }

    .total-row td.amount {
      color: #4f46e5;
    }

    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">

    <!-- Header -->
    <div class="header">
      <div class="brand">Slotcore</div>
      <div class="invoice-meta">
        <div><strong>Invoice #:</strong> ${data.invoiceId}</div>
        <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
      </div>
    </div>

    <!-- Info -->
    <div class="info-grid">
      <div class="info-card">
        <h4>Billed From</h4>
        Slotcore Platform<br/>
        123 Tech Park<br/>
        Bangalore, Karnataka
      </div>
      <div class="info-card">
        <h4>Billed To</h4>
        ${data.orgName}<br/>
        Org ID: ${data.orgId}
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="amount">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${data.items
          .map(
            (item) => `
        <tr>
          <td>${item.description}</td>
          <td class="amount">${item.amount}</td>
        </tr>
        `
          )
          .join("")}

        <tr class="total-row">
          <td>Total</td>
          <td class="amount">₹${data.totalAmount}</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      This is a system-generated invoice. No signature required.<br/>
      © Slotcore Platform
    </div>

  </div>
</body>
</html>
`;

    // Launch Puppeteer and generate PDF
    const launchOptions = {
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
    const executablePath = getChromeExecutablePath();
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${data.invoiceId}.pdf`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ error: "Failed to generate PDF invoice" });
  }
};

exports.createLedgerPdf = async (data, res) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8" />
          <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; }
              .container { width: 100%; max-width: 1000px; margin: auto; padding: 20px; }
              h1 { color: #4F46E5; margin-bottom: 5px; }
              .header { margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
              th { background: #F3F4F6; text-align: left; padding: 10px; border-bottom: 2px solid #E5E7EB; color: #374151; }
              td { padding: 8px 10px; border-bottom: 1px solid #E5E7EB; }
              .text-right { text-align: right; }
              .text-center { text-align: center; }
              .badge { display: inline-block; px: 6px; py: 2px; border-radius: 999px; font-size: 10px; font-weight: bold; }
              .badge-green { background: #D1FAE5; color: #065F46; }
              .badge-yellow { background: #FEF3C7; color: #92400E; }
              .badge-red { background: #FEE2E2; color: #991B1B; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Financial Ledger Report</h1>
                  <p><strong>Organization:</strong> ${data.orgName} (${
      data.orgId
    })</p>
                  <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                  <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; flex: 1;">
                      <p style="margin: 0; color: #6B7280; font-size: 12px;">Total Earnings</p>
                      <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #111827;">${
                        data.stats.totalEarnings
                      }</p>
                  </div>
                   <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; flex: 1;">
                      <p style="margin: 0; color: #6B7280; font-size: 12px;">Total Gross</p>
                      <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #111827;">${
                        data.stats.totalGross
                      }</p>
                  </div>
                   <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; flex: 1;">
                      <p style="margin: 0; color: #6B7280; font-size: 12px;">Pending Payout</p>
                      <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #059669;">${
                        data.stats.pendingPayout
                      }</p>
                  </div>
                   <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; flex: 1;">
                      <p style="margin: 0; color: #6B7280; font-size: 12px;">Pending Collection</p>
                      <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #DC2626;">${
                        data.stats.pendingCollection
                      }</p>
                  </div>
              </div>

              <table>
                  <thead>
                      <tr>
                          <th>Date</th>
                          <th>Booking</th>
                          <th>Mode</th>
                          <th class="text-right">Gross</th>
                          <th class="text-right">Commission</th>
                          <th class="text-right">Net</th>
                          <th class="text-center">Direction</th>
                          <th class="text-center">Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${data.transactions
                        .map(
                          (t) => `
                      <tr>
                          <td>${new Date(t.date).toLocaleDateString()}</td>
                          <td>${t.booking || "-"}</td>
                          <td>${t.mode}</td>
                          <td class="text-right">${t.gross}</td>
                          <td class="text-right">${t.commission}</td>
                          <td class="text-right" style="font-weight: bold;">${
                            t.net
                          }</td>
                          <td class="text-center">${
                            t.direction === "PLATFORM_PAYS_VENDOR"
                              ? "Payout"
                              : "Collection"
                          }</td>
                          <td class="text-center">
                              <span class="badge ${
                                t.status === "SETTLED"
                                  ? "badge-green"
                                  : "badge-yellow"
                              }">${t.status}</span>
                          </td>
                      </tr>
                      `
                        )
                        .join("")}
                  </tbody>
              </table>
              
               <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #9CA3AF;">
                 Slotcore Platform • Financial Ledger Export
              </div>
          </div>
      </body>
      </html>
    `;

    const launchOptions = {
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    };
    const executablePath = getChromeExecutablePath();
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Ledger-${data.orgId}.pdf`
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Ledger PDF Error:", error);
    res.status(500).json({ error: "Failed to generate Ledger PDF" });
  }
};
