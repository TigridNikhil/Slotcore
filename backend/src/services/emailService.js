const nodemailer = require("nodemailer");

// Create Transporter
// Ensure these ENV vars are set in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
const calendarUtils = require("../utils/calendarUtils");

exports.sendBookingConfirmation = async (booking, service, org) => {
  try {
    const formattedDate = new Date(booking.startTime).toLocaleString();
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      org.address || "",
    )}`;

    // Generate Calendar Links
    const googleCalendarLink = calendarUtils.generateGoogleCalendarLink(
      booking,
      service,
      org,
    );
    const icsContent = calendarUtils.generateICS(booking, service, org);
    const html = `
<div style="background:#f4f6fb;padding:24px 0;">
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.05);">

    <!-- Header -->
    <div style="background:${org.primaryColor || "#4F46E5"};padding:24px;text-align:center;">
      <h1 style="margin:0;font-size:22px;color:#ffffff;letter-spacing:0.5px;">
        ${org.name}
      </h1>
      <p style="margin:6px 0 0;color:#e0e7ff;font-size:14px;">
        Appointment Confirmation
      </p>
    </div>

    <!-- Body -->
    <div style="padding:28px;">
      <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">
        Booking Confirmed ✅
      </h2>

      <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.6;">
        Hi <strong>${booking.customerName}</strong>,<br/>
        Your appointment for <strong>${service.name}</strong> has been successfully scheduled.
      </p>

      <!-- Booking Card -->
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin:20px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;">
          <tr>
            <td style="padding:6px 0;"><strong>📅 Date</strong></td>
            <td style="padding:6px 0;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;"><strong>🆔 Booking ID</strong></td>
            <td style="padding:6px 0;">${booking.bookingId || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;"><strong>🕒 Duration</strong></td>
            <td style="padding:6px 0;">${service.durationMin} mins</td>
          </tr>
          <tr>
            <td style="padding:6px 0;"><strong>📍 Location</strong></td>
            <td style="padding:6px 0;">${org.address || "Online / TBD"}</td>
          </tr>
          ${
            booking.customerMobile
              ? `<tr>
                  <td style="padding:6px 0;"><strong>📱 Mobile</strong></td>
                  <td style="padding:6px 0;">${booking.customerMobile}</td>
                </tr>`
              : ""
          }
          <tr>
            <td style="padding:6px 0;"><strong>💰 Price</strong></td>
            <td style="padding:6px 0;">
              ${service.price > 0 ? `${service.price}` : "Free"}
            </td>
          </tr>
        </table>
      </div>

      <!-- Actions -->
      <div style="text-align:center;margin:28px 0;">
        <a href="${mapLink}" 
           style="display:inline-block;background:${org.primaryColor || "#4F46E5"};color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:14px;margin:6px;">
          📍 Get Directions
        </a>

        <a href="${googleCalendarLink}" 
           style="display:inline-block;background:#ffffff;color:${org.primaryColor || "#4F46E5"};border:1px solid ${org.primaryColor || "#4F46E5"};text-decoration:none;padding:12px 22px;border-radius:6px;font-size:14px;margin:6px;">
          📅 Add to Google Calendar
        </a>

        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/review/${booking.id}" 
           style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-size:14px;margin:6px;">
          ⭐ Write a Review
        </a>
      </div>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">

      <!-- Footer -->
      <p style="font-size:12px;color:#6b7280;text-align:center;line-height:1.5;">
        Need to reschedule or manage your booking?<br/>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/booking/${booking.id}" 
           style="color:${org.primaryColor || "#4F46E5"};text-decoration:none;">
          Manage your booking
        </a>
        or reply to this email.
      </p>
    </div>
      
      <!-- Mobile App Promo -->
      <div style="text-align:center;padding:20px;background:#eef2ff;border-top:1px solid #e0e7ff;">
        <p style="margin:0 0 10px;font-size:14px;color:#4338ca;font-weight:600;">Get the full experience on mobile 📱</p>
        <p style="margin:0 0 15px;font-size:13px;color:#6b7280;">Manage bookings, receive notifications, and more.</p>
        <div>
            <a href="#" style="display:inline-block;margin:0 5px;text-decoration:none;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" height="40" alt="Get it on Google Play">
            </a>
            <a href="#" style="display:inline-block;margin:0 5px;text-decoration:none;">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" height="40" alt="Download on the App Store">
            </a>
        </div>
      </div>
    </div>
  </div>
</div>
`;

    const info = await transporter.sendMail({
      from: `"${org.name}" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: `Booking Confirmed: ${service.name} at ${org.name}`,
      html: html,
      attachments: [
        {
          filename: "event.ics",
          content: icsContent,
          contentType: "text/calendar",
        },
      ],
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
};

exports.sendDailyReport = async (org, stats) => {
  if (!org.contactEmail) return;

  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: ${
          org.primaryColor || "#333"
        };">Daily Activity Report 📊</h2>
        <p>Here is the summary for <strong>${new Date().toLocaleDateString()}</strong>.</p>
        
        <div style="display: flex; justify-content: space-around; margin: 20px 0;">
            <div style="text-align: center; background: #f0f9ff; padding: 15px; border-radius: 8px; width: 45%;">
                <h3 style="margin: 0; color: #0284c7;">${
                  stats.totalBookings
                }</h3>
                <p style="margin: 5px 0 0; font-size: 14px; color: #666;">New Bookings</p>
            </div>
            <div style="text-align: center; background: #ecfccb; padding: 15px; border-radius: 8px; width: 45%;">
                <h3 style="margin: 0; color: #65a30d;">${
                  stats.totalRevenue
                }</h3>
                <p style="margin: 5px 0 0; font-size: 14px; color: #666;">Estimated Revenue</p>
            </div>
        </div>

        <p style="font-size: 14px; color: #666;">Login to your dashboard for more details.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Slotcore Reports" <${process.env.SMTP_USER}>`,
      to: org.contactEmail,
      subject: `Daily Report: ${org.name}`,
      html: html,
    });
  } catch (error) {
    console.error("Report Email Error:", error);
  }
};

exports.sendBookingCancellation = async (booking, org, reason) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #ef4444;">Booking Cancelled ❌</h2>
        <p>Hi ${booking.customerName},</p>
        <p>Your appointment on <strong>${new Date(
          booking.startTime,
        ).toLocaleString()}</strong> at <strong>${org.name}</strong> (ID: ${
          booking.bookingId || "N/A"
        }) has been cancelled.</p>
        
        ${
          reason
            ? `<div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #fecaca; color: #991b1b;">
            <strong>Reason for cancellation:</strong><br/>
            ${reason}
        </div>`
            : ""
        }

        <p>If you believe this is a mistake or wish to re-book, please contact us at <a href="mailto:${
          org.contactEmail
        }">${org.contactEmail}</a>.</p>
        
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>
         <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>

        <div style="margin-top:25px;padding-top:20px;border-top:1px solid #eee;text-align:center;">
             <p style="font-size:12px;color:#888;">Download the Slotcore App for easier booking management.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${org.name}" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: `Booking Cancelled: ${org.name}`,
      html: html,
    });
    return true;
  } catch (error) {
    console.error("Cancellation Email Error:", error);
    return false;
  }
};

exports.sendBookingReschedule = async (booking, org, newTime) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Booking Rescheduled 🗓️</h2>
        <p>Hi ${booking.customerName},</p>
        <p>Your appointment at <strong>${org.name}</strong> (ID: ${
          booking.bookingId || "N/A"
        }) has been rescheduled.</p>
        
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #dbeafe;">
            <p style="font-size: 16px; color: #1e40af; margin-bottom: 5px;"><strong>New Time:</strong></p>
            <p style="font-size: 20px; font-weight: bold; margin: 0; color: #1e3a8a;">${new Date(
              newTime,
            ).toLocaleString()}</p>
        </div>

        <p>If this time doesn't work for you, please contact us or reply to this email.</p>
        
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>
         <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>
        
        <div style="margin-top:25px;padding-top:20px;border-top:1px solid #eee;text-align:center;">
             <p style="font-size:12px;color:#888;">Download the Slotcore App for easier booking management.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${org.name}" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: `Rescheduled: Your Appointment at ${org.name}`,
      html: html,
    });
    return true;
  } catch (error) {
    console.error("Reschedule Email Error:", error);
    return false;
  }
};

exports.sendTeamInvitation = async (user, password, orgName) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4F46E5;">Welcome to ${orgName}! 👋</h2>
        <p>Hi ${user.name},</p>
        <p>You have been invited to join the <strong>${orgName}</strong> team on Slotcore.</p>
        
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #bbf7d0;">
            <p style="margin-bottom: 5px;"><strong>Your Login Credentials:</strong></p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <code>${password}</code></p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">(Please change your password after logging in)</p>
        </div>

        <p><a href="${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/login" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a></p>
        
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
           Welcome aboard!<br/>
           The ${orgName} Team
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${orgName}" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `You've been invited to join ${orgName}`,
      html: html,
    });
    console.log(`[Email] Invitation sent to ${user.email}`);
    return true;
  } catch (error) {
    return false;
  }
};

exports.sendBookingReminder = async (booking, org, type) => {
  try {
    const timeLabel = type === "24h" ? "Tomorrow" : "Coming up soon";
    const subject = `Reminder: Your appointment is ${
      type === "24h" ? "tomorrow" : "in 1 hour"
    } ⏰`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: ${
          org.primaryColor || "#F59E0B"
        };">Appointment Reminder</h2>
        <p>Hi ${booking.customerName},</p>
        <p>This is a reminder for your upcoming appointment at <strong>${
          org.name
        }</strong>.</p>
        
        <div style="background-color: #fffbeb; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #fcd34d;">
            <p style="font-size: 16px; margin-bottom: 5px;"><strong>Date & Time:</strong></p>
            <p style="font-size: 18px; font-weight: bold; margin: 0; color: #92400e;">${new Date(
              booking.startTime,
            ).toLocaleString()}</p>
        </div>

        <p>We look forward to seeing you!</p>
        
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>
         <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>

        <div style="margin-top:25px;padding-top:20px;border-top:1px solid #eee;text-align:center;">
             <p style="font-size:12px;color:#888;">Track your appointments on the Slotcore Mobile App 📱</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${org.name}" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: subject,
      html: html,
    });
    console.log(`[Email] Reminder (${type}) sent to ${booking.customerEmail}`);
    return true;
  } catch (error) {
    return false;
  }
};

exports.sendSettlementReminder = async (org, ledger, amount) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #EF4444;">Settlement Reminder ⚠️</h2>
        <p>Hi ${org.name},</p>
        <p>This is a reminder regarding an outstanding commission payment due to the platform.</p>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #fecaca;">
            <p style="font-size: 16px; margin-bottom: 5px;"><strong>Amount Due:</strong></p>
            <p style="font-size: 24px; font-weight: bold; margin: 0; color: #dc2626;">₹${amount}</p>
            <p style="font-size: 14px; color: #7f1d1d; margin-top: 5px;">Booking ID: ${
              ledger.bookingId || "N/A"
            }</p>
        </div>

        <p>Please log in to your dashboard to view details and settle this amount.</p>
        
        <p><a href="${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/dashboard/payments" style="background-color: #EF4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Payments</a></p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Slotcore Platform" <${process.env.SMTP_USER}>`,
      to: org.contactEmail,
      subject: `Action Required: Settlement Due of ₹${amount}`,
      html: html,
    });
    console.log(`[Email] Settlement reminder sent to ${org.contactEmail}`);
    return true;
  } catch (error) {
    console.error("Settlement Email Error:", error);
    return false;
  }
};

exports.sendMonthlySettlementReminder = async (org, totalAmount, count) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #EF4444;">Monthly Settlement Due 📊</h2>
        <p>Hi ${org.name},</p>
        <p>This is a summary reminder of your total outstanding commission payments due to the platform.</p>
        
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #fecaca; text-align: center;">
            <p style="font-size: 16px; margin-bottom: 5px;"><strong>Total Amount Due:</strong></p>
            <p style="font-size: 32px; font-weight: bold; margin: 0; color: #dc2626;">₹${totalAmount}</p>
            <p style="font-size: 14px; color: #7f1d1d; margin-top: 10px;">Pending Transactions: ${count}</p>
        </div>

        <p>Please log in to your dashboard to review the detailed ledger and settle these amounts.</p>
        
        <p style="text-align: center;"><a href="${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/dashboard/payments" style="background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Payment Dashboard</a></p>
        
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
           If you have already made the payment, please ignore this email or contact support.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Slotcore Accounts" <${process.env.SMTP_USER}>`,
      to: org.contactEmail,
      subject: `Urgent: Total Settlement Due ₹${totalAmount}`,
      html: html,
    });
    return true;
  } catch (error) {
    console.error("Monthly Reminder Error:", error);
    return false;
  }
};

exports.sendOtp = async (email, otp) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #4F46E5;">Login Verification 🔐</h2>
        <p>Hi there,</p>
        <p>Use the code below to log in to <strong>Slotcore</strong>.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center; letter-spacing: 4px;">
            <span style="font-size: 32px; font-weight: bold; color: #0284c7;">${otp}</span>
        </div>

        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
        
        <p style="font-size: 13px; color: #999; margin-top: 30px; text-align: center;">
           Slotcore Secure Login
        </p>
      </div>
      
       <div style="text-align:center;padding-top:10px;">
        <p style="font-size:12px;color:#aaa;">Did you know? You can also login via the Mobile App.</p>
       </div>
    `;

    await transporter.sendMail({
      from: `"Slotcore Auth" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Login Code: ${otp}`,
      html: html,
    });
    console.log(`[Email] OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("OTP Email Error:", error);
    return false;
  }
};
