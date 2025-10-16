# Hospital Management System

A full-stack Hospital Management System with a React (Vite) frontend and Node/Express + Sequelize backend (MySQL), plus Google Calendar integration.

- Patient and doctor management
- Appointments and financial tracking dashboard
- Google Calendar event creation for appointments
- WhatsApp chat frontend (planned) for booking appointments via a conversational bot flow

## Screenshots / Visuals

Hero cover image used on the Home page:

![Home Cover](images/1.jpeg)



![Public Image](images/2.jpeg)

![Public Image](images/3.jpeg)

![Public Image](images/4.jpeg)

## Prerequisites
- Node.js 18+
- MySQL 8+ (or compatible)

## Quick Start

### Backend
1. Create `backend/.env` 

2. Install and run:
```
cd backend
npm install
npm run start
```

### Frontend
1. Create `app/.env` with:
```
VITE_API_BASE_URL=http://localhost:3001
```
2. Install and run:
```
cd app
npm install
npm run dev
```

### Development URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## WhatsApp Conversational Booking (Planned)
This project will include a WhatsApp chat frontend where patients can book appointments through a conversational bot flow. The intended flow is:
- User opens WhatsApp chat and initiates booking
- Conversational prompts collect name, age, symptoms, preferred date & time, and doctor
- The bot calls backend APIs to create the appointment and (optionally) create a Google Calendar event
- Confirmation and reminders are sent back via WhatsApp
