# Vital Hope – Healthcare Assistance Platform

Vital Hope is a full-stack healthcare assistance platform designed to help patients quickly find nearby hospitals, check real-time bed availability, consult medical experts via live video, and get assistance with billing policies and treatment support.

The system connects **Patients**, **Hospitals/Admins**, and **Medical Experts** on a unified platform.

---

## Features

### Patient
- View nearby hospitals based on current location  
- Check real-time bed availability  
- Connect to a medical expert via live video consultation  
- Ask questions about hospital billing, terms, and policies using an AI chatbot  

### Hospital / Admin
- Register hospital with address and facility details  
- Upload billing brochures and terms & conditions  
- Update bed availability in real time  
- Manage hospital information via admin dashboard  

### Medical Expert
- View and accept video consultation requests  
- Assist patients through live video sessions  
- Use a drug recommendation system based on patient symptoms  

---

## Tech Stack

### Frontend
- React.js  
- HTML, CSS, JavaScript  
- Map integration (Google Maps / Leaflet)

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### Real-Time Communication
- WebRTC (video conferencing)  
- Socket.io (real-time updates)

### AI Components
- Drug Recommendation System: Random Forest  
- Chatbot: Multimodal RAG  
  - LangChain  
  - OpenAI  
  - FAISS  

---

## System Architecture Overview

The platform is divided into three main modules:

1. Patient Module  
2. Hospital/Admin Module  
3. Medical Expert Module  

Backend services handle:
- Authentication  
- Video call signaling  
- Bed availability updates  
- Chatbot query handling  
- Drug prediction API  

---

## Workflow

### Patient Flow
1. Patient logs in  
2. Location is detected  
3. Nearby hospitals and bed availability are displayed  
4. Patient can:
   - Start a video consultation  
   - Ask chatbot queries  

### Hospital/Admin Flow
1. Hospital registers on platform  
2. Uploads brochures and billing documents  
3. Updates bed availability through dashboard  

### Medical Expert Flow
1. Expert logs in  
2. Views consultation requests  
3. Joins video session  
4. Uses drug recommendation tool  

---

## Project Structure (Suggested)

vital-hope/
│
├── frontend/ # React application
├── backend/ # Node.js + Express server
├── ml-model/ # Drug recommendation model
├── chatbot/ # RAG pipeline
└── README.md


---

## Installation (Local Setup)

### Backend
```bash
cd backend
npm install
npm start


Future Improvements

Deployment on cloud infrastructure

Mobile responsiveness improvements

Role-based access control enhancements

Advanced analytics for hospitals

Electronic Health Record (EHR) integration


Use Cases

Emergency hospital search

Remote medical consultation

Transparent billing information

Assisted medical guidance

Author

Sachin Lovanshi