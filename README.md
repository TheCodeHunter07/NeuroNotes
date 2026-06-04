# 🧠 NeuroNotes

NeuroNotes is a full-stack AI-powered notes management application that allows users to create, organize, search, summarize, and export notes efficiently.

Built with React, FastAPI, PostgreSQL/SQLite, and Groq AI, NeuroNotes combines modern note-taking capabilities with AI-powered summarization to improve productivity and knowledge management.

---

## 🚀 Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Secure Logout

### Notes Management

* Create Notes
* Edit Notes
* Delete Notes
* Pin Important Notes
* Tag-Based Organization

### Search & Filtering

* Search Notes by Title
* Search Notes by Content
* Filter Notes by Tags

### AI Features

* AI-Powered Note Summarization
* Groq API Integration
* Expandable/Collapsible Summaries

### Export Features

* Export Notes as PDF
* Include AI Summary in PDF Export

### Dashboard

* Total Notes Statistics
* Pinned Notes Statistics
* Tags Statistics
* Responsive User Interface

### User Experience

* Mobile Responsive Design
* Toast Notifications
* Smooth Scrolling
* Delete Confirmation
* Modern Dark Theme

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Axios
* React Hot Toast
* jsPDF

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Python

### Database

* PostgreSQL / SQLite

### AI

* Groq API

---

## 📂 Project Structure

NeuroNotes/

├── backend/

│ ├── app/

│ ├── routes/

│ ├── models/

│ ├── services/

│ ├── schemas/

│ └── main.py

│

├── frontend/

│ ├── src/

│ ├── components/

│ ├── pages/

│ ├── services/

│ └── App.jsx

│

└── README.md

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/NeuroNotes.git

cd NeuroNotes
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_groq_api_key

SECRET_KEY=your_secret_key

DATABASE_URL=your_database_url
```

---

## 📸 Screenshots


---

## 🎯 Learning Outcomes

This project demonstrates:

* Full Stack Development
* REST API Development
* JWT Authentication
* Database Design
* React State Management
* AI Integration
* PDF Generation
* Responsive UI Design
* Deployment Workflow

---

## 🔮 Future Improvements

* Rich Text Notes
* Dark/Light Theme Toggle
* AI Note Categorization
* Note Sharing
* Cloud Storage Integration
* Advanced Search Filters

---

## 👨‍💻 Author

Sumit Lokhande

Full Stack Developer | AI Enthusiast

Built as a portfolio project to demonstrate modern full-stack development skills using React, FastAPI, and AI integration.
