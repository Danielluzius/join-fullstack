# 📋 JOIN — Kanban Project Management Tool

A modern, collaborative task management application built with **Angular 19** and **Firebase**.

<p align="center">
  <img alt="Angular" src="https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="SCSS" src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-000000?style=for-the-badge" />
  <img alt="Build" src="https://img.shields.io/github/actions/workflow/status/yourusername/join/ci.yml?style=for-the-badge&logo=github&label=Build&color=0A0A0A" />
</p>

<p align="center">
  <a href="#about">About</a> • 
  <a href="#features">Features</a> • 
  <a href="#tech-stack">Tech Stack</a> • 
  <a href="#installation">Installation</a> • 
  <a href="#architecture">Architecture</a> • 
  <a href="#security-features">Security</a> • 
  <a href="#usage">Usage</a> • 
  <a href="#contributing">Contributing</a> • 
  <a href="#license">License</a>
</p>

---

## 🎯 About

**JOIN** is a feature-rich **Kanban board** that helps teams organize and manage projects efficiently.  
It delivers a smooth experience with **real-time updates**, **drag & drop**, and **secure Firebase authentication**.

---

## 🌟 Highlights

| Feature | Description |
|:--|:--|
| 🔐 **Security** | Multi-layer authentication & session sync |
| 🎨 **UI/UX** | Modern, responsive layout with smooth animations |
| ⚡ **Real-Time** | Live updates across all devices & tabs |
| 🌓 **Dual Mode** | Public / Private board modes |
| ♿ **Accessibility** | WCAG-compliant & keyboard navigation |

---

## ✨ Features

### 🎯 Core Functionality
- Kanban Board: **To Do**, **In Progress**, **Await Feedback**, **Done**
- Drag & Drop (Angular CDK)
- Smart search, filtering, and tagging
- Priority levels with colored indicators
- Detailed modal for each task

### 📝 Advanced Task Management
- Subtasks with progress tracking  
- Assign team members, set categories  
- Real-time Firestore synchronization  

### 👥 Contacts & Dashboard
- Contact CRUD with avatar generation  
- Dashboard overview: task stats, deadlines, and urgent tasks  

---

## 🔐 Security Features

### 🔄 Multi-Tab Session Sync
Real-time logout/login detection using `localStorage` events.  
Guards prevent unauthorized route access.

### 🔑 Authentication
- SHA-256 client-side password hashing  
- Firebase Authentication  
- Session persistence and cleanup on logout  

### 🧱 Firestore Rules
- Read: Authenticated users  
- Write: Document owners only  
- Public/Private separation for data visibility  

---

## 🛠 Tech Stack

**Frontend**
- Angular 19 (Standalone Components, Signals API)
- TypeScript 5.5
- SCSS
- RxJS
- Angular CDK (DnD)

**Backend**
- Firebase Firestore (Realtime DB)
- Firebase Auth
- Firestore Security Rules

---

## 📸 Screenshots

> All screenshots are stored in [`assets/screenshots/`](./assets/screenshots/)  
> Replace placeholders with your actual images.

| View | Screenshot |



## 👤 Authors

**Daniel Luzius**  
📧 [daniel.luzius@example.com](mailto:daniel.luzius@example.com)  
🌐 [daniel-luzius.dev](https://daniel-luzius.dev)  
🐙 GitHub: [@daniel-luzius](https://github.com/daniel-luzius)  
💼 LinkedIn: [Daniel Luzius](https://linkedin.com/in/daniel-luzius)

**Kajanan Yoganathan**  
📧 [kajanan.yoganathan@example.com](mailto:kajanan.yoganathan@example.com)  
🌐 [kajanan.dev](https://kajanan.dev)  
🐙 GitHub: [@kajanan-yoganathan](https://github.com/kajanan-yoganathan)  
💼 LinkedIn: [Kajanan Yoganathan](https://linkedin.com/in/kajanan-yoganathan)

**Patrick Schmidt**  
📧 [kontakt@patrick-schmidt.info](mailto:kontakt@patrick-schmidt.info)  
🌐 [patrick-schmidt.info](https://patrick-schmidt.info)  
🐙 GitHub: [@yourhandle](https://github.com/yourhandle)  
💼 LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [Angular Team](https://angular.io)
- [Firebase](https://firebase.google.com)
- [Developer Akademie](https://www.developer-akademie.de)
- Open Source Community

---

> ⭐ **If you find this project helpful, give it a star!**  
> Made with ❤️ and ☕ in Germany

---

## 🚀 Installation

### 📦 Prerequisites
- Node.js ≥ 18.x  
- npm ≥ 9.x  
- Angular CLI ≥ 19.x  

### ⚙️ Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/join.git
cd join

# Install dependencies
npm install

# Run dev server
ng serve
# Open http://localhost:4200

Config Firebase
// src/app/app.config.ts
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

