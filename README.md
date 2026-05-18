# URL Shortener Frontend

A modern, high-performance, and secure URL Shortener Frontend built with **React 19**, **TypeScript**, and **Tailwind CSS 4**. This project provides a professional interface for managing short links with real-time statistics and advanced security features.

---

## ⚡ Features

- **URL Shortening**: Easily create short, manageable links from long URLs.
- **Dynamic Dashboard**: Real-time tracking of active links and total click impact.
- **Secure Authentication**: 
  - JWT-based authentication.
  - Google OAuth integration.
- **Advanced Security**: 
  - reCAPTCHA v3 integration to prevent bot abuse.
  - Protected routes and Admin-only user management.
- **Modern UI/UX**:
  - Built with **Tailwind CSS 4** for lightning-fast styling.
  - Smooth animations using **Framer Motion**.
  - Beautiful iconography from **Lucide React**.
- **Management Tools**: 
  - Search and pagination for link management.
  - One-click copy to clipboard.
  - Link deletion and destination preview.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Auth**: `@react-oauth/google`, `jwt-decode`
- **Security**: `react-google-recaptcha-v3`

---

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd url-shortener-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your configuration:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

- `src/components`: Reusable UI components.
- `src/context`: Authentication and global state management.
- `src/pages`: Main application views (Dashboard, Landing, Login, etc.).
- `src/services`: API client and backend communication.
- `src/assets`: Static assets and images.

---

## 📄 License & Attribution

This project is licensed under the **Apache License 2.0**.

### Attribution Requirement
According to the terms of the Apache License 2.0, any person or entity using, reproducing, or distributing this software (or derivative works thereof) **must provide clear attribution to the original author**:

**Author: Azhar Faturohman Ahidin**

For more details, please see the [LICENSE](./LICENSE) file.

---

Built with ❤️ by [Azhar Faturohman Ahidin](https://github.com/azharf99)
