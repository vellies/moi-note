# Moi Note - Product Requirements Document (PRD)

## Project Overview

Moi Note is a web application designed to manage traditional Moi collections for weddings, housewarming ceremonies, temple festivals, birthdays, ear-piercing ceremonies, and other events.

Users can create multiple functions and maintain separate Moi records for each function. The system should provide reporting, search, export capabilities, and voice-based entry support.

## User Roles

### Admin
- View all users
- View all functions
- View all Moi entries
- Manage users
- Analytics and reports

### User
- Register/Login
- Create multiple functions
- Add/Edit/Delete Moi entries
- Search records
- Export reports

## Technical Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn UI
- MongoDB Atlas
- NextAuth v5
- Zod
- Mongoose

## Core Modules

### Authentication
- Register
- Login
- JWT Session
- Role-based access

### Function Management
- Wedding
- House Warming
- Birthday
- Temple Festival
- Engagement

### Moi Entry Management
Fields:
- Contributor Name
- Place
- Mobile Number
- Amount
- Payment Mode
- Notes

### Voice-to-Text
- Browser Speech Recognition
- Tamil Support
- English Support

### Reports
- Function Summary
- Collection Summary
- Export Excel
- Export PDF

### Future Features
- Return Moi Tracking
- WhatsApp Notifications
- Mobile App
- AI-assisted Entry

## Success Criteria

- Fast data entry
- Multiple functions per user
- Accurate reports
- Easy exports
