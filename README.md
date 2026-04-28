# Service Hub

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)]()
[![Build: Passed](https://img.shields.io/badge/Build-Passed-blue.svg)]()
[![Milestone: v0.3](https://img.shields.io/badge/Milestone-v0.3-orange.svg)]()

A high-performance service marketplace platform designed to bridge the gap between clients and specialized service providers. Built with a focus on reliability, real-time feedback loops, and data-driven quality metrics (NPS).

## 🚀 Overview

Service Hub is a full-stack solution that manages the entire lifecycle of a service contract—from marketplace discovery to quality assessment. The platform features a robust authentication system, service management, and a specialized Net Promoter Score (NPS) analytics dashboard for providers.

## 🛠 Tech Stack

### Frontend
- **React (Vite):** Modern SPA architecture for seamless user experience.
- **TailwindCSS:** Utility-first styling for responsive and polished UI.
- **React Router DOM:** Client-side routing.
- **Axios:** Reliable HTTP communication with the API.

### Backend
- **Node.js & Express:** Scalable RESTful API architecture.
- **MongoDB (Mongoose):** Document-oriented database for flexible data modeling.
- **JWT & Bcrypt:** Industry-standard security for authentication and data protection.
- **Socket.io:** Ready for real-time status updates and notifications.

## 📋 Core Business Logic

- **Marketplace Logic:** Dynamic service listing with provider/client relationships.
- **Validation Engine:** Strict business rules for service execution and status transitions.
- **NPS Feedback Loop:** Automated calculation of Promoters, Passives, and Detractors. Reviews are locked until service completion to ensure data integrity.

## 📅 Roadmap & Milestones

- [x] **v0.1 - Foundation:** Project initialization, environment setup, and JWT Auth.
- [x] **v0.2 - Core Engine:** Services CRUD, Marketplace UI, and Database integration.
- [x] **v0.3 - Quality Metrics:** Reviews system and NPS Analytics Dashboard.
- [ ] **v0.4 - Real-Time:** WebSocket integration for instant notifications.
- [ ] **v1.0 - Delivery:** Final production deployment and documentation.

## ⚙️ Getting Started

### Backend
1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Configure `.env` (MONGODB_URI, JWT_SECRET, PORT)
4. Start the server: `npm start`

### Frontend
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Configure `.env` (VITE_API_URL)
4. Start development server: `npm run dev`

---
*Developed for the Trends in Technology Course - W2026.*
