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

exports.sendBookingConfirmation = async (booking, service, org) => {
  try {
    const formattedDate = new Date(booking.startTime).toLocaleString();
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      org.address || ""
    )}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid ${
          org.primaryColor || "#4F46E5"
        };">
           <h1 style="color: ${org.primaryColor || "#333"};">${org.name}</h1>
        </div>
        
        <h2>Booking Confirmed! ✅</h2>
        <p>Hi ${booking.customerName},</p>
        <p>Your appointment for <strong>${
          service.name
        }</strong> has been successfully booked.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>📅 Date:</strong> ${formattedDate}</p>
            <p><strong>🆔 Booking ID:</strong> ${booking.bookingId || "N/A"}</p>
            <p><strong>🕒 Duration:</strong> ${service.durationMin} mins</p>
            <p><strong>📍 Location:</strong> ${org.address || "Online/TBD"}</p>
            ${
              booking.customerMobile
                ? `<p><strong>📱 Mobile:</strong> ${booking.customerMobile}</p>`
                : ""
            }
             <p><strong>💰 Price:</strong> ${
               service.price > 0 ? "Pay at venue: " + service.price : "Free"
             }</p>
        </div>

        <p><a href="${mapLink}" style="background-color: ${
      org.primaryColor || "#4F46E5"
    }; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Directions</a></p>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">Need to reschedule? <a href="${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/booking/${
      booking.id
    }">Manage your booking here</a> or reply to this email.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${org.name}" <${process.env.SMTP_USER}>`,
      to: booking.customerEmail,
      subject: `Booking Confirmed: ${service.name} at ${org.name}`,
      html: html,
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
          booking.startTime
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
              newTime
            ).toLocaleString()}</p>
        </div>

        <p>If this time doesn't work for you, please contact us or reply to this email.</p>
        
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>
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
              booking.startTime
            ).toLocaleString()}</p>
        </div>

        <p>We look forward to seeing you!</p>
        
        <p style="font-size: 13px; color: #666; margin-top: 30px;">
           <a href="${
             process.env.FRONTEND_URL || "http://localhost:5173"
           }/booking/${booking.id}">View Booking Details</a>
        </p>
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
    console.log(
      `[Email] Monthly settlement reminder sent to ${org.contactEmail}`
    );
    return true;
  } catch (error) {
    console.error("Monthly Reminder Error:", error);
    return false;
  }
};
