# AssetLog

**Asset Tracking System** — A lightweight, offline-first web app for tracking company asset checkouts and returns. No server, no database, no internet required.

Developed by **Naif Almalki** · naif.almalkisau@gmail.com

---

## Overview

AssetLog lets employees check out company assets (vehicles, tablets, equipment, etc.) without needing an account, while giving admins full visibility, control, and reporting from a dedicated panel.

---

## Features

### Public Checkout Page (`index.html`)
- Branded hero showing department/company name (set by admin) above the system title
- Browse available asset types and select individual assets
- Check out an asset by entering name, phone, and email — no account needed
- Return an asset via name lookup (Return Asset button in header)
- Favicon displayed in browser tab

### Admin Panel (`admin.html`)

**Login:**
- Remember Me checkbox — saves username for next visit
- Auto-restores active sessions (no re-login needed within 8 hours)
- Password visibility toggle (eye icon) — click to show or hide the password field

**Sidebar navigation:**

| Section | Description |
|---|---|
| Dashboard | Live stats — total checkouts, currently out, available assets, today's activity. Click any card to drill into records. |
| Records | Full checkout history with filters (type, asset, user, status, date range). Checked-out/returned columns show date + time stacked. Excel and PDF export. Admin can return any checked-out asset directly from the table. |
| Reports | Report builder with custom date, type, and status filters. Preview table + export to Excel or PDF. |
| Assets | Manage individual assets — add, edit, enable/disable, delete. Filter by type. **Admin Checkout** button lets admins check out any available asset under any name, phone, and email without going through the public page. |
| Asset Types | Define asset categories with icon, color, and description. Enable/disable types. |
| Users | Saved user directory with search. Bulk CSV import (download template → fill → upload). Add/edit/delete users manually. |
| Settings | Admin accounts (add/edit/delete), My Credentials (change username/password), Branding (set department/company name shown on checkout page). |
| Audit Log | Timestamped record of every admin action. Color-coded: green = add, red = delete, blue = login/logout. Clearable. |

---

## Tech Stack

- **Pure HTML / CSS / JavaScript** — no frameworks, no build step, no dependencies
- **localStorage** — all data stored in the browser on the device
- **Offline libraries** (bundled in `/libs`, no CDN needed):
  - [SheetJS](https://sheetjs.com/) — Excel export
  - [jsPDF](https://github.com/parallax/jsPDF) + AutoTable — PDF export

---

## File Structure

```
AssetLog/
├── index.html          # Public checkout page
├── admin.html          # Admin panel
├── app.js              # Data layer — all localStorage logic, settings, audit log
├── styles.css          # Shared styles
├── libs/
│   ├── xlsx.min.js
│   ├── jspdf.min.js
│   └── jspdf.autotable.min.js
└── README.md
```

---

## Getting Started

### Local
Open `index.html` in any modern browser. No server or internet needed.

For the admin panel, open `admin.html` and sign in with:
- **Username:** `admin`
- **Password:** `admin123`

> Change credentials immediately after first login via **Settings → My Credentials**.

### Online (coming soon)
Will be deployed as a static site — no backend required since all data lives in the browser.

---

## Default Data

On first load, the app seeds the following if no data exists:

**Asset Types:** Cars · Tablets

**Assets:** Toyota Fortuner, Toyota Vios, Mitsubishi Strada, Mitsubishi Montero, iPad Air ×2, Samsung Galaxy Tab A, iPad Pro

All defaults can be edited or deleted from the admin panel.

---

## Data & Privacy

All data is stored in **browser localStorage** on the device running the app. Nothing is ever sent to a server. Clearing browser storage will erase all records — export to Excel/PDF regularly for backups.

---

## License

Private project — all rights reserved.
© Naif Almalki
