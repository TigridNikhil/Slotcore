# Slotcore JavaScript SDK

Official JavaScript SDK for the Slotcore Scheduling Infrastructure. Use this SDK to easily integrate Slotcore's powerful booking and availability features into your web application or Node.js server.

## Installation

```bash
npm install slotcore-sdk  # Coming soon!
```

For now, you can include `Slotcore.js` directly in your project.

## Quick Start

### Initialize

```javascript
const Slotcore = require("./Slotcore");
const slotcore = new Slotcore("your_api_key");
```

### Check Availability

```javascript
const slots = await slotcore.availability.list({
  serviceId: "service_uuid",
  date: "2024-03-10",
});
console.log(slots);
```

### Create a Booking

```javascript
const booking = await slotcore.bookings.create({
  serviceId: "service_uuid",
  startTime: "2024-03-10T10:00:00Z",
  customerName: "John Doe",
  customerEmail: "john@example.com",
});
```

## Features

- **Availability**: Dynamically query available time slots for any service.
- **Bookings**: Create, retrieve, and cancel appointments.
- **Services**: Fetch active services and their details (pricing, duration, etc.).
- **Multi-tenancy**: Support for tenant-specific context using `tenantSlug`.
- **Hybrid Support**: Works in both Node.js and modern browsers.

## Authentication

The SDK supports both Public Keys (`pk_...`) for client-side use and Secret Keys (`sk_...`) for server-side management.

```javascript
// Server-side (Full Access)
const slotcore = new Slotcore("sk_live_...");

// Client-side (Restricted Access)
const slotcore = new Slotcore("pk_live_...");
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT
